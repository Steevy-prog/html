import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../composants/header';
import Footer from '../composants/footer';
import searchicon from '../assets/search.png';
import apiService from '../services/apiService';
import type { Cer } from '../types';
import CookieExample from "../cookie";

function Acceuil() {
  const [cers, setCers] = useState<Cer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCers();
  }, []);

  const loadCers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCers({ 
        limit: 6, 
        status: 'published' 
      });
      
      if (response.success && response.data) {
        setCers(response.data as Cer[]);
      }
    } catch (err: any) {
      setError('Erreur lors du chargement des CERs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cers?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <Header />
      <main className="font-sans bg-gray-100 text-gray-800">
        {/* Hero Section */}
        <section className="text-center py-16 px-5 max-w-6xl mx-auto">
          {/* Search box */}
          <form onSubmit={handleSearch} className="mt-10 flex items-center justify-center bg-white px-5 py-3 rounded-lg shadow-md max-w-lg mx-auto mb-10">
            <img className="w-5 h-5 mr-3" src={searchicon} alt="Search Icon" />
            <input
              type="search"
              placeholder="Rechercher un CER"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="invalid:border-pink-500 bg-white focus:border-4 focus:border-sky flex-1 border-none outline-none text-base text-gray-700"
            />
          </form>

          {/* Titles */}
          <h1 className="text-4xl mb-4 text-[#2c3e50]">Bienvenue sur Archiva, votre espace</h1>
          <h2 className="text-xl text-gray-600 mb-2">Espace d'archivage d'anciens CERs</h2>
          <p className="italic text-gray-500 mb-8">L&apos;homme n&apos;est rien sans son bord</p>

          {/* Buttons */}
          <div className="flex gap-5 justify-center mb-16 flex-wrap">
            <button 
              onClick={() => navigate('/cers')}
              className="bg-[#e6930a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d98307] transition"
            >
              Explorer
            </button>
            <button 
              onClick={() => navigate('/cers')}
              className="bg-transparent text-black px-8 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-[#e6930a] hover:text-white transition"
            >
              Tous les CERs
            </button>
          </div>
        </section>
       <CookieExample />
        {/* Best CERs Section */}
        <section className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            {/* Text */}
            <div className="flex-1 max-w-3xl">
              <h3 className="text-3xl mb-4 text-[#2c3e50]">Les meilleurs CERs du moment</h3>
              <p className="text-gray-600 leading-relaxed text-left">
                Découvrez ci-dessous les CERs les plus appréciés par notre communauté d&apos;utilisateur.
                Ces CERs ont été sélectionnés et évalués par nos membres en fonction de leur qualité,
                pertinence et utilité.
              </p>
            </div>
            {/* Button */}
            <button 
              onClick={() => navigate('/cers')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-[#e6930a] hover:text-black transition"
            >
              Voir tout
            </button>
          </div>

          {/* CER Grid */}
          {error && (
            <div className="text-center text-red-600 mb-4 p-4 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Chargement des CERs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-5" id="cer-cards-container">
              {cers.length > 0 ? (
                cers.map((cer) => (
                  <div key={cer.cer_id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
                    <img
                      src={cer.thumbnail || "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop"}
                      alt={cer.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5">
                      <p className="text-[#f7a306] text-sm mb-2">
                        par {cer.author_first_name} {cer.author_last_name}
                      </p>
                      <h4 className="text-lg font-semibold text-[#2c3e50] mb-3 leading-snug">
                        {cer.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {cer.description}
                      </p>
                      <button 
                        onClick={() => navigate(`/cers/${cer.cer_id}`)}
                        className="w-full bg-gray-200 text-black py-2 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition"
                      >
                        Consulter le CER
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-600">Aucun CER disponible pour le moment.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Acceuil