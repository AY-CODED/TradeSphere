import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RedirectAuthenticated = ({ children }) => {
  const { status } = useAuth();
  return status === 'authenticated' ? <Navigate to="/account" replace /> : children;
};

export default RedirectAuthenticated;
