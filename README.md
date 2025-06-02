# TypeScript Swagger Auto-Generated API

A REST API built with TypeScript, Express.js, and Swagger UI, demonstrating modern API development practices with automatic documentation generation.
Using swagger-autogen.


## Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Documentation**: Swagger UI, OpenAPI 2.0
- **Development**: ts-node, nodemon
- **Type Safety**: TypeScript with strict configuration

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup

 **Install dependencies**
   ```bash
   npm install
   ```
 **Start the application**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000`

## Usage

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-restart |
| `npm run start` | Start production server |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run swagger-autogen` | Generate Swagger documentation |

### API Endpoints

Visit `http://localhost:3000/docs` for the complete interactive API documentation.

#### User Management
- `GET /users` - List all users with pagination & filtering
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /users/search` - Search users

#### File Operations
- `POST /users/{id}/avatar` - Upload user avatar
- `DELETE /users/{id}/avatar` - Delete user avatar

#### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/logout` - End user session
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### Admin Features
- `GET /admin/users` - Get all users (admin only)
- `POST /admin/users/{id}/ban` - Ban user (admin only)
- `GET /admin/statistics` - Platform analytics

#### System
- `GET /health` - Health check endpoint
- `GET /export/users` - Export user data

## API Documentation

### Interactive Documentation
Access the full Swagger UI at: **http://localhost:3000/docs**

### Example Requests

#### Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 28,
    "role": "user"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

#### Search Users
```bash
curl -X GET "http://localhost:3000/users/search?q=john&limit=10"
```

## Project Structure

```
ts-swagger-autogen-app/
├── src/
│   ├── routes/
│   │   └── userRoutes.ts          # User CRUD operations
│   ├── index.ts                   # Main server & Swagger config
│   └── swagger-output.json        # Generated Swagger documentation
├── swagger-autogen.ts             # Swagger generation configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # Project documentation
```


### Manual Swagger Specification vs Annotations
Instead of using inline `#swagger` comments, this project uses a **manual Swagger specification**:

**Benefits:**
- Clean, readable route files
- Centralized documentation management
- Complete control over API specs
- Better maintainability
- No mixing of documentation with business logic

## Key Features Demonstrated

### 1. **Complete CRUD Operations**
Full user lifecycle management with proper HTTP methods and status codes.

### 2. **Advanced Parameter Handling**
- Path parameters (`/users/{id}`)
- Query parameters with filtering
- Request body validation
- Header authentication
- File upload (multipart/form-data)

### 3. **Error Handling**
- Custom error classes
- Consistent error responses
- Proper HTTP status codes
- Type-safe error handling

### 4. **Authentication Patterns**
- JWT token handling
- Password reset flows
- Session management
- Role-based access control

### 5. **File Operations**
- Multipart form data handling
- File upload endpoints
- MIME type validation

## Development

### Adding New Routes

1. **Add route handler** in `src/routes/` directory
2. **Update Swagger spec** in `src/index.ts`
3. **Register route** in the router
4. **Test in Swagger UI**

### Swagger Documentation

The Swagger specification is manually defined in `src/index.ts` for complete control over:
- Parameter definitions
- Response schemas
- Example values
- Authentication requirements
- File upload specifications

## Example Data Models

### User Model
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  createdAt: string;
}
```

### API Response
```typescript
interface ErrorResponse {
  status: number;
  message: string;
}
```

## Production Considerations

- Add environment variables for configuration
- Implement proper database integration
- Add authentication middleware
- Include rate limiting
- Set up logging and monitoring
- Add input validation and sanitization
- Implement proper error logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open Swagger UI
open http://localhost:3000/docs
```

**You're ready to explore the API!**

The Swagger UI provides a complete interactive interface where you can test all endpoints, view request/response schemas, and understand the API structure. 
