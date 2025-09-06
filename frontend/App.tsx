import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import Drawing from './pages/Drawing';

import NotFound from './pages/NotFound';
import DashboardRedirect from './pages/DashboardRedirect';
import ConversationSetup from './pages/ConversationSetup';
import Conversation from './pages/Conversation'; // <-- AÑADIDO
import AvatarCreator from './pages/AvatarCreator';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta Principal */}
          <Route path="/" element={<Index />} />

          {/* Ruta de redirección post-login/registro */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas de Pacientes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/drawing" element={<Drawing />} />
          <Route path="/avatar-creator" element={<AvatarCreator />} />
          
          <Route path="/conversation-setup" element={<ConversationSetup />} />
          <Route path="/conversation" element={<Conversation />} /> {/* <-- AÑADIDO */}

          {/* Rutas de Terapeutas */}
          <Route path="/therapist/dashboard" element={<TherapistDashboard />} />

          {/* Ruta para página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;