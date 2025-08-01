const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ai-financial-coach-backend.onrender.com';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      this.token = data.access_token;
      localStorage.setItem('authToken', this.token);
      localStorage.setItem('userEmail', email);
      
      return {
        success: true,
        token: data.access_token,
        tokenType: data.token_type,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async register(email, password, fullName) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          full_name: fullName 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to get profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile error:', error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
