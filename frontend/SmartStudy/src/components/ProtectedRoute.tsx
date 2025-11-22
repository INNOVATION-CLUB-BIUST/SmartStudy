import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { getCurrentUser } from '../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requireOnboarding = false 
}: ProtectedRouteProps) => {
  const { user, loading } = useUser();
  const currentUser = getCurrentUser();
  const location = useLocation();

  // Show loading state while checking auth/user profile
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If route requires auth and user is not logged in
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but hasn't completed onboarding
  if (currentUser && user && !user.onboardingCompleted && requireOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user has completed onboarding but trying to access onboarding page
  if (currentUser && user?.onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
