import {Link} from "react-router-dom"
import '../styles/connexion.css'
import connex from '../assets/conn.png'

function Connexion(){
    return(
        
         <div className="main-container">
        <div className="form-container">
            <form>
                <h1>Se connecter</h1>
                <p>Email</p>
                <input className ="repo" type="email" placeholder="Entrer votre email" required/>
                <p>Mot de passe</p>
                <input className="repo" type="password" placeholder="Entrer votre mot de passe" required/>
        <div className="container_bottom" >
        <br/>
        <a className= "massa" href="/">Mot de passe oublié ?</a>
        </div>
        
        {/* RE-ADDED THE BUTTON ELEMENT WITH A LINK INSIDE */}
        <button className = "repo">
            <Link to="/index">connecter</Link>
        </button>

        <span>Vous n'avez pas de compte ? <Link to="/inscription">Créez un nouveau compte</Link></span>
            </form>
        </div>
        <div className="image-container">
            <img 
        src={connex} 
        alt="Visual graphic for login page"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
        </div>
    </div>
    );
}

export default Connexion;