import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRedirect = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // No hacer nada mientras el estado de autenticación está cargando
    if (isLoading) {
      return;
    }

    if (user?.role === 'patient') {
      navigate('/patient/dashboard', { replace: true });
    } else if (user?.role === 'psychologist') {
      navigate('/therapist/dashboard', { replace: true });
    } else {
      // Si por alguna razón no hay usuario o rol, ir a login
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Muestra un indicador de carga mientras se redirige
  return <div>Loading...</div>;
};

export default DashboardRedirect;
