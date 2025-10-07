<?php
require_once __DIR__ . '/../config/db_connect.php';

abstract class BaseModel {
    protected $db;
    protected $table;
    
    public function __construct() {
        $this->db = getDB();
    }
    
    /**
     * Récupérer tous les enregistrements
     */
    public function all($limit = null, $offset = 0) {
        try {
            $sql = "SELECT * FROM {$this->table}";
            
            if ($limit) {
                $sql .= " LIMIT :limit OFFSET :offset";
            }
            
            $stmt = $this->db->prepare($sql);
            
            if ($limit) {
                $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            }
            
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in all(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Récupérer un enregistrement par ID
     */
    public function find($id) {
        try {
            $primaryKey = $this->getPrimaryKey();
            $sql = "SELECT * FROM {$this->table} WHERE {$primaryKey} = :id LIMIT 1";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Error in find(): " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Créer un nouvel enregistrement
     */
    public function create($data) {
        try {
            $fields = array_keys($data);
            $placeholders = array_map(function($field) {
                return ":{$field}";
            }, $fields);
            
            $sql = "INSERT INTO {$this->table} (" . implode(', ', $fields) . ") 
                    VALUES (" . implode(', ', $placeholders) . ")";
            
            $stmt = $this->db->prepare($sql);
            
            foreach ($data as $field => $value) {
                $stmt->bindValue(":{$field}", $value);
            }
            
            $stmt->execute();
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log("Error in create(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Mettre à jour un enregistrement
     */
    public function update($id, $data) {
        try {
            $fields = [];
            foreach (array_keys($data) as $field) {
                $fields[] = "{$field} = :{$field}";
            }
            
            $primaryKey = $this->getPrimaryKey();
            $sql = "UPDATE {$this->table} SET " . implode(', ', $fields) . 
                   " WHERE {$primaryKey} = :id";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            
            foreach ($data as $field => $value) {
                $stmt->bindValue(":{$field}", $value);
            }
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in update(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Supprimer un enregistrement
     */
    public function delete($id) {
        try {
            $primaryKey = $this->getPrimaryKey();
            $sql = "DELETE FROM {$this->table} WHERE {$primaryKey} = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error in delete(): " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Recherche avec conditions
     */
    public function where($conditions, $limit = null, $offset = 0) {
        try {
            $whereClauses = [];
            foreach (array_keys($conditions) as $field) {
                $whereClauses[] = "{$field} = :{$field}";
            }
            
            $sql = "SELECT * FROM {$this->table} WHERE " . implode(' AND ', $whereClauses);
            
            if ($limit) {
                $sql .= " LIMIT :limit OFFSET :offset";
            }
            
            $stmt = $this->db->prepare($sql);
            
            foreach ($conditions as $field => $value) {
                $stmt->bindValue(":{$field}", $value);
            }
            
            if ($limit) {
                $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            }
            
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Error in where(): " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Obtenir la clé primaire de la table
     */
    abstract protected function getPrimaryKey();
}