const { Bot, InlineKeyboard, session } = require('grammy');
const { webhookCallback } = require('grammy');
const fs = require('fs');
const path = require('path');

// ─── DATA ────────────────────────────────────────
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data/orders.json');
const ADMINS = (process.env.BOT_ADMINS || '').split(',').map(Number).filter(Boolean);

let products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
let orders = [];
try { orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); } catch {}

function saveOrders() {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function genOrderId() {
  return 'KD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

// Ensure data dir exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const PAYMENT_INFO = {
  bank: 'BCA',
  name: 'KodeID Store',
  number: process.env.PAYMENT_NUMBER || '1234567890',
};

// ─── BOT SETUP ────────────────────────────────────
const bot = new Bot(process.env.BOT_TOKEN);

bot.use(session({ initial: () => ({}) }));

// ─── HELPERS ──────────────────────────────────────
const fmtPrice = (n) => `Rp${n.toLocaleString('id-ID')}`;

function productKeyboard() {
  const kb = new InlineKeyboard();
  for (const [key, cat] of Object.entries(products.categories)) {
    const count = products.products.filter(p => p.category === key && p.active).length;
    kb.text(`${cat.icon} ${cat.name} (${count})`, `cat_${key}`);
    kb.row();
  }
  kb.text('🛒 Keranjang', 'cart').text('❓ Bantuan', 'help');
  return kb;
}

function productListKeyboard(catKey) {
  const items = products.products.filter(p => p.category === catKey && p.active);
  const kb = new InlineKeyboard();
  items.forEach(p => {
    kb.text(`${p.name} - ${fmtPrice(p.price)}`, `prod_${p.id}`);
    kb.row();
  });
  kb.text('⬅️ Kembali', 'menu');
  return kb;
}

function genProductCard(p) {
  const disc = Math.round((1 - p.price / p.original_price) * 100);
  return `*${p.name}*
${p.description}

💰 Harga: ~~${fmtPrice(p.original_price)}~~ → *${fmtPrice(p.price)}* (hemat ${disc}%)
📦 Stok: ${p.stock > 100 ? '✅ Tersedia' : `⚠️ Sisa ${p.stock}`}

*Fitur:*
${p.features.map(f => `• ${f}`).join('\n')}

Klik tombol di bawah untuk order.`;
}

// ─── COMMANDS ────────────────────────────────────
bot.command('start', async (ctx) => {
  await ctx.reply(
    `*🛍️ Selamat datang di KodeID Store!*

Jual software original harga murah:
• Windows 10/11 Pro
• Microsoft Office
• Antivirus
• Dan lainnya

👇 KLIK TOMBOL DI BAWAH 👇`,
    { parse_mode: 'Markdown', reply_markup: productKeyboard() }
  );
});

bot.command('menu', async (ctx) => {
  await ctx.reply('📋 *Menu Utama KodeID Store*', {
    parse_mode: 'Markdown',
    reply_markup: productKeyboard()
  });
});

bot.command('produk', async (ctx) => {
  await ctx.reply('📋 *Kategori Produk:*', {
    parse_mode: 'Markdown',
    reply_markup: productKeyboard()
  });
});

bot.command('status', async (ctx) => {
  const text = ctx.message?.text || '';
  const parts = text.split(' ');
  const orderId = parts[1];
  if (!orderId) {
    return ctx.reply('Gunakan: /status KDxxxx\nContoh: /status KDA1B2C3');
  }
  const order = orders.find(o => o.id === orderId.toUpperCase());
  if (!order) return ctx.reply('❌ Order tidak ditemukan.');
  
  const statusEmoji = { pending: '⏳', confirmed: '✅', done: '🔑', cancelled: '❌' };
  await ctx.reply(
    `*Status Order ${order.id}*
    
Produk: ${order.productName}
Status: ${statusEmoji[order.status] || '❓'} ${order.status.toUpperCase()}
Harga: ${fmtPrice(order.amount)}
Tanggal: ${new Date(order.date).toLocaleString('id-ID')}
${order.key ? `\n🔑 *License Key:* \`${order.key}\`` : ''}`,
    { parse_mode: 'Markdown' }
  );
});

// ─── INLINE BUTTON HANDLERS ───────────────────────
bot.callbackQuery(/^cat_(.+)/, async (ctx) => {
  const catKey = ctx.match[1];
  const cat = products.categories[catKey];
  const items = products.products.filter(p => p.category === catKey && p.active);
  
  if (items.length === 0) {
    return ctx.answerCallbackQuery('Kategori kosong.');
  }
  
  let msg = `*${cat.icon} ${cat.name}*\n\n`;
  items.forEach((p, i) => {
    const disc = Math.round((1 - p.price / p.original_price) * 100);
    msg += `${i + 1}. *${p.name}*\n`;
    msg += `   ${fmtPrice(p.price)} ~~${fmtPrice(p.original_price)}~~ (-${disc}%)\n`;
    msg += `   ${p.description}\n\n`;
  });
  
  try {
    await ctx.editMessageText(msg, {
      parse_mode: 'Markdown',
      reply_markup: productListKeyboard(catKey)
    });
  } catch { /* ignore edit errors */ }
  await ctx.answerCallbackQuery();
});

bot.callbackQuery(/^prod_(.+)/, async (ctx) => {
  const prodId = ctx.match[1];
  const p = products.products.find(x => x.id === prodId);
  if (!p) return ctx.answerCallbackQuery('Produk tidak ditemukan.');
  
  const kb = new InlineKeyboard()
    .text('🛒 Beli Sekarang', `buy_${p.id}`)
    .row()
    .text('⬅️ Kembali', `cat_${p.category}`);
  
  try {
    await ctx.editMessageText(genProductCard(p), {
      parse_mode: 'Markdown',
      reply_markup: kb
    });
  } catch {}
  await ctx.answerCallbackQuery();
});

bot.callbackQuery(/^buy_(.+)/, async (ctx) => {
  const prodId = ctx.match[1];
  const p = products.products.find(x => x.id === prodId);
  if (!p) return ctx.answerCallbackQuery('❌ Produk tidak tersedia.');
  if (p.stock <= 0) return ctx.answerCallbackQuery('❌ Stok habis!');
  
  const orderId = genOrderId();
  const user = ctx.from;
  
  const order = {
    id: orderId,
    userId: user.id,
    username: user.username || user.first_name,
    productId: p.id,
    productName: p.name,
    amount: p.price,
    status: 'pending',
    date: new Date().toISOString(),
    key: null,
  };
  
  orders.push(order);
  saveOrders();
  
  const kb = new InlineKeyboard()
    .text('✅ Sudah Transfer', `pay_${orderId}`)
    .row()
    .text('❌ Batalkan', `cancel_${orderId}`);
  
  try {
    await ctx.editMessageText(
      `*🧾 INVOICE #${orderId}*

*Produk:* ${p.name}
*Harga:* ${fmtPrice(p.amount)}

*💳 Pembayaran:*
Bank: ${PAYMENT_INFO.bank}
No. Rek: \`${PAYMENT_INFO.number}\`
Atas Nama: ${PAYMENT_INFO.name}

*Total Transfer:* ${fmtPrice(p.amount)}

📌 Kirim bukti transfer dengan klik tombol *"Sudah Transfer"*

Atau kirim manual ke @kodeidboys`,
      { parse_mode: 'Markdown', reply_markup: kb }
    );
  } catch {}
  await ctx.answerCallbackQuery(`✅ Invoice #${orderId} dibuat`);
  
  // Notify admins
  for (const adminId of ADMINS) {
    try {
      await bot.api.sendMessage(adminId,
        `🆕 *Order Baru!*\n\nID: \`${orderId}\`\nProduk: ${p.name}\nUser: @${order.username}\nHarga: ${fmtPrice(p.amount)}\n\n/bayar ${orderId} untuk konfirmasi`,
        { parse_mode: 'Markdown' }
      );
    } catch {}
  }
});

