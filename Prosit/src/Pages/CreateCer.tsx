import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../composants/header';
import Footer from '../composants/footer';
import FileUpload from '../components/FileUpload';
import apiService from '../services/apiService';

function CreateCer() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    university_id: '',
    language: 'fr',
    keywords: '',
    file_path: '',
    file_type: '',
    file_size: 0
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Charger les catégories et universités au montage
  useState(() => {
    const loadData = async () => {
      try {
        const [catResponse, uniResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getUniversities()
        ]);
        
        if (catResponse.success) setCategories(catResponse.data as any[] || []);
        if (uniResponse.success) setUniversities(uniResponse.data as any[] || []);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      }
    };
    loadData();
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUploadSuccess = (data: any) => {
    setFormData({
      ...formData,
      file_path: data.file_path,
      file_type: data.file_type,
      file_size: data.file_size
    });
    setFileUploaded(true);
    setError('');
  };

  const handleFileUploadError = (errorMsg: string) => {
    setError(errorMsg);
    setFileUploaded(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Vous devez être connecté pour créer un CER');
      navigate('/connexion');
      return;
    }

    if (!formData.title || !formData.description) {
      setError('Le titre et la description sont obligatoires');
      return;
    }

    if (!fileUploaded) {
      setError('Veuillez uploader un fichier avant de soumettre');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        university_id: formData.university_id ? parseInt(formData.university_id) : undefined,
      };

      const response = await apiService.createCer(dataToSend);

      if (response.success) {
        navigate('/acceuil');
      } else {
        throw new Error(response.message || 'Erreur lors de la création du CER');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du CER');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="font-sans bg-gray-100 text-gray-800 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="text-4xl mb-8 text-[#2c3e50] font-bold">Créer un nouveau CER</h1>

          {error && (
            <div style={{
              color: 'red',
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: '#ffebee',
              borderRadius: '8px',
              border: '1px solid #ef5350'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {/* Titre */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Titre du CER <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Prosit 3.2 - Base de données"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le contenu de votre CER..."
                required
                disabled={loading}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Catégorie et Université */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Catégorie
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Université
                </label>
                <select
                  name="university_id"
                  value={formData.university_id}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Sélectionner une université --</option>
                  {universities.map((uni) => (
                    <option key={uni.university_id} value={uni.university_id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Langue et Mots-clés */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Langue
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mots-clés
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="SQL, Database, MySQL..."
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Upload de fichier */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-4">
                Fichier du CER <span className="text-red-500">*</span>
              </label>
              <FileUpload
                onUploadSuccess={handleFileUploadSuccess}
                onUploadError={handleFileUploadError}
              />
              {fileUploaded && (
                <div className="mt-3 text-green-600 font-semibold">
                  ✓ Fichier uploadé avec succès
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/acceuil')}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !fileUploaded}
                className="px-6 py-3 bg-[#e6930a] text-white rounded-lg font-semibold hover:bg-[#d98307] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : 'Créer le CER'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CreateCer;
