import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppPage from './Pages/acceuil';
import Cer from './Pages/cers';
import Fav from './Pages/favoris';
import Gestion from './Pages/gestion';
import Connexion from './Pages/connexion';
import Inscription from './Pages/inscription';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AppPage />} />
        <Route path="/cer" element={<Cer />} />
        <Route path="/favoris" element={<Fav />} />
        <Route path="/gestion" element={<Gestion />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
      </Routes>
    </Router>
  </StrictMode>
);