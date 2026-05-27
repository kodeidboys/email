import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ImageGenerator from './pages/ImageGenerator';
import BackgroundRemover from './pages/BackgroundRemover';
import ImageUpscaler from './pages/ImageUpscaler';
import CanvasEditor from './pages/CanvasEditor';
import Enhance from './pages/Enhance';
import Projects from './pages/Projects';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              {/* Create */}
              <Route path="create/image-generator" element={<ImageGenerator />} />
              <Route path="create/illustration" element={<ImageGenerator />} />
              <Route path="create/character" element={<ImageGenerator />} />
              <Route path="create/logo" element={<ImageGenerator />} />
              <Route path="create/background" element={<ImageGenerator />} />
              {/* Edit */}
              <Route path="edit/bg-remover" element={<BackgroundRemover />} />
              <Route path="edit/bg-replacer" element={<BackgroundRemover />} />
              <Route path="edit/object-remover" element={<BackgroundRemover />} />
              <Route path="edit/generative-fill" element={<BackgroundRemover />} />
              <Route path="edit/upscaler" element={<ImageUpscaler />} />
              <Route path="edit/expander" element={<ImageUpscaler />} />
              <Route path="edit/color-restore" element={<Enhance />} />
              {/* Enhance */}
              <Route path="enhance/auto" element={<Enhance />} />
              <Route path="enhance/face" element={<Enhance />} />
              <Route path="enhance/filters" element={<Enhance />} />
              <Route path="enhance/style-transfer" element={<Enhance />} />
              <Route path="enhance/denoise" element={<Enhance />} />
              {/* Canvas */}
              <Route path="canvas" element={<CanvasEditor />} />
              {/* Projects */}
              <Route path="projects" element={<Projects />} />
              {/* Settings */}
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
