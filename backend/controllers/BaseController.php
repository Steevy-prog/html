<?php

abstract class BaseController {
    protected $db;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    /**
     * Send JSON response
     */
    protected function sendResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
    
    /**
     * Send success response
     */
    protected function sendSuccess($data = null, $message = 'Success') {
        $response = [
            'success' => true,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        $this->sendResponse($response, 200);
    }
    
    /**
     * Send error response
     */
    protected function sendError($message = 'An error occurred', $statusCode = 400, $errors = null) {
        $response = [
            'success' => false,
            'message' => $message
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        $this->sendResponse($response, $statusCode);
    }
    
    /**
     * Validate required fields
     */
    protected function validateRequired($data, $requiredFields) {
        $errors = [];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                $errors[] = "Field '{$field}' is required";
            }
        }
        
        return $errors;
    }
    
    /**
     * Sanitize input data
     */
    protected function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map([$this, 'sanitizeInput'], $data);
        }
        return htmlspecialchars(strip_tags(trim($data)));
    }
    
    /**
     * Get request method
     */
    protected function getRequestMethod() {
        return $_SERVER['REQUEST_METHOD'];
    }
    
    /**
     * Get request data based on method
     */
    protected function getRequestData() {
        $method = $this->getRequestMethod();
        
        switch ($method) {
            case 'GET':
                return $_GET;
            case 'POST':
                return $_POST;
            case 'PUT':
            case 'DELETE':
                $input = file_get_contents('php://input');
                return json_decode($input, true) ?: [];
            default:
                return [];
        }
    }
    
    /**
     * Check if request method is allowed
     */
    protected function checkMethod($allowedMethods) {
        $currentMethod = $this->getRequestMethod();
        
        if (!in_array($currentMethod, $allowedMethods)) {
            $this->sendError('Method not allowed', 405);
        }
    }
}