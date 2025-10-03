import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Inscription() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        institution: '',
        role: 'student' as 'student' | 'teacher' | 'researcher'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (!formData.username || !formData.email || !formData.first_name || !formData.last_name) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...dataToSend } = formData;
            await register(dataToSend);
            navigate('/acceuil');
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h1>Créer un compte</h1>
                    
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
                    
                    <p>Nom d'utilisateur</p>
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Nom d'utilisateur" 
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    
                    <p>Prénom</p>
                    <input 
                        type="text" 
                        name="first_name"
                        placeholder="Prénom" 
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    
                    <p>Nom</p>
                    <input 
                        type="text" 
                        name="last_name"
                        placeholder="Nom" 
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    
                    <p>Email</p>
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Entrer votre email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    
                    <p>Institution (optionnel)</p>
                    <input 
                        type="text" 
                        name="institution"
                        placeholder="Votre institution" 
                        value={formData.institution}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    
                    <p>Rôle</p>
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="student">Étudiant</option>
                        <option value="teacher">Enseignant</option>
                        <option value="researcher">Chercheur</option>
                    </select>
                    
                    <p>Mot de passe</p>
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Entrer votre mot de passe" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    
                    <p>Confirmer le mot de passe</p>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        placeholder="Confirmer votre mot de passe" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? 'Inscription...' : 'Créer un compte'}
                    </button>
                    
                    <span>
                        Vous avez déjà un compte ? <Link to="/connexion">Connectez-vous</Link>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default Inscription;
