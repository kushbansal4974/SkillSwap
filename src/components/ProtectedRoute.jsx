import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from './Loading';

/**
 * ProtectedRoute Guard
 * Ensures only authenticated users can access specific routes.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullPage text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login while preserving intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
