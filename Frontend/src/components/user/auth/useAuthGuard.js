import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('user_access_token');
    if (!accessToken) {
      navigate('/login');
    }
  }, [navigate]);
};

export default useAuthGuard;