bot.callbackQuery(/^pay_(.+)/, async (ctx) => {
  const orderId = ctx.match[1];
  const order = orders.find(o => o.id === orderId);
  if (!order) return ctx.answerCallbackQuery('❌ Order tidak ditemukan.');
  if (order.userId !== ctx.from.id) return ctx.answerCallbackQuery('❌ Ini bukan order kamu!');
  if (order.status !== 'pending') return ctx.answerCallbackQuery(`Status sudah: ${order.status}`);
  
  order.status = 'confirmed';
  saveOrders();
  
  const kb = new InlineKeyboard().text('⬅️ Kembali ke Menu', 'menu');
  
  try {
    await ctx.editMessageText(
      `✅ *Bukti transfer diterima!*

Order #${orderId} menunggu konfirmasi admin.
License key akan dikirim dalam 1-24 jam.

Cek status: /status ${orderId}`,
      { parse_mode: 'Markdown', reply_markup: kb }
    );
  } catch {}
  await ctx.answerCallbackQuery('✅ Menunggu konfirmasi admin');
  
  // Notify admins
  for (const adminId of ADMINS) {
    try {
      await bot.api.sendMessage(adminId,
        `💳 *User Konfirmasi Bayar*\n\nOrder: \`${orderId}\`\nUser: @${order.username}\nProduk: ${order.productName}\nJumlah: ${fmtPrice(order.amount)}\n\n/kirim ${orderId} KEY_xxxx`,
        { parse_mode: 'Markdown' }
      );
    } catch {}
  }
});

bot.callbackQuery(/^cancel_(.+)/, async (ctx) => {
  const orderId = ctx.match[1];
  const order = orders.find(o => o.id === orderId);
  if (!order) return ctx.answerCallbackQuery('❌ Order tidak ditemukan.');
  if (order.userId !== ctx.from.id) return ctx.answerCallbackQuery('❌ Ini bukan order kamu!');
  
  order.status = 'cancelled';
  saveOrders();
  
  try {
    await ctx.editMessageText(`❌ Order #${orderId} dibatalkan.`, {
      reply_markup: new InlineKeyboard().text('⬅️ Menu', 'menu')
    });
  } catch {}
  await ctx.answerCallbackQuery('❌ Order dibatalkan.');
});

bot.callbackQuery('menu', async (ctx) => {
  try {
    await ctx.editMessageText('📋 *Menu Utama KodeID Store*\n\nPilih kategori produk:', {
      parse_mode: 'Markdown',
      reply_markup: productKeyboard()
    });
  } catch {}
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('help', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    `*❓ Bantuan KodeID Store*

1. Pilih produk dari menu
2. Transfer sesuai total ke rekening ${PAYMENT_INFO.bank}
3. Klik "Sudah Transfer"
4. Admin akan kirim license key

*Commands:*
/menu - Menu utama
/produk - Lihat produk
/status KODE - Cek status order

Ada kendala? Hubungi @kodeidboys`,
    { parse_mode: 'Markdown' }
  );
});

bot.callbackQuery('cart', async (ctx) => {
  const userOrders = orders.filter(o => o.userId === ctx.from.id && o.status === 'pending');
  if (userOrders.length === 0) {
    return ctx.answerCallbackQuery('✅ Tidak ada order pending.');
  }
  let msg = `*🛒 Order Pending Kamu (${userOrders.length})*\n\n`;
  userOrders.forEach((o, i) => {
    msg += `${i + 1}. ${o.productName} - ${fmtPrice(o.amount)}\n`;
    msg += `   ID: \`${o.id}\` | /status ${o.id}\n\n`;
  });
  try {
    await ctx.editMessageText(msg, {
      parse_mode: 'Markdown',
      reply_markup: new InlineKeyboard().text('⬅️ Menu', 'menu')
    });
  } catch {}
  await ctx.answerCallbackQuery();
});

