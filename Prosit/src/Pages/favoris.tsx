import Header from '../composants/header'
import Footer from '../composants/footer'
function Favoris(){
    return(
        <>
        <Header/>
        <main>
        <div className="main-content">
            <div className="page-header">
                <h1>Mes CER Favoris</h1>
                <p>Retrouvez ici tous les CERs que vous avez ajoutés à vos favoris pour un accès rapide et facile.</p>
            </div>
            <div className="stats-section">
                <div className="stat-card">
                    <div className="stat-number" id="totalFavorites">0</div>
                    <div className="stat-label">CERs Favoris</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number" id="totalCategories">0</div>
                    <div className="stat-label">Catégories</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number" id="lastAdded">-</div>
                    <div className="stat-label">Dernier ajout</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number" id="totalViews">0</div>
                    <div className="stat-label">Vues totales</div>
                </div>
            </div>
            <div id="favoritesContainer">
            </div>
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
        <Footer/>
        </>
    )
}

export default Favoris