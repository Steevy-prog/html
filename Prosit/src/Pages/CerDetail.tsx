import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../composants/header';
import Footer from '../composants/footer';
import CommentsSection from '../components/CommentsSection';
import RatingSection from '../components/RatingSection';
import apiService from '../services/apiService';
import type { Cer } from '../types';

function CerDetail() {
  const { id } = useParams<{ id: string }>();
  const [cer, setCer] = useState<Cer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadCer(parseInt(id));
      if (isAuthenticated) {
        checkFavorite(parseInt(id));
      }
    }
  }, [id, isAuthenticated]);

  const loadCer = async (cerId: number) => {
    try {
      setLoading(true);
      const response = await apiService.getCer(cerId);
      if (response.success && response.data) {
        setCer(response.data as Cer);
      } else {
        setError('CER non trouvé');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du CER');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async (cerId: number) => {
    try {
      const response = await apiService.checkFavorite(cerId);
      if (response.success && response.data) {
        setIsFavorite((response.data as any).is_favorite || false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated || !cer) {
      navigate('/connexion');
      return;
    }

    try {
      if (isFavorite) {
        await apiService.removeFavorite(cer.cer_id);
        setIsFavorite(false);
      } else {
        await apiService.addFavorite(cer.cer_id);
        setIsFavorite(true);
      }
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la mise à jour du favori');
    }
  };

  const handleDownload = () => {
    if (!cer?.file_path) {
      alert('Aucun fichier disponible pour ce CER');
      return;
    }
    
    // Ouvrir le fichier dans un nouvel onglet
    window.open(`http://localhost/backend/${cer.file_path}`, '_blank');
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="font-sans bg-gray-100 text-gray-800 min-h-screen py-10">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6930a]"></div>
            <p className="mt-4 text-gray-600">Chargement du CER...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !cer) {
    return (
      <>
        <Header />
        <main className="font-sans bg-gray-100 text-gray-800 min-h-screen py-10">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <h1 className="text-4xl mb-4 text-red-600">❌ Erreur</h1>
            <p className="text-gray-600 mb-6">{error || 'CER introuvable'}</p>
            <button
              onClick={() => navigate('/cers')}
              className="px-6 py-3 bg-[#e6930a] text-white rounded-lg font-semibold hover:bg-[#d98307] transition"
            >
              Retour à la liste
            </button>
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
        <div className="max-w-6xl mx-auto px-5">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#e6930a] transition"
          >
            ← Retour
          </button>

          {/* CER Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {cer.thumbnail && (
              <img
                src={cer.thumbnail}
                alt={cer.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {cer.category_name && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {cer.category_name}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      cer.status === 'published' ? 'bg-green-100 text-green-800' :
                      cer.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cer.status === 'published' ? 'Publié' : cer.status === 'draft' ? 'Brouillon' : 'En attente'}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-[#2c3e50] mb-3">
                    {cer.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <span>📝 Par {cer.author_first_name} {cer.author_last_name}</span>
                    <span>•</span>
                    <span>📅 {new Date(cer.created_at).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>👁️ {cer.views_count || 0} vues</span>
                  </div>

                  {cer.average_rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <span className="text-xl font-bold">{cer.average_rating.toFixed(1)}</span>
                      <span className="text-gray-600">({cer.rating_count || 0} avis)</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={toggleFavorite}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      isFavorite
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'border-2 border-red-500 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    {isFavorite ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
                  </button>
                  
                  {cer.file_path && (
                    <button
                      onClick={handleDownload}
                      className="px-6 py-3 bg-[#e6930a] text-white rounded-lg font-semibold hover:bg-[#d98307] transition"
                    >
                      📥 Télécharger le CER
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {cer.description}
                </p>
              </div>

              {/* Keywords */}
              {cer.keywords && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-[#2c3e50] mb-3">Mots-clés</h3>
                  <div className="flex flex-wrap gap-2">
                    {cer.keywords.split(',').map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-2xl font-bold text-[#2c3e50]">{cer.views_count || 0}</div>
                  <div className="text-sm text-gray-600">Vues</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">📥</div>
                  <div className="text-2xl font-bold text-[#2c3e50]">{cer.downloads_count || 0}</div>
                  <div className="text-sm text-gray-600">Téléchargements</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">❤️</div>
                  <div className="text-2xl font-bold text-[#2c3e50]">{cer.favorite_count || 0}</div>
                  <div className="text-sm text-gray-600">Favoris</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">💬</div>
                  <div className="text-2xl font-bold text-[#2c3e50]">{(cer as any).comment_count || 0}</div>
                  <div className="text-sm text-gray-600">Commentaires</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="mb-8">
            <RatingSection cerId={cer.cer_id} />
          </div>

          {/* Comments Section */}
          <div className="mb-8">
            <CommentsSection cerId={cer.cer_id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CerDetail;
