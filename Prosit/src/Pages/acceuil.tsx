import Header from '../composants/header'
import Footer from '../composants/footer'
import searchicon from '../assets/search.png'
function Acceuil(){
    return (
        <>
            <Header/>
            <main>
            <section className="hero">
            <div className="search-container">
                <img className="search-icon" src={searchicon} alt="Search Icon"/>
                <input type="search" className="search-input" placeholder="Rechercher un CER"/>
            </div>
            <h1>Bienvenue sur Archiva, votre espace</h1>
            <h2>Espace d'archivage d'anciens CERs</h2>
            <p>L'homme n'est rien sans son bord</p>
            <div className="hero-buttons">
                <button className="btn-primary">Explorer</button>
                <button className="btn-secondary">Tous les CERs</button>
            </div>
        </section>

        <section className="best-cer-section">
            <div className="section-header">
                <div className="section-text">
                    <h3>Les meilleurs CERs du moment</h3>
                    <p>Découvrez ci-dessous les CERs les plus appréciés par notre communauté d'utilisateur. Ces CERs ont été sélectionnés et évalués par nos membres en fonction de leur qualité, pertinence et utilité.</p>
                </div>
                <button className="btn-view-all">Voir tout</button>
            </div>

            <div className="cer-cards-grid" id="cer-cards-container">
            </div>
        </section>
        </main>
        <Footer/>
        </>
    )
}
export default Acceuil