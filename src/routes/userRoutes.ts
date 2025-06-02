import { Router, RequestHandler } from 'express';

// Interface for User type
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

// Interface for creating/updating user
interface UserInput {
  name: string;
  email: string;
  age?: number;
}

// Interface for error response
interface ErrorResponse {
  message: string;
  status: number;
}

// Custom error class for API-specific errors
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic error handler to standardize error responses
const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    return { status: error.status, message: error.message };
  }
  return { status: 500, message: 'Internal server error' };
};

// Input validation function for user creation/updation
const validateUserInput = (input: Partial<UserInput>): void => {
  if (!input.name || !input.email) {
    throw new ApiError(400, 'Name and email are required');
  }
};

const router = Router();

// In-memory mock database
let users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 25 }
];

// GET all users
const getAllUsers: RequestHandler = (_req, res) => {
  
  res.json(users);
};

// GET user by ID
const getUserById: RequestHandler<{ id: string }, User | ErrorResponse> = (req, res) => {
  
  try {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res.json(user);
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ status, message });
  }
};

// POST new user
const createUser: RequestHandler<{}, User | ErrorResponse, UserInput> = (req, res) => {
  
  try {
    validateUserInput(req.body);

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: req.body.name,
      email: req.body.email,
      age: req.body.age
    };

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ status, message });
  }
};

// PUT update user by ID
const updateUser: RequestHandler<{ id: string }, User | ErrorResponse, UserInput> = (req, res) => {
  
  try {
    validateUserInput(req.body);

    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new ApiError(404, 'User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      name: req.body.name,
      email: req.body.email,
      age: req.body.age
    };

    res.json(users[userIndex]);
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ status, message });
  }
};

// DELETE user by ID
const deleteUser: RequestHandler<{ id: string }, void | ErrorResponse> = (req, res) => {
  
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new ApiError(404, 'User not found');
    }

    users = users.filter(u => u.id !== userId);
    res.status(204).send();
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ status, message });
  }
};

// Register routes with corresponding HTTP methods
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Export the router to be used in index.ts
export default router;
