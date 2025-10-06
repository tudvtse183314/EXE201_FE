// Mock API for development when backend is not available
class MockApi {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  // Simulate network delay
  delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock register endpoint
  async register(userData) {
    await this.delay(1500); // Simulate network delay

    // Check for duplicate email/phone
    const existingUser = this.users.find(user => 
      user.email === userData.email || user.phone === userData.phone
    );

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw {
          response: {
            data: {
              message: 'Email address is already registered',
              errors: [
                { field: 'email', message: 'Email address is already registered' }
              ]
            }
          }
        };
      }
      if (existingUser.phone === userData.phone) {
        throw {
          response: {
            data: {
              message: 'Phone number is already registered',
              errors: [
                { field: 'phone', message: 'Phone number is already registered' }
              ]
            }
          }
        };
      }
    }

    // Validate required fields
    const errors = [];
    if (!userData.fullName?.trim()) {
      errors.push({ field: 'fullName', message: 'Full name is required' });
    }
    if (!userData.email?.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push({ field: 'email', message: 'Email is invalid' });
    }
    if (!userData.phone?.trim()) {
      errors.push({ field: 'phone', message: 'Phone number is required' });
    } else if (!/^[0-9]{10,15}$/.test(userData.phone)) {
      errors.push({ field: 'phone', message: 'Phone number must be 10-15 digits' });
    }
    if (!userData.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (userData.password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }
    if (!userData.petName?.trim()) {
      errors.push({ field: 'petName', message: 'Pet name is required' });
    }
    if (!userData.petType) {
      errors.push({ field: 'petType', message: 'Pet type is required' });
    }

    if (errors.length > 0) {
      throw {
        response: {
          data: {
            message: 'Validation failed',
            errors
          }
        }
      };
    }

    // Create new user
    const newUser = {
      id: this.nextId++,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'CUSTOMER',
      petName: userData.petName,
      petAge: userData.petAge,
      petType: userData.petType,
      petSize: userData.petSize,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);

    return {
      data: {
        message: 'User registered successfully',
        user: newUser,
        token: `mock_token_${newUser.id}_${Date.now()}`
      }
    };
  }

  // Mock login endpoint
  async login(credentials) {
    await this.delay(1000); // Simulate network delay

    const { phone, password } = credentials;

    // Find user by phone
    const user = this.users.find(u => u.phone === phone);

    if (!user) {
      throw {
        response: {
          data: {
            message: 'Invalid phone number or password'
          }
        }
      };
    }

    // For demo, accept any password that's at least 6 characters
    if (!password || password.length < 6) {
      throw {
        response: {
          data: {
            message: 'Invalid phone number or password'
          }
        }
      };
    }

    return {
      data: {
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token: `mock_token_${user.id}_${Date.now()}`
      }
    };
  }

  // Mock account endpoint
  async getAccount(token) {
    await this.delay(800); // Simulate network delay
    
    // Extract user ID from token (mock_token_1_1234567890)
    const tokenParts = token.split('_');
    const userId = parseInt(tokenParts[2]);
    
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      throw {
        response: {
          data: {
            message: 'User not found'
          }
        }
      };
    }
    
    return {
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        petName: user.petName,
        petAge: user.petAge,
        petType: user.petType,
        petSize: user.petSize,
        enabled: true,
        accountNonLocked: true,
        accountNonExpired: true,
        credentialsNonExpired: true
      }
    };
  }

  // Mock health check
  async health() {
    await this.delay(500);
    return {
      data: {
        status: 'OK',
        message: 'Mock API is running',
        timestamp: new Date().toISOString()
      }
    };
  }

  // Get all users (for debugging)
  getUsers() {
    return this.users;
  }

  // Clear all users (for testing)
  clearUsers() {
    this.users = [];
    this.nextId = 1;
  }
}

// Create singleton instance
const mockApi = new MockApi();

// Mock axios-like interface
export const mockAxios = {
  post: async (url, data) => {
    switch (url) {
      case '/register':
        return await mockApi.register(data);
      case '/login':
        return await mockApi.login(data);
      default:
        throw new Error(`Mock API: Endpoint ${url} not implemented`);
    }
  },
  get: async (url, config) => {
    switch (url) {
      case '/health':
        return await mockApi.health();
      case '/account':
        // Extract token from Authorization header
        const authHeader = config?.headers?.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new Error('Mock API: Authorization header required for /account');
        }
        const token = authHeader.replace('Bearer ', '');
        return await mockApi.getAccount(token);
      default:
        throw new Error(`Mock API: Endpoint ${url} not implemented`);
    }
  }
};

// Export mock API instance for debugging
export { mockApi };

export default mockAxios;
