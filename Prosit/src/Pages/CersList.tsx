import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../composants/header';
import Footer from '../composants/footer';
import Pagination from '../components/Pagination';
import apiService from '../services/apiService';
import type { Cer } from '../types';

function CersList() {
  const [cers, setCers] = useState<Cer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';

  useEffect(() => {
    loadCers();
  }, [currentPage, itemsPerPage, searchQuery, categoryId]);

  const loadCers = async () => {
    try {
      setLoading(true);
      setError('');

      const offset = (currentPage - 1) * itemsPerPage;
      
      let response;
      if (searchQuery) {
        response = await apiService.searchCers(searchQuery, itemsPerPage, offset);
      } else {
        response = await apiService.getCers({
          limit: itemsPerPage,
          offset: offset,
          status: 'published',
          category_id: categoryId ? parseInt(categoryId) : undefined
        });
      }

      if (response.success && response.data) {
        const cersData = Array.isArray(response.data) ? response.data : (response.data as any).cers || [];
        setCers(cersData as Cer[]);
        
        // Estimer le total (vous pouvez ajouter un endpoint pour obtenir le count exact)
        setTotalItems((response.data as any).total || cersData.length);
      }
    } catch (err: any) {
      setError('Erreur lors du chargement des CERs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <Header />
      <main className="font-sans bg-gray-100 text-gray-800 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-5">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl mb-4 text-[#2c3e50] font-bold">
              {searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les CERs'}
            </h1>
            <p className="text-gray-600">
              {totalItems} CER{totalItems > 1 ? 's' : ''} trouvé{totalItems > 1 ? 's' : ''}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center text-red-600 mb-4 p-4 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6930a]"></div>
              <p className="mt-4 text-gray-600">Chargement des CERs...</p>
            </div>
          ) : (
            <>
              {/* CERs Grid */}
              {cers.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {cers.map((cer) => (
                      <div
                        key={cer.cer_id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer"
                        onClick={() => navigate(`/cers/${cer.cer_id}`)}
                      >
                        <img
                          src={cer.thumbnail || "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop"}
                          alt={cer.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {cer.category_name && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {cer.category_name}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {cer.views_count || 0} vues
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-[#2c3e50] mb-2 line-clamp-2">
                            {cer.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {cer.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              par {cer.author_first_name} {cer.author_last_name}
                            </span>
                            {cer.average_rating && (
                              <span className="flex items-center gap-1">
                                ⭐ {cer.average_rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">Aucun CER trouvé.</p>
                  <button
                    onClick={() => navigate('/acceuil')}
                    className="mt-4 px-6 py-3 bg-[#e6930a] text-white rounded-lg font-semibold hover:bg-[#d98307] transition"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CersList;
