import { Settings as SettingsIcon, User, CreditCard, Palette, Key, Bell, Shield, Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <SettingsIcon size={22} className="text-primary" />
          Settings
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-light text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface border border-border rounded-xl p-6">
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">Account Settings</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <User size={28} className="text-white" />
                </div>
                <div>
                  <button className="text-sm text-primary font-medium hover:text-primary-hover">
                    Change Avatar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="w-full px-4 py-2.5 bg-surface-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary mb-1.5 block">Email</label>
                  <input
                    type="email"
                    defaultValue="user@example.com"
                    className="w-full px-4 py-2.5 bg-surface-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <button className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">Subscription</h2>
              <div className="bg-surface-secondary border border-border rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs bg-text-muted/20 text-text-secondary px-2 py-0.5 rounded-full font-medium">
                      CURRENT PLAN
                    </span>
                    <h3 className="text-lg font-bold text-text-primary mt-2">Free Plan</h3>
                    <p className="text-sm text-text-secondary">5 AI generations per day</p>
                  </div>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-lg hover:opacity-90">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
              {/* Plans */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Free', price: '$0', features: ['5 generations/day', 'Watermark', 'Basic editing'] },
                  { name: 'Pro', price: '$12', features: ['Unlimited generations', 'No watermark', 'All features', 'Priority queue'], popular: true },
                  { name: 'Enterprise', price: '$49', features: ['Everything in Pro', 'API access', 'Custom models', 'Team collab'] },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`border rounded-xl p-5 ${
                      plan.popular ? 'border-primary bg-primary-light/30' : 'border-border'
                    }`}
                  >
                    {plan.popular && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-text-primary mt-2">{plan.name}</h4>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {plan.price}<span className="text-sm font-normal text-text-muted">/mo</span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="text-sm text-text-secondary flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">Preferences</h2>
              
              {/* Theme Selection */}
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Appearance</h3>
                <p className="text-sm text-text-secondary mb-4">Choose your preferred theme for the interface</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => { if (theme !== 'light') toggleTheme(); }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                      <Sun size={22} className="text-amber-500" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">Light</span>
                  </button>
                  <button
                    onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                      <Moon size={22} className="text-indigo-300" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">Dark</span>
                  </button>
                  <button
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/30 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-900 border border-gray-300 rounded-xl flex items-center justify-center shadow-sm">
                      <Monitor size={22} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-text-primary">System</span>
                  </button>
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Language</h3>
                <select className="w-full max-w-xs px-4 py-2.5 bg-surface-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option>English</option>
                  <option>Bahasa Indonesia</option>
                  <option>日本語</option>
                  <option>한국어</option>
                </select>
              </div>

              {/* Default Export */}
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Default Export Format</h3>
                <div className="flex gap-2">
                  {['PNG', 'JPG', 'WebP', 'SVG'].map((format) => (
                    <button
                      key={format}
                      className="px-4 py-2 bg-surface-secondary border border-border rounded-lg text-sm text-text-secondary hover:border-primary/30 hover:text-primary"
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'account' && activeTab !== 'subscription' && activeTab !== 'preferences' && (
            <div className="text-center py-12">
              <SettingsIcon size={40} className="text-text-muted mx-auto mb-3" />
              <h3 className="font-medium text-text-primary">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-text-secondary mt-1">Settings panel coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
