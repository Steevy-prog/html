<?php

require_once 'BaseController.php';
require_once '../models/Product.php';

class ProductController extends BaseController {
    private $productModel;
    
    public function __construct($database) {
        parent::__construct($database);
        $this->productModel = new Product($database);
    }
    
    /**
     * Get all products
     */
    public function index() {
        $this->checkMethod(['GET']);
        
        try {
            $products = $this->productModel->getAll();
            $this->sendSuccess($products);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch products', 500);
        }
    }
    
    /**
     * Get product by ID
     */
    public function show($id) {
        $this->checkMethod(['GET']);
        
        try {
            $product = $this->productModel->getById($id);
            
            if (!$product) {
                $this->sendError('Product not found', 404);
            }
            
            $this->sendSuccess($product);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch product', 500);
        }
    }
    
    /**
     * Create new product
     */
    public function store() {
        $this->checkMethod(['POST']);
        
        try {
            $data = $this->getRequestData();
            $data = $this->sanitizeInput($data);
            
            // Validate required fields
            $requiredFields = ['name', 'price', 'category_id'];
            $errors = $this->validateRequired($data, $requiredFields);
            
            if (!empty($errors)) {
                $this->sendError('Validation failed', 400, $errors);
            }
            
            // Add timestamps
            $data['created_at'] = date('Y-m-d H:i:s');
            $data['updated_at'] = date('Y-m-d H:i:s');
            $data['status'] = $data['status'] ?? 'active';
            
            $result = $this->productModel->create($data);
            
            if ($result) {
                $this->sendSuccess(null, 'Product created successfully');
            } else {
                $this->sendError('Failed to create product', 500);
            }
        } catch (Exception $e) {
            $this->sendError('Failed to create product', 500);
        }
    }
    
    /**
     * Update product
     */
    public function update($id) {
        $this->checkMethod(['PUT']);
        
        try {
            $data = $this->getRequestData();
            $data = $this->sanitizeInput($data);
            
            // Check if product exists
            $product = $this->productModel->getById($id);
            if (!$product) {
                $this->sendError('Product not found', 404);
            }
            
            $data['updated_at'] = date('Y-m-d H:i:s');
            
            $result = $this->productModel->update($id, $data);
            
            if ($result) {
                $this->sendSuccess(null, 'Product updated successfully');
            } else {
                $this->sendError('Failed to update product', 500);
            }
        } catch (Exception $e) {
            $this->sendError('Failed to update product', 500);
        }
    }
    
    /**
     * Delete product
     */
    public function delete($id) {
        $this->checkMethod(['DELETE']);
        
        try {
            // Check if product exists
            $product = $this->productModel->getById($id);
            if (!$product) {
                $this->sendError('Product not found', 404);
            }
            
            $result = $this->productModel->delete($id);
            
            if ($result) {
                $this->sendSuccess(null, 'Product deleted successfully');
            } else {
                $this->sendError('Failed to delete product', 500);
            }
        } catch (Exception $e) {
            $this->sendError('Failed to delete product', 500);
        }
    }
    
    /**
     * Search products
     */
    public function search() {
        $this->checkMethod(['GET']);
        
        try {
            $searchTerm = isset($_GET['q']) ? $_GET['q'] : '';
            
            if (empty($searchTerm)) {
                $this->sendError('Search term is required', 400);
            }
            
            $products = $this->productModel->search($searchTerm);
            $this->sendSuccess($products);
        } catch (Exception $e) {
            $this->sendError('Search failed', 500);
        }
    }
    
    /**
     * Get products by category
     */
    public function getByCategory($categoryId) {
        $this->checkMethod(['GET']);
        
        try {
            $products = $this->productModel->getByCategory($categoryId);
            $this->sendSuccess($products);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch products by category', 500);
        }
    }
    
    /**
     * Get featured products
     */
    public function featured() {
        $this->checkMethod(['GET']);
        
        try {
            $products = $this->productModel->getFeatured();
            $this->sendSuccess($products);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch featured products', 500);
        }
    }
    
    /**
     * Get low stock products
     */
    public function lowStock() {
        $this->checkMethod(['GET']);
        
        try {
            $threshold = isset($_GET['threshold']) ? (int)$_GET['threshold'] : 10;
            $products = $this->productModel->getLowStock($threshold);
            $this->sendSuccess($products);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch low stock products', 500);
        }
    }
    
    /**
     * Update product stock
     */
    public function updateStock($id) {
        $this->checkMethod(['PUT']);
        
        try {
            $data = $this->getRequestData();
            
            if (!isset($data['quantity']) || !is_numeric($data['quantity'])) {
                $this->sendError('Valid quantity is required', 400);
            }
            
            // Check if product exists
            $product = $this->productModel->getById($id);
            if (!$product) {
                $this->sendError('Product not found', 404);
            }
            
            $result = $this->productModel->updateStock($id, $data['quantity']);
            
            if ($result) {
                $this->sendSuccess(null, 'Stock updated successfully');
            } else {
                $this->sendError('Failed to update stock', 500);
            }
        } catch (Exception $e) {
            $this->sendError('Failed to update stock', 500);
        }
    }
}