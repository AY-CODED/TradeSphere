import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LogoutButton = ({ className }) => {
  const [submitting, setSubmitting] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setSubmitting(true);
    try {
      await logout();
      navigate('/signin', { replace: true });
    } catch (error) {
      navigate('/signin', {
        replace: true,
        state: { message: `You were signed out locally, but the server could not confirm sign out: ${error.message}` },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button type="button" onClick={handleLogout} disabled={submitting} className={className}>
      {submitting ? 'Signing out…' : 'Sign out'}
    </button>
  );
};

export default LogoutButton;