// ─── ADMIN COMMANDS ────────────────────────────────
bot.command('bayar', async (ctx) => {
  if (!ADMINS.includes(ctx.from.id)) return ctx.reply('❌ Admin only.');
  const text = ctx.message.text || '';
  const parts = text.split(' ');
  const orderId = parts[1];
  if (!orderId) return ctx.reply('Gunakan: /bayar ORDER_ID');
  
  const order = orders.find(o => o.id === orderId.toUpperCase());
  if (!order) return ctx.reply('❌ Order tidak ditemukan.');
  
  order.status = 'confirmed';
  saveOrders();
  await ctx.reply(`✅ Order ${orderId} dikonfirmasi! Kirim key dengan /kirim ${orderId} KEY_xxxx`);
  
  try {
    await bot.api.sendMessage(order.userId,
      `✅ *Pembayaran ${orderId} Dikonfirmasi!*\n\nSebentar, license key akan dikirim oleh admin.`,
      { parse_mode: 'Markdown' }
    );
  } catch {}
});

bot.command('kirim', async (ctx) => {
  if (!ADMINS.includes(ctx.from.id)) return ctx.reply('❌ Admin only.');
  const text = ctx.message.text || '';
  const parts = text.split(' ');
  const orderId = parts[1];
  const key = parts.slice(2).join(' ');
  
  if (!orderId || !key) return ctx.reply('Gunakan: /kirim ORDER_ID LICENSE_KEY');
  
  const order = orders.find(o => o.id === orderId.toUpperCase());
  if (!order) return ctx.reply('❌ Order tidak ditemukan.');
  
  order.status = 'done';
  order.key = key;
  saveOrders();
  
  await ctx.reply(`✅ Key terkirim untuk ${orderId}`);
  
  try {
    await bot.api.sendMessage(order.userId,
      `*🔑 LICENSE KEY TERKIRIM!*\n\nOrder: \`${order.id}\`\nProduk: ${order.productName}\n\n\`\`\`\n${key}\n\`\`\`\n\n*Cara aktivasi:*\n1. Download installer\n2. Masukkan key di atas\n3. Selesai ✅\n\nTerima kasih telah berbelanja di KodeID Store! 🌟`,
      { parse_mode: 'Markdown' }
    );
  } catch {}
});

bot.command('orders', async (ctx) => {
  if (!ADMINS.includes(ctx.from.id)) return ctx.reply('❌ Admin only.');
  
  const pending = orders.filter(o => o.status === 'pending');
  const confirmed = orders.filter(o => o.status === 'confirmed');
  const done = orders.filter(o => o.status === 'done');
  
  await ctx.reply(
    `*📊 Laporan Order*\n\n` +
    `⏳ Pending: ${pending.length}\n` +
    `✅ Confirmed: ${confirmed.length}\n` +
    `🔑 Done: ${done.length}\n` +
    `❌ Cancelled: ${orders.filter(o => o.status === 'cancelled').length}\n` +
    `👥 Total: ${orders.length}\n\n` +
    (pending.length > 0 ? `*Pending terbaru:*\n${pending.slice(-5).map(o => `• \`${o.id}\` - ${o.productName} - @${o.username}`).join('\n')}` : ''),
    { parse_mode: 'Markdown' }
  );
});

bot.command('stok', async (ctx) => {
  if (!ADMINS.includes(ctx.from.id)) return ctx.reply('❌ Admin only.');
  let msg = '*📦 Stok Produk*\n\n';
  products.products.forEach(p => {
    msg += `${p.active ? '✅' : '❌'} ${p.name}: ${p.stock}\n`;
  });
  await ctx.reply(msg, { parse_mode: 'Markdown' });
});

// ─── ERROR HANDLING ──────────────────────────────
bot.catch((err) => {
  console.error('Bot error:', err.message);
});

// ─── EXPORT webhook handler ──────────────────────
module.exports = { bot, webhookHandler: webhookCallback(bot, 'express', { secretPath: '/bot' }) };
