import React, { useMemo, useState } from "react";
import Header from "../composants/header";
import Footer from "../composants/footer";
import Card from "../composants/card";

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

export default function Favoris() {
  const [favoriteCers, setFavoriteCers] = useState<FavoriteCER[]>([
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop",
      author: "Marie Dubois",
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
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
      author: "Pierre Durand",
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

  const removeFavorite = (id: number) => {
    setFavoriteCers((prev) => prev.filter((cer) => cer.id !== id));
  };

  const stats = useMemo(() => {
    const totalFavorites = favoriteCers.length;
    const totalCategories = new Set(favoriteCers.map((c) => c.category)).size;
    const totalViews = favoriteCers.reduce((s, c) => s + c.views, 0);
    const lastAdded =
      favoriteCers.length > 0
        ? new Date(
            Math.max(
              ...favoriteCers.map((c) => new Date(c.addedToFavorites).getTime())
            )
          ).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-";
    return { totalFavorites, totalCategories, totalViews, lastAdded };
  }, [favoriteCers]);

  return (
    <>
      <Header />
      <main className="pt-20 container mx-auto px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">
              Mes CER Favoris
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Retrouvez ici tous les CERs que vous avez ajoutés à vos favoris.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-md shadow-sm p-4 text-center">
              <div className="text-lg font-semibold text-slate-800">
                {stats.totalFavorites}
              </div>
              <div className="text-xs text-slate-500">CERs Favoris</div>
            </div>
            <div className="bg-white rounded-md shadow-sm p-4 text-center">
              <div className="text-lg font-semibold text-slate-800">
                {stats.totalCategories}
              </div>
              <div className="text-xs text-slate-500">Catégories</div>
            </div>
            <div className="bg-white rounded-md shadow-sm p-4 text-center">
              <div className="text-lg font-semibold text-slate-800">
                {stats.lastAdded}
              </div>
              <div className="text-xs text-slate-500">Dernier ajout</div>
            </div>
            <div className="bg-white rounded-md shadow-sm p-4 text-center">
              <div className="text-lg font-semibold text-slate-800">
                {stats.totalViews}
              </div>
              <div className="text-xs text-slate-500">Vues totales</div>
            </div>
          </div>

          {/* Favorites list */}
          {favoriteCers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium mb-2">
                Aucun CER favori pour le moment
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Explorez notre collection et ajoutez vos CERs préférés pour un
                accès rapide.
              </p>
              <a
                href="/cers"
                className="inline-block px-4 py-2 bg-orange-500 text-white rounded-md shadow-sm"
              >
                Explorer les CERs
              </a>
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCers.map((cer) => (
                <div key={cer.id} className="relative">
                  {/* favourite badge */}
                  <div className="absolute top-3 left-3 bg-orange-50 text-orange-600 text-xs font-medium px-2 py-1 rounded-md shadow-sm z-10">
                    ♥ Favori
                  </div>

                  {/* Card */}
                  <Card
                    image={cer.image}
                    title={cer.title}
                    author={cer.author}
                    description={`${cer.date} • ${cer.tags.join(", ")} • ${cer.views} vues`}
                  />

                  {/* Actions under card */}
                  <div className="mt-3 flex gap-3 justify-between">
                    <a
                      href={`/cer/${cer.id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
                    >
                      Consulter le CER
                    </a>
                    <button
                      onClick={() => removeFavorite(cer.id)}
                      className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 text-sm"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Suggested Collections */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">Collections Suggérées</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-md p-4 shadow-sm">
                <h4 className="font-medium">Développement Web</h4>
                <p className="text-sm text-slate-500">12 CERs</p>
              </div>
              <div className="bg-white rounded-md p-4 shadow-sm">
                <h4 className="font-medium">Base de Données</h4>
                <p className="text-sm text-slate-500">8 CERs</p>
              </div>
              <div className="bg-white rounded-md p-4 shadow-sm">
                <h4 className="font-medium">Sécurité Informatique</h4>
                <p className="text-sm text-slate-500">6 CERs</p>
              </div>
              <div className="bg-white rounded-md p-4 shadow-sm">
                <h4 className="font-medium">Intelligence Artificielle</h4>
                <p className="text-sm text-slate-500">15 CERs</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}