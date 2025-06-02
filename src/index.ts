import express from 'express';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());

// Complete swagger spec with many different types of routes
const swaggerSpec = {
  swagger: "2.0",
  info: {
    title: "Complete User Management API",
    version: "2.0.0",
    description: "A comprehensive REST API demonstrating various endpoint patterns, authentication, file operations, and admin features"
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  definitions: {
    User: {
      type: "object",
      required: ["name", "email"],
      properties: {
        id: { type: "integer", description: "User ID", example: 1 },
        name: { type: "string", description: "User's full name", example: "John Doe" },
        email: { type: "string", description: "User's email address", example: "john.doe@example.com" },
        age: { type: "integer", description: "User's age (optional)", example: 28 },
        role: { type: "string", enum: ["user", "admin", "moderator"], example: "user" },
        isActive: { type: "boolean", description: "User status", example: true },
        createdAt: { type: "string", format: "date-time", example: "2023-01-01T00:00:00Z" }
      }
    },
    UserInput: {
      type: "object",
      required: ["name", "email"],
      properties: {
        name: { type: "string", description: "User's full name", example: "John Doe" },
        email: { type: "string", description: "User's email address", example: "john.doe@example.com" },
        age: { type: "integer", description: "User's age (optional)", example: 28 },
        role: { type: "string", enum: ["user", "admin", "moderator"], example: "user" }
      }
    },
    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", example: "john.doe@example.com" },
        password: { type: "string", example: "password123" }
      }
    },
    AuthResponse: {
      type: "object",
      properties: {
        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        user: { $ref: "#/definitions/User" },
        expiresIn: { type: "integer", example: 3600 }
      }
    },
    Statistics: {
      type: "object",
      properties: {
        totalUsers: { type: "integer", example: 150 },
        activeUsers: { type: "integer", example: 142 },
        newUsersToday: { type: "integer", example: 5 },
        topCountries: { type: "array", items: { type: "string" }, example: ["USA", "UK", "Canada"] }
      }
    },
    Error: {
      type: "object",
      properties: {
        status: { type: "integer", description: "HTTP status code" },
        message: { type: "string", description: "Error message" }
      }
    }
  },
  paths: {
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Retrieve a paginated list of users with optional filtering",
        parameters: [
          { in: "query", name: "page", type: "integer", description: "Page number", example: 1 },
          { in: "query", name: "limit", type: "integer", description: "Items per page", example: 10 },
          { in: "query", name: "role", type: "string", enum: ["user", "admin", "moderator"], description: "Filter by role" },
          { in: "query", name: "isActive", type: "boolean", description: "Filter by active status" }
        ],
        responses: {
          200: {
            description: "List of users retrieved successfully",
            schema: { type: "array", items: { $ref: "#/definitions/User" } }
          }
        }
      },
      post: {
        tags: ["Users"],
        summary: "Create a new user",
        description: "Create a new user with the provided information",
        parameters: [
          { in: "body", name: "user", description: "User object to be created", required: true, schema: { $ref: "#/definitions/UserInput" } }
        ],
        responses: {
          201: { description: "User created successfully", schema: { $ref: "#/definitions/User" } },
          400: { description: "Bad request - missing required fields", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        parameters: [
          { in: "path", name: "id", type: "integer", required: true, description: "User ID", example: 1 }
        ],
        responses: {
          200: { description: "User found successfully", schema: { $ref: "#/definitions/User" } },
          404: { description: "User not found", schema: { $ref: "#/definitions/Error" } }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Update user by ID",
        parameters: [
          { in: "path", name: "id", type: "integer", required: true, description: "User ID", example: 1 },
          { in: "body", name: "user", description: "Updated user information", required: true, schema: { $ref: "#/definitions/UserInput" } }
        ],
        responses: {
          200: { description: "User updated successfully", schema: { $ref: "#/definitions/User" } },
          400: { description: "Bad request", schema: { $ref: "#/definitions/Error" } },
          404: { description: "User not found", schema: { $ref: "#/definitions/Error" } }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user by ID",
        parameters: [
          { in: "path", name: "id", type: "integer", required: true, description: "User ID", example: 1 }
        ],
        responses: {
          204: { description: "User deleted successfully" },
          404: { description: "User not found", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/users/search": {
      get: {
        tags: ["Users"],
        summary: "Search users",
        description: "Search users by name, email, or other criteria",
        parameters: [
          { in: "query", name: "q", type: "string", required: true, description: "Search query", example: "john" },
          { in: "query", name: "fields", type: "string", description: "Fields to search in", example: "name,email" },
          { in: "query", name: "limit", type: "integer", description: "Maximum results", example: 20 }
        ],
        responses: {
          200: { description: "Search results", schema: { type: "array", items: { $ref: "#/definitions/User" } } },
          400: { description: "Invalid search query", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/users/{id}/avatar": {
      post: {
        tags: ["Users", "Files"],
        summary: "Upload user avatar",
        description: "Upload a profile picture for a user",
        consumes: ["multipart/form-data"],
        parameters: [
          { in: "path", name: "id", type: "integer", required: true, description: "User ID", example: 1 },
          { in: "formData", name: "avatar", type: "file", required: true, description: "Avatar image file" }
        ],
        responses: {
          200: { description: "Avatar uploaded successfully" },
          400: { description: "Invalid file format", schema: { $ref: "#/definitions/Error" } },
          404: { description: "User not found", schema: { $ref: "#/definitions/Error" } }
        }
      },
      delete: {
        tags: ["Users", "Files"],
        summary: "Delete user avatar",
        parameters: [
          { in: "path", name: "id", type: "integer", required: true, description: "User ID", example: 1 }
        ],
        responses: {
          204: { description: "Avatar deleted successfully" },
          404: { description: "User not found", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "User login",
        description: "Authenticate user and return JWT token",
        parameters: [
          { in: "body", name: "credentials", required: true, schema: { $ref: "#/definitions/LoginRequest" } }
        ],
        responses: {
          200: { description: "Login successful", schema: { $ref: "#/definitions/AuthResponse" } },
          401: { description: "Invalid credentials", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "User logout",
        description: "Invalidate user session",
        parameters: [
          { in: "header", name: "Authorization", type: "string", required: true, description: "Bearer token" }
        ],
        responses: {
          200: { description: "Logout successful" },
          401: { description: "Unauthorized", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Authentication"],
        summary: "Request password reset",
        parameters: [
          { in: "body", name: "email", required: true, schema: { type: "object", properties: { email: { type: "string", example: "user@example.com" } } } }
        ],
        responses: {
          200: { description: "Password reset email sent" },
          404: { description: "Email not found", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/auth/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password",
        parameters: [
          { in: "body", name: "resetData", required: true, schema: { 
            type: "object", 
            properties: { 
              token: { type: "string", example: "reset-token-123" },
              newPassword: { type: "string", example: "newPassword123" }
            }
          }}
        ],
        responses: {
          200: { description: "Password reset successful" },
          400: { description: "Invalid or expired token", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users (Admin only)",
        description: "Admin endpoint to retrieve all users with detailed information",
        parameters: [
          { in: "header", name: "Authorization", type: "string", required: true, description: "Bearer token with admin privileges" },
          { in: "query", name: "includeDeleted", type: "boolean", description: "Include soft-deleted users" }
        ],
        responses: {
          200: { description: "All users retrieved", schema: { type: "array", items: { $ref: "#/definitions/User" } } },
          403: { description: "Forbidden - Admin access required", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/admin/users/{id}/ban": {
      post: {
        tags: ["Admin"],
        summary: "Ban a user",
        parameters: [
          { in: "header", name: "Authorization", type: "string", required: true, description: "Bearer token with admin privileges" },
          { in: "path", name: "id", type: "integer", required: true, description: "User ID", example: 1 },
          { in: "body", name: "banReason", schema: { type: "object", properties: { reason: { type: "string", example: "Violation of terms" } } } }
        ],
        responses: {
          200: { description: "User banned successfully" },
          403: { description: "Forbidden", schema: { $ref: "#/definitions/Error" } },
          404: { description: "User not found", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/admin/statistics": {
      get: {
        tags: ["Admin", "Analytics"],
        summary: "Get platform statistics",
        parameters: [
          { in: "header", name: "Authorization", type: "string", required: true, description: "Bearer token with admin privileges" },
          { in: "query", name: "period", type: "string", enum: ["day", "week", "month", "year"], description: "Statistics period" }
        ],
        responses: {
          200: { description: "Statistics retrieved", schema: { $ref: "#/definitions/Statistics" } },
          403: { description: "Forbidden", schema: { $ref: "#/definitions/Error" } }
        }
      }
    },
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        description: "Check if the API is running properly",
        responses: {
          200: { 
            description: "API is healthy",
            schema: { 
              type: "object",
              properties: {
                status: { type: "string", example: "healthy" },
                timestamp: { type: "string", example: "2023-01-01T00:00:00Z" },
                version: { type: "string", example: "2.0.0" }
              }
            }
          }
        }
      }
    },
    "/export/users": {
      get: {
        tags: ["Export"],
        summary: "Export users data",
        description: "Export user data in various formats",
        parameters: [
          { in: "query", name: "format", type: "string", enum: ["csv", "json", "xlsx"], description: "Export format", example: "csv" },
          { in: "query", name: "fields", type: "string", description: "Comma-separated list of fields to include" }
        ],
        produces: ["text/csv", "application/json", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
        responses: {
          200: { description: "Data exported successfully" },
          400: { description: "Invalid format", schema: { $ref: "#/definitions/Error" } }
        }
      }
    }
  }
};

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Complete User Management API',
    endpoints: {
      users: '/users',
      authentication: '/auth',
      admin: '/admin',
      documentation: '/docs'
    },
    version: '2.0.0',
    features: ['CRUD Operations', 'Authentication', 'File Upload', 'Admin Panel', 'Search', 'Export', 'Analytics']
  });
});

// API routes
app.use('/users', userRoutes);

// Mock routes for demonstration
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), version: '2.0.0' });
});

app.get('/users/search', (req, res) => {
  const { q } = req.query;
  res.json([{ id: 1, name: `Results for: ${q}`, email: 'search@example.com' }]);
});

app.post('/auth/login', (req, res) => {
  res.json({ token: 'mock-jwt-token', user: { id: 1, name: 'John Doe' }, expiresIn: 3600 });
});

app.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/admin/statistics', (req, res) => {
  res.json({ totalUsers: 150, activeUsers: 142, newUsersToday: 5 });
});

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    availableEndpoints: {
      'User Management': '/users',
      'Authentication': '/auth',
      'Admin Panel': '/admin',
      'Health Check': '/health',
      'API Documentation': '/docs'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/docs`);
  console.log(`👥 Users API: http://localhost:${PORT}/users`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/auth`);
  console.log(`⚡ Health Check: http://localhost:${PORT}/health`);
});
