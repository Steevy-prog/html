<?php
require_once __DIR__ . '/BaseModel.php';

class Product extends BaseModel {
    protected $table = 'products';
     protected function getPrimaryKey(): string
    {
        return 'id'; // Or whatever your product table's primary key is named
    }

    /**
     * Get all active products
     */
    public function getActiveProducts() {
        return $this->findAll(['is_active' => 1]);
    }

    /**
     * Get products by category
     */
    public function getProductsByCategory($categoryId) {
        return $this->findAll([
            'category_id' => $categoryId,
            'is_active' => 1
        ]);
    }

    /**
     * Search products by name or description
     */
    public function searchProducts($query) {
        $sql = "SELECT * FROM {$this->table} 
                WHERE (name LIKE :query OR description LIKE :query) 
                AND is_active = 1";
        
        $stmt = $this->getDb()->prepare($sql);
        $searchTerm = "%$query%";
        $stmt->bindParam(':query', $searchTerm);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Update product stock
     */
    public function updateStock($productId, $quantity) {
        $product = $this->find($productId);
        if (!$product) {
            throw new Exception('Product not found');
        }
        
        $newStock = $product['stock'] + $quantity;
        if ($newStock < 0) {
            throw new Exception('Insufficient stock');
        }
        
        return $this->update($productId, [
            'stock' => $newStock,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Get featured products
     */
    public function getFeaturedProducts($limit = 5) {
        $sql = "SELECT * FROM {$this->table} 
                WHERE is_featured = 1 
                AND is_active = 1 
                ORDER BY created_at DESC 
                LIMIT :limit";
        
        $stmt = $this->getDb()->prepare($sql);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
