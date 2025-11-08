import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage'; // Import LoginPage
import { ProtectedRoute } from './components/ProtectedRoute';
//import { useUser } from './hooks';
//import StudyMode from './pages/StudyMode';
//import Analytics from './pages/Analytics';
//import Settings from './pages/Settings';

// Main app routes component that uses the context
function AppRoutes() {
 // const { isOnboarded } = useUser();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect to onboarding if user hasn't completed it */}
          <Route 
            path="/" 
            element={
               <HomePage />
            } 
          />
          
          {/* Onboarding flow - no auth required, create account during onboarding */}
          <Route 
            path="/onboarding" 
            element={<Onboarding />} 
          />
          <Route path="/get-started" element={<Navigate to="/onboarding" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Main application routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute requireAuth={true} requireOnboarding={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Additional routes 
          <Route path="/study-mode" element={<StudyMode />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          */}

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

// Main App component with context provider
function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
