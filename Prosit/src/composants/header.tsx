import Logo from '../assets/logo.png'
import { Link } from "react-router-dom";

function Header() {

  return (
    <>
      <div className="logo">
        <img src={Logo} alt="Archiva Logo" />
      </div>
        <nav>
            <ul className="nav-links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/cer">CERs</Link></li>
                <li><Link to="/favoris">Mes CER Favoris</Link></li>
                <li><Link to="/gestion">Gestion de CER</Link></li>
            </ul>
            <button  className="connexion"><Link to="/connexion">Connexion</Link></button>
        </nav>
    </>
  )
}

export default Header
