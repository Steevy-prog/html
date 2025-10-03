<?php
require_once __DIR__ . '/BaseModel.php';

class Cer extends BaseModel {
    protected $table = 'cers';
    
    protected function getPrimaryKey() {
        return 'cer_id';
    }
    
    /**
     * Récupérer tous les CERs avec informations complètes (via la vue)
     */
    public function getAllComplete($limit = 10, $offset = 0, $filters = []) {
        try {
            $sql = "SELECT * FROM v_cers_complete WHERE 1=1";
            $params = [];
            
            // Filtres optionnels
            if (!empty($filters['status'])) {
                $sql .= " AND status = :status";
                $params[':status'] = $filters['status'];
            }
            
            if (!empty($filters['category_id'])) {
                $sql .= " AND category_id = :category_id";
                $params[':category_id'] = $filters['category_id'];
            }
            
            if (!empty($filters['search'])) {
                $sql .= " AND (title LIKE :search OR description LIKE :search)";
                $params[':search'] = '%' . $filters['search'] . '%';
            }
            
            // Tri par défaut
            $sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($sql);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getAllComplete(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Récupérer un CER par ID avec toutes les informations
     */
    public function getComplete($id) {
        try {
            $sql = "SELECT * FROM v_cers_complete WHERE cer_id = :id LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $cer = $stmt->fetch();
            
            if ($cer) {
                // Récupérer les tags associés
                $cer['tags'] = $this->getTags($id);
            }
            
            return $cer;
        } catch (PDOException $e) {
            error_log("Error in getComplete(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Récupérer les tags d'un CER
     */
    public function getTags($cerId) {
        try {
            $sql = "SELECT t.tag_id, t.name 
                    FROM tags t
                    INNER JOIN cer_tags ct ON t.tag_id = ct.tag_id
                    WHERE ct.cer_id = :cer_id";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':cer_id', $cerId, PDO::PARAM_INT);
            $stmt->execute();
            
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getTags(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Ajouter des tags à un CER
     */
    public function addTags($cerId, $tagIds) {
        try {
            $this->db->beginTransaction();
            
            foreach ($tagIds as $tagId) {
                $sql = "INSERT IGNORE INTO cer_tags (cer_id, tag_id) VALUES (:cer_id, :tag_id)";
                $stmt = $this->db->prepare($sql);
                $stmt->bindValue(':cer_id', $cerId, PDO::PARAM_INT);
                $stmt->bindValue(':tag_id', $tagId, PDO::PARAM_INT);
                $stmt->execute();
            }
            
            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            $this->db->rollBack();
            error_log("Error in addTags(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Incrémenter le compteur de vues
     */
    public function incrementViews($cerId) {
        try {
            $stmt = $this->db->prepare("CALL increment_cer_views(:cer_id)");
            $stmt->bindValue(':cer_id', $cerId, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in incrementViews(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Incrémenter le compteur de téléchargements
     */
    public function incrementDownloads($cerId, $userId, $ipAddress) {
        try {
            $stmt = $this->db->prepare("CALL increment_cer_downloads(:cer_id, :user_id, :ip)");
            $stmt->bindValue(':cer_id', $cerId, PDO::PARAM_INT);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':ip', $ipAddress);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in incrementDownloads(): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Recherche full-text
     */
    public function search($query, $limit = 10, $offset = 0) {
        try {
            $sql = "SELECT c.*, 
                    MATCH(c.title, c.description, c.keywords) AGAINST(:query) as relevance
                    FROM cers c
                    WHERE MATCH(c.title, c.description, c.keywords) AGAINST(:query IN NATURAL LANGUAGE MODE)
                    ORDER BY relevance DESC
                    LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':query', $query);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in search(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Récupérer les CERs d'un utilisateur
     */
    public function getByUser($userId, $limit = 10, $offset = 0) {
        try {
            $sql = "SELECT * FROM v_cers_complete 
                    WHERE author_id = :user_id 
                    ORDER BY created_at DESC
                    LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in getByUser(): " . $e->getMessage());
            return [];
        }
    }
}