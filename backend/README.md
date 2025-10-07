# Backend Templates

This folder contains template files for your PHP backend application with a Model-View-Controller (MVC) architecture.

## Folder Structure

```
backend/
├── config/
│   └── db_connect.php
├── controllers/
│   ├── BaseController.php
│   ├── UserController.php
│   └── ProductController.php
├── models/
│   ├── BaseModel.php
│   ├── User.php
│   └── Product.php
├── routes/
│   └── api.php
└── README.md
```

## Models

### BaseModel.php
- Abstract base class for all models
- Provides common CRUD operations (Create, Read, Update, Delete)
- Methods: `getAll()`, `getById()`, `create()`, `update()`, `delete()`, `count()`

### User.php
- Extends BaseModel
- Handles user-related database operations
- Features: password hashing, email/username lookup, pagination
- Methods: `findByEmail()`, `findByUsername()`, `createUser()`, `updatePassword()`, `verifyPassword()`, `getPaginated()`

### Product.php
- Extends BaseModel
- Handles product-related database operations
- Features: category filtering, search, stock management, featured products
- Methods: `getByCategory()`, `search()`, `getLowStock()`, `updateStock()`, `getFeatured()`

## Controllers

### BaseController.php
- Abstract base class for all controllers
- Provides common functionality for API responses
- Methods: `sendResponse()`, `sendSuccess()`, `sendError()`, `validateRequired()`, `sanitizeInput()`

### UserController.php
- Extends BaseController
- Handles user-related HTTP requests
- Endpoints: index, show, store, update, delete, login
- Features: validation, authentication, pagination

### ProductController.php
- Extends BaseController
- Handles product-related HTTP requests
- Endpoints: index, show, store, update, delete, search, getByCategory, featured, lowStock, updateStock
- Features: search functionality, category filtering, stock management

## Usage

### Creating a New Model

1. Create a new PHP file in the `models/` folder
2. Extend the `BaseModel` class
3. Set the `$table` property to your database table name
4. Add custom methods as needed

Example:
```php
<?php
require_once 'BaseModel.php';

class Category extends BaseModel {
    protected $table = 'categories';
    
    public function __construct($database) {
        parent::__construct($database);
    }
    
    // Add custom methods here
}
```

### Creating a New Controller

1. Create a new PHP file in the `controllers/` folder
2. Extend the `BaseController` class
3. Include the required model
4. Implement CRUD methods

Example:
```php
<?php
require_once 'BaseController.php';
require_once '../models/Category.php';

class CategoryController extends BaseController {
    private $categoryModel;
    
    public function __construct($database) {
        parent::__construct($database);
        $this->categoryModel = new Category($database);
    }
    
    // Add controller methods here
}
```

## Database Requirements

Make sure your database tables have the following common fields:
- `id` (Primary Key, Auto Increment)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Example User Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Example Product Table
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Response Format

All API responses follow this format:

### Success Response
```json
{
    "success": true,
    "message": "Success message",
    "data": { ... }
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "errors": [ ... ]
}
```

## HTTP Methods

- `GET` - Retrieve data
- `POST` - Create new data
- `PUT` - Update existing data
- `DELETE` - Delete data

## Security Features

- Input sanitization
- Password hashing
- SQL injection prevention (using prepared statements)
- Method validation
- Required field validation

## Next Steps

1. Update `config/db_connect.php` with your database connection details
2. Create your database tables
3. Update `routes/api.php` to include your new controllers
4. Test your API endpoints
5. Add authentication middleware if needed