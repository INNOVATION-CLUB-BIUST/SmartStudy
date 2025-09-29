/*import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import { AppProvider } from './context/AppContext';
import { useUser } from './hooks';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import StudyMode from './pages/StudyMode';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Main app routes component that uses the context
function AppRoutes() {
  const { isOnboarded } = useUser();

  return (
    <Router>
      <div className="App">
        <Routes>
          {// Redirect to onboarding if user hasn't completed it }
          <Route 
            path="/" 
            element={
              isOnboarded() ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />
            } 
          />
          
          {// Onboarding flow }
          <Route path="/onboarding" element={<Onboarding />} />
          
          {// Main application routes }
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/study-mode" element={<StudyMode />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          
          {// Catch-all route }
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
<<<<<<< HEAD
    </Router>
  );
=======
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save it so see changes
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
>>>>>>> 0cec95c (test 2)
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