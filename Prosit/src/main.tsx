import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import AppPage from './Pages/acceuil';
import CerDetail from './Pages/CerDetail';
import Fav from './Pages/favoris';
import Gestion from './Pages/gestion';
import Connexion from './Pages/connexion';
import Inscription from './Pages/InscriptionNew';
import CreateCer from './Pages/CreateCer';
import CersList from './Pages/CersList';
import Dashboard from './Pages/Dashboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppPage />} />
          <Route path="/acceuil" element={<AppPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cers" element={<CersList />} />
          <Route path="/cers/:id" element={<CerDetail />} />
          <Route path="/cers/create" element={<CreateCer />} />
          <Route path="/favoris" element={<Fav />} />
          <Route path="/gestion" element={<Gestion />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>
);