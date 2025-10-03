import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import connex from '../assets/conn.png';
import { useAuth } from '../context/AuthContext';

function Connexion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            // Rediriger vers l'accueil après connexion réussie
            navigate('/acceuil');
        } catch (err: any) {
            setError(err.message || 'Erreur de connexion. Vérifiez vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Se connecter</h1>
                    
                    {error && (
                        <div style={{ 
                            color: 'red', 
                            padding: '10px', 
                            marginBottom: '10px',
                            backgroundColor: '#ffebee',
                            borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    <p>Email</p>
                    <input 
                        className="repo" 
                        type="email" 
                        placeholder="Entrer votre email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    
                    <p>Mot de passe</p>
                    <input 
                        className="repo" 
                        type="password" 
                        placeholder="Entrer votre mot de passe" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    
                    <div className="container_bottom">
                        <br/>
                        <a className="massa" href="/">Mot de passe oublié ?</a>
                    </div>
                    
                    <button 
                        className="repo" 
                        type="submit"
                        disabled={loading}
                        style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>

                    <span>
                        Vous n'avez pas de compte ? <Link to="/inscription">Créez un nouveau compte</Link>
                    </span>
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