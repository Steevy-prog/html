
<?php

require_once 'BaseController.php';
require_once '../models/User.php';

class UserController extends BaseController {
    private $userModel;
    
    public function __construct($database) {
        parent::__construct($database);
        $this->userModel = new User($database);
    }
    
    /**
     * Get all users
     */
    public function index() {
        $this->checkMethod(['GET']);
        
        try {
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            
            $users = $this->userModel->getPaginated($page, $limit);
            $total = $this->userModel->count();
            
            $this->sendSuccess([
                'users' => $users,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total' => $total,
                    'total_pages' => ceil($total / $limit)
                ]
            ]);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch users', 500);
        }
    }
    
    /**
     * Get user by ID
     */
    public function show($id) {
        $this->checkMethod(['GET']);
        
        try {
            $user = $this->userModel->getById($id);
            
            if (!$user) {
                $this->sendError('User not found', 404);
            }
            
            // Remove password from response
            unset($user['password']);
            
            $this->sendSuccess($user);
        } catch (Exception $e) {
            $this->sendError('Failed to fetch user', 500);
        }
    }
    
    /**
     * Create new user
     */
    public function store() {
        $this->checkMethod(['POST']);
        
        try {
            $data = $this->getRequestData();
            $data = $this->sanitizeInput($data);
            
            // Validate required fields
            $requiredFields = ['username', 'email', 'password'];
            $errors = $this->validateRequired($data, $requiredFields);
            
            if (!empty($errors)) {
                $this->sendError('Validation failed', 400, $errors);
            }
            
            // Check if email already exists
            if ($this->userModel->findByEmail($data['email'])) {
                $this->sendError('Email already exists', 409);
            }
            
            // Check if username already exists
            if ($this->userModel->findByUsername($data['username'])) {
                $this->sendError('Username already exists', 409);
            }
            
            $result = $this->userModel->createUser($data);
            
            if ($result) {
                $this->sendSuccess(null, 'User created successfully');
            } else {
                $this->sendError('Failed to create user', 500);
            }
        } catch (Exception $e) {
            $this->sendError('Failed to create user', 500);
        }
    }
    
    /**
     * Update user
     */
    public function update($id) {
        $this->checkMethod(['PUT']);
        
        try {
            $data = $this->getRequestData();
            $data = $this->sanitizeInput($data);
            
            // Check if user exists
            $user = $this->userModel->getById($id);
            if (!$user) {
                $this->sendError('User not found', 404);
            }
            
            // Remove password from update data (use separate method for password updates)
            unset($data['password']);
            $data['updated_at'] = date('Y-m-d H:i:s');
            
            $result = $this->userModel->update($id, $data);
            
            if ($result) {
                $this->sendSuccess(null, 'User updated successfully');
            } else {
                $this->sendError('Failed to update user', 500);
            }
        } catch (Exception $e) {
            $this->sendError('Failed to update user', 500);
        }
    }
    
    /**
     * Delete user
     */
    public function delete($id) {
        $this->checkMethod(['DELETE']);
        
        try {
            // Check if user exists
            $user = $this->userModel->getById($id);
            if (!$user) {
                $this->sendError('User not found', 404);
            }
            
            $result = $this->userModel->delete($id);
            
            if ($result) {
                $this->sendSuccess(null, 'User deleted successfully');
            } else {
                $this->sendError('Failed to delete user', 500);
            }
        } catch (Exception $e) {
            $this->sendError('Failed to delete user', 500);
        }
    }
    
    /**
     * User login
     */
    public function login() {
        $this->checkMethod(['POST']);
        
        try {
            $data = $this->getRequestData();
            $data = $this->sanitizeInput($data);
            
            $requiredFields = ['email', 'password'];
            $errors = $this->validateRequired($data, $requiredFields);
            
            if (!empty($errors)) {
                $this->sendError('Validation failed', 400, $errors);
            }
            
            $user = $this->userModel->findByEmail($data['email']);
            
            if (!$user || !$this->userModel->verifyPassword($data['password'], $user['password'])) {
                $this->sendError('Invalid credentials', 401);
            }
            
            // Remove password from response
            unset($user['password']);
            
            // Here you would typically generate a JWT token or start a session
            $this->sendSuccess($user, 'Login successful');
        } catch (Exception $e) {
            $this->sendError('Login failed', 500);
        }
    }
}