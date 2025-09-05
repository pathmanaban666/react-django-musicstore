import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('admin_access_token');
    if (!accessToken) {
      navigate('/admin/login');
    }
  }, [navigate]);
};

export default useAuthGuard;