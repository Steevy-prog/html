import Header from '../composants/header'
import Footer from '../composants/footer'
import searchicon from '../assets/search.png'
import '../API/imageapi.ts'
import getImage from '../API/imageapi.ts';

function Acceuil() {
async function displayImage() {
    const blob = await getImage();
    if (blob) {
        const url = URL.createObjectURL(blob);
        const img = document.createElement("img");
        img.src = url;
        document.body.appendChild(img);
    }
}
  return (
    <>
      <Header />
      <main className="font-sans bg-gray-100 text-gray-800">
        {/* Hero Section */}
        <section className="text-center py-16 px-5 max-w-6xl mx-auto">
          {/* Search box */}
          <div className="mt-10 flex items-center justify-center bg-white px-5 py-3 rounded-lg shadow-md max-w-lg mx-auto mb-10">
            <img className="w-5 h-5 mr-3" src={searchicon} alt="Search Icon" />
            <input
              type="search"
              placeholder="Rechercher un CER"
              className="invalid:border-pink-500 bg-white focus:border-4 focus:border-sky flex-1 border-none outline-none text-base text-gray-700"
            />
          </div>

          {/* Titles */}
          <h1 className="text-4xl mb-4 text-[#2c3e50]">Bienvenue sur Archiva, votre espace</h1>
          <h2 className="text-xl text-gray-600 mb-2">Espace d'archivage d'anciens CERs</h2>
          <p className="italic text-gray-500 mb-8">L&apos;homme n&apos;est rien sans son bord</p>

          {/* Buttons */}
          <div className="flex gap-5 justify-center mb-16 flex-wrap">
            <button className="bg-[#e6930a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d98307] transition">
              Explorer
            </button>
            <button className="bg-transparent text-black px-8 py-3 border-2 border-gray-200 rounded-lg font-semibold hover:bg-[#e6930a] hover:text-white transition">
              Tous les CERs
            </button>
          </div>
        </section>

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
            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-[#e6930a] hover:text-black transition">
              Voir tout
            </button>
          </div>

          {/* CER Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-5" id="cer-cards-container">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
              {/*<img
                src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop"
                alt="CER Example"
                className="w-full h-48 object-cover"
              />*/}
              displayImage();
              <div className="p-5">
                <p className="text-[#f7a306] text-sm mb-2">par Marie Dubois</p>
                <h4 className="text-lg font-semibold text-[#2c3e50] mb-3 leading-snug">
                  Prosit 3.2 Base de données
                </h4>
                <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  Introduction aux systèmes de gestion de base de données relationnelles, conception de
                  schémas, requêtes SQL avancées, optimisation des performances et sécurité des données.
                </p>
                <button className="w-full bg-gray-200 text-black py-2 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition">
                  Consulter le CER
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop"
                alt="CER Example"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <p className="text-[#f7a306] text-sm mb-2">par Jean Martin</p>
                <h4 className="text-lg font-semibold text-[#2c3e50] mb-3 leading-snug">
                  Prosit 4.1 Programmation avancée
                </h4>
                <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  Concepts avancés de programmation orientée objet, design patterns, gestion de mémoire et
                  bonnes pratiques de développement logiciel.
                </p>
                <button className="w-full bg-gray-200 text-black py-2 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition">
                  Consulter le CER
                </button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
              <img
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=200&fit=crop"
                alt="CER Example"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <p className="text-[#f7a306] text-sm mb-2">par Sophie Leroy</p>
                <h4 className="text-lg font-semibold text-[#2c3e50] mb-3 leading-snug">
                  Prosit 5.3 Analyse de données
                </h4>
                <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  Techniques modernes d&apos;analyse de données, visualisation avec des outils interactifs et
                  applications dans le domaine du big data et de l&apos;intelligence artificielle.
                </p>
                <button className="w-full bg-gray-200 text-black py-2 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition">
                  Consulter le CER
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Acceuil