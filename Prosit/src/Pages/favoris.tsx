import React, { useState, useEffect } from "react";
import Header from "../composants/header";
import Footer from "../composants/footer";

interface FavoriteCER {
  id: number;
  image: string;
  author: string;
  date: string;
  title: string;
  tags: string[];
  category: string;
  description: string;
  views: number;
  addedToFavorites: string;
}

function Favoris() {
  const [favoriteCers, setFavoriteCers] = useState<FavoriteCER[]>([
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
      author: "Marie Dubois.",
      date: "12 Nov 2024",
      title: "Prosit 3.2 Base de données",
      tags: ["SQL", "MySQL", "PostgreSQL"],
      category: "base-donnees",
      description:
        "Introduction aux systèmes de gestion de base de données relationnelles, conception de schémas, requêtes SQL avancées, optimisation des performances et sécurité des données.",
      views: 189,
      addedToFavorites: "10 Nov 2024",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      author: "Pierre Durand.",
      date: "05 Nov 2024",
      title: "Prosit 1.3 Réseaux",
      tags: ["TCP/IP", "Réseaux", "Administration"],
      category: "reseaux",
      description:
        "Introduction aux réseaux informatiques, protocoles TCP/IP, architecture client-serveur, configuration de réseaux locaux et concepts de base.",
      views: 134,
      addedToFavorites: "08 Nov 2024",
    },
  ]);

  // --- Functions ---

  const removeFavorite = (id: number) => {
    setFavoriteCers(favoriteCers.filter((cer) => cer.id !== id));
  };

  const updateStatistics = () => {
    return {
      totalFavorites: favoriteCers.length,
      totalCategories: [...new Set(favoriteCers.map((cer) => cer.category))]
        .length,
      lastAdded:
        favoriteCers.length > 0
          ? new Date(
              Math.max(
                ...favoriteCers.map(
                  (cer) => new Date(cer.addedToFavorites).getTime()
                )
              )
            ).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
          : "-",
      totalViews: favoriteCers.reduce((sum, cer) => sum + cer.views, 0),
    };
  };

  const stats = updateStatistics();

  // --- JSX Render ---

  return (
    <>
      <Header />
      <main>
        <div className="main-content">
          <div className="page-header">
            <h1>Mes CER Favoris</h1>
            <p>
              Retrouvez ici tous les CERs que vous avez ajoutés à vos favoris
              pour un accès rapide et facile.
            </p>
          </div>

          {/* Stats */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-number">{stats.totalFavorites}</div>
              <div className="stat-label">CERs Favoris</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalCategories}</div>
              <div className="stat-label">Catégories</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.lastAdded}</div>
              <div className="stat-label">Dernier ajout</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalViews}</div>
              <div className="stat-label">Vues totales</div>
            </div>
          </div>

          {/* Favorite CERs */}
          {favoriteCers.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 80, marginBottom: 20 }}>📚</div>
              <h3>Aucun CER favori pour le moment</h3>
              <p>
                Vous n'avez pas encore ajouté de CER à vos favoris. Explorez
                notre collection et ajoutez vos CERs préférés pour un accès
                rapide.
              </p>
              <a href="/cers" className="btn-primary">
                Explorer les CERs
              </a>
            </div>
          ) : (
            <div className="favorites-grid">
              {favoriteCers.map((cer) => (
                <div className="cer-card" key={cer.id}>
                  <div className="favorite-badge">♥ Favori</div>
                  <img src={cer.image} alt={cer.title} />
                  <div className="cer-info">
                    <div className="cer-meta">
                      <span className="author">par {cer.author}</span>
                      <span className="cer-date">{cer.date}</span>
                    </div>
                    <h3>{cer.title}</h3>
                    <div className="cer-tags">
                      {cer.tags.map((tag, idx) => (
                        <span className="tag" key={idx}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="description">{cer.description}</p>
                    <div className="cer-actions">
                      <button className="btn-primary">Consulter le CER</button>
                      <button
                        className="btn-remove"
                        onClick={() => removeFavorite(cer.id)}
                      >
                        Retirer des favoris
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggested Collections */}
          <div className="collections-section">
            <h2 className="section-title">Collections Suggérées</h2>
            <div className="collections-grid">
              <div className="collection-card">
                <h4>Développement Web</h4>
                <p className="collection-count">12 CERs</p>
              </div>
              <div className="collection-card">
                <h4>Base de Données</h4>
                <p className="collection-count">8 CERs</p>
              </div>
              <div className="collection-card">
                <h4>Sécurité Informatique</h4>
                <p className="collection-count">6 CERs</p>
              </div>
              <div className="collection-card">
                <h4>Intelligence Artificielle</h4>
                <p className="collection-count">15 CERs</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Favoris;