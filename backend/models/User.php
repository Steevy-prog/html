<?php
require_once __DIR__ . '/BaseModel.php';

class User extends BaseModel {
    protected $table = 'users';
    
    protected function getPrimaryKey() {
        return 'user_id';
    }
    
    /**
     * Rechercher un utilisateur par email
     */
    public function findByEmail($email) {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':email', $email);
            $stmt->execute();
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Error in findByEmail(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Rechercher un utilisateur par username
     */
    public function findByUsername($username) {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE username = :username LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':username', $username);
            $stmt->execute();
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Error in findByUsername(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Créer un nouvel utilisateur avec hash du mot de passe
     */
    public function register($data) {
        try {
            // Vérifier si l'email existe déjà
            if ($this->findByEmail($data['email'])) {
                throw new Exception("Cet email est déjà utilisé");
            }
            
            // Vérifier si le username existe déjà
            if ($this->findByUsername($data['username'])) {
                throw new Exception("Ce nom d'utilisateur est déjà pris");
            }
            
            // Hasher le mot de passe
            $data['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
            unset($data['password']);
            
            // Créer l'utilisateur
            return $this->create($data);
        } catch (Exception $e) {
            error_log("Error in register(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Authentifier un utilisateur
     */
    public function login($email, $password) {
        try {
            $user = $this->findByEmail($email);
            
            if (!$user) {
                return ['success' => false, 'message' => 'Email ou mot de passe incorrect'];
            }
            
            if (!$user['is_active']) {
                return ['success' => false, 'message' => 'Ce compte est désactivé'];
            }
            
            if (!password_verify($password, $user['password_hash'])) {
                return ['success' => false, 'message' => 'Email ou mot de passe incorrect'];
            }
            
            // Mettre à jour last_login
            $this->update($user['user_id'], ['last_login' => date('Y-m-d H:i:s')]);
            
            // Retirer le password_hash des données retournées
            unset($user['password_hash']);
            
            return ['success' => true, 'user' => $user];
        } catch (Exception $e) {
            error_log("Error in login(): " . $e->getMessage());
            return ['success' => false, 'message' => 'Erreur lors de la connexion'];
        }
    }
    
    /**
     * Récupérer les favoris d'un utilisateur
     */
    public function getFavorites($userId, $limit = 10, $offset = 0) {
        try {
            $sql = "SELECT c.*, f.notes, f.created_at as favorited_at
                    FROM favorites f
                    INNER JOIN cers c ON f.cer_id = c.cer_id
                    WHERE f.user_id = :user_id
                    ORDER BY f.created_at DESC
                    LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getFavorites(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Ajouter un CER aux favoris
     */
    public function addFavorite($userId, $cerId, $notes = null) {
        try {
            $sql = "INSERT INTO favorites (user_id, cer_id, notes) 
                    VALUES (:user_id, :cer_id, :notes)
                    ON DUPLICATE KEY UPDATE notes = :notes";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':cer_id', $cerId, PDO::PARAM_INT);
            $stmt->bindValue(':notes', $notes);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in addFavorite(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Retirer un CER des favoris
     */
    public function removeFavorite($userId, $cerId) {
        try {
            $sql = "DELETE FROM favorites WHERE user_id = :user_id AND cer_id = :cer_id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':cer_id', $cerId, PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in removeFavorite(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Vérifier si un CER est dans les favoris
     */
    public function isFavorite($userId, $cerId) {
        try {
            $sql = "SELECT COUNT(*) as count FROM favorites 
                    WHERE user_id = :user_id AND cer_id = :cer_id";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':cer_id', $cerId, PDO::PARAM_INT);
            
            $stmt->execute();
            $result = $stmt->fetch();
            
            return $result['count'] > 0;
        } catch (PDOException $e) {
            error_log("Error in isFavorite(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Récupérer les préférences d'un utilisateur
     */
    public function getPreferences($userId) {
        try {
            $sql = "SELECT * FROM user_preferences WHERE user_id = :user_id LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Error in getPreferences(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Mettre à jour les préférences d'un utilisateur
     */
    public function updatePreferences($userId, $preferences) {
        try {
            $fields = [];
            foreach (array_keys($preferences) as $field) {
                $fields[] = "{$field} = :{$field}";
            }
            
            $sql = "UPDATE user_preferences SET " . implode(', ', $fields) . 
                   " WHERE user_id = :user_id";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            
            foreach ($preferences as $field => $value) {
                $stmt->bindValue(":{$field}", $value);
            }
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in updatePreferences(): " . $e->getMessage());
            return false;
        }
    }
}