import Header from '../composants/header'
import Footer from '../composants/footer'
function Cers(){
        function toggleSidebar() {
          const sidebar = document.querySelector('.side-bar');
          if (sidebar) {
            sidebar.classList.toggle('hidden');
          }
        }
    return(
        <>
        <Header/>
        <main>
         <div className="main-content">
            <div className="page-header">
                <h1>Tous les CERs</h1>
                <p>Explorez notre collection complète de Comptes d'Expérience Réfléchie. Utilisez les filtres pour trouver exactement ce que vous cherchez.</p>
            </div>

            <div className="filters-section">
                <div className="search-filters">
                    <div className="search-container">
                        <input type="search" className="search-input" placeholder="Rechercher par titre, auteur ou mot-clé..."/>
                    </div>
                    <h4>Trier par :</h4>
                    <select className="filter-select" id="sortFilter">
                        <option value="recent">Plus récent</option>
                        <option value="ancien">Plus ancien</option>
                        <option value="populaire">Plus populaire</option>
                        <option value="titre">Par titre</option>
                    </select>
<label className="burger">
  <input type="checkbox" id="burger"/>
  <span></span>
  <span></span>
  <span></span>
</label>
<button className="toggle-btn" onClick={toggleSidebar}>
                    <label className="burger" htmlFor="burger">
                      <input type="checkbox" id="burger"/>
                    </label>
                    </button>
                </div>
            </div>

            <div className="cer-grid" id="cer-grid">
            </div>

            <div className="pagination">
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
                <button>5</button>
                <button>...</button>
                <button>10</button>
            </div>
        </div>
        </main>
        <Footer/>
        </>
    )
}
export default Cers