import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../composants/header';
import Footer from '../composants/footer';
import apiService from '../services/apiService';
import type { Cer } from '../types';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [myCers, setMyCers] = useState<Cer[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCers: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalFavorites: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connexion');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [cersResponse, favsResponse] = await Promise.all([
        apiService.getUserCers(100, 0),
        apiService.getFavorites(10, 0)
      ]);

      if (cersResponse.success && cersResponse.data) {
        const cersData = cersResponse.data as Cer[];
        setMyCers(cersData);
        
        // Calculer les statistiques
        const totalViews = cersData.reduce((sum, cer) => sum + (cer.views_count || 0), 0);
        const totalDownloads = cersData.reduce((sum, cer) => sum + (cer.downloads_count || 0), 0);
        
        setStats({
          totalCers: cersData.length,
          totalViews,
          totalDownloads,
          totalFavorites: 0
        });
      }

      if (favsResponse.success && favsResponse.data) {
        setFavorites(favsResponse.data as any[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCer = async (cerId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce CER ?')) {
      return;
    }

    try {
      await apiService.deleteCer(cerId);
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du CER');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="font-sans bg-gray-100 text-gray-800 min-h-screen py-10">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6930a]"></div>
            <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="font-sans bg-gray-100 text-gray-800 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-5">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl mb-2 text-[#2c3e50] font-bold">
              Bonjour, {user?.first_name} !
            </h1>
            <p className="text-gray-600">Bienvenue sur votre tableau de bord</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Mes CERs</p>
                  <p className="text-3xl font-bold text-[#2c3e50]">{stats.totalCers}</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Vues totales</p>
                  <p className="text-3xl font-bold text-[#2c3e50]">{stats.totalViews}</p>
                </div>
                <div className="text-4xl">👁️</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Téléchargements</p>
                  <p className="text-3xl font-bold text-[#2c3e50]">{stats.totalDownloads}</p>
                </div>
                <div className="text-4xl">⬇️</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Favoris</p>
                  <p className="text-3xl font-bold text-[#2c3e50]">{favorites.length}</p>
                </div>
                <div className="text-4xl">❤️</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/cers/create')}
                className="flex items-center gap-3 p-4 border-2 border-[#e6930a] rounded-lg hover:bg-[#e6930a] hover:text-white transition"
              >
                <span className="text-2xl">➕</span>
                <span className="font-semibold">Créer un nouveau CER</span>
              </button>
              <button
                onClick={() => navigate('/favoris')}
                className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="text-2xl">❤️</span>
                <span className="font-semibold">Voir mes favoris</span>
              </button>
              <button
                onClick={() => navigate('/cers')}
                className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <span className="text-2xl">🔍</span>
                <span className="font-semibold">Explorer les CERs</span>
              </button>
            </div>
          </div>

          {/* My CERs */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Mes CERs</h2>
              <button
                onClick={() => navigate('/cers/create')}
                className="px-4 py-2 bg-[#e6930a] text-white rounded-lg font-semibold hover:bg-[#d98307] transition"
              >
                + Nouveau CER
              </button>
            </div>

            {myCers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4">Titre</th>
                      <th className="text-left py-3 px-4">Catégorie</th>
                      <th className="text-center py-3 px-4">Vues</th>
                      <th className="text-center py-3 px-4">Téléchargements</th>
                      <th className="text-center py-3 px-4">Note</th>
                      <th className="text-center py-3 px-4">Statut</th>
                      <th className="text-center py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCers.map((cer) => (
                      <tr key={cer.cer_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#2c3e50]">{cer.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {cer.description}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {cer.category_name || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{cer.views_count || 0}</td>
                        <td className="py-3 px-4 text-center">{cer.downloads_count || 0}</td>
                        <td className="py-3 px-4 text-center">
                          {cer.average_rating ? (
                            <span className="flex items-center justify-center gap-1">
                              ⭐ {cer.average_rating.toFixed(1)}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            cer.status === 'published' ? 'bg-green-100 text-green-800' :
                            cer.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {cer.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => navigate(`/cers/${cer.cer_id}`)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Voir"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => navigate(`/cers/${cer.cer_id}/edit`)}
                              className="text-green-600 hover:text-green-800"
                              title="Modifier"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteCer(cer.cer_id)}
                              className="text-red-600 hover:text-red-800"
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600 mb-4">Vous n'avez pas encore créé de CER.</p>
                <button
                  onClick={() => navigate('/cers/create')}
                  className="px-6 py-3 bg-[#e6930a] text-white rounded-lg font-semibold hover:bg-[#d98307] transition"
                >
                  Créer mon premier CER
                </button>
              </div>
            )}
          </div>

          {/* Recent Favorites */}
          {favorites.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Favoris récents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.slice(0, 3).map((fav) => (
                  <div
                    key={fav.favorite_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/cers/${fav.cer_id}`)}
                  >
                    <h3 className="font-semibold text-[#2c3e50] mb-2">{fav.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{fav.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Dashboard;
