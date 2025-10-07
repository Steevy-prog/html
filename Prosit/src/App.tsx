// Prosit/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiService from './services/apiService';

// Importez vos pages
import Acceuil from './Pages/acceuil';
import Connexion from './Pages/connexion';
import Inscription from './Pages/inscription';
import Cers from './Pages/cers';
import Favoris from './Pages/favoris';
import Gestion from './Pages/gestion';

// Composant pour protéger les routes
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiService.getCurrentUser();
      setIsAuthenticated(response.success);
    } catch {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/connexion" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Navigate to="/acceuil" />} />
        <Route path="/acceuil" element={<Acceuil />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/cers" element={<Cers />} />
        
        {/* Routes protégées */}
        <Route
          path="/favoris"
          element={
            <ProtectedRoute>
              <Favoris />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion"
          element={
            <ProtectedRoute>
              <Gestion />
            </ProtectedRoute>
          }
        />
        
        {/* Route 404 */}
        <Route path="*" element={<div className="text-center p-8">Page non trouvée</div>} />
      </Routes>
    </Router>
  );
}

export default App;