<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
//import { useUser } from './hooks';
//import Dashboard from './pages/Dashboard';
//import Onboarding from './pages/Onboarding';
//import StudyMode from './pages/StudyMode';
//import Analytics from './pages/Analytics';
//import Settings from './pages/Settings';
=======
/*import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import { AppProvider } from './context/AppContext';
import { useUser } from './hooks';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import StudyMode from './pages/StudyMode';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
>>>>>>> 6912962 (refactor App component to comment out routing logic)

// Main app routes component that uses the context
function AppRoutes() {
 // const { isOnboarded } = useUser();

  return (
    <Router>
      <div className="App">
        <Routes>
          {// Redirect to onboarding if user hasn't completed it }
          <Route 
            path="/" 
            element={
              <Navigate to="/dashboard"  />
            } 
          />
          
<<<<<<< HEAD
          {/* Onboarding flow */}
          
          
          {/* Main application routes 
          <Route path="/onboarding" element={<Onboarding />} />
=======
          {// Onboarding flow }
          <Route path="/onboarding" element={<Onboarding />} />
          
          {// Main application routes }
>>>>>>> 6912962 (refactor App component to comment out routing logic)
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/study-mode" element={<StudyMode />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
<<<<<<< HEAD
          */}

          {/* Catch-all route */}
=======
          
          {// Catch-all route }
>>>>>>> 6912962 (refactor App component to comment out routing logic)
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

*/