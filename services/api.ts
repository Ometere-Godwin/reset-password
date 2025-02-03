const BASE_URL = 'https://finarchitect-s8u2.onrender.com';

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}

export interface PasswordResetConfirmResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
}

const handleResponse = async (response: Response) => {
  try {
    // const contentType = response.headers.get('content-type');
    const text = await response.text();
    
    // Log the actual response for debugging
    console.log('Response status:', response.status);
    console.log('Response text:', text);

    // If it's a server error, throw the error message
    if (!response.ok) {
      // Try to parse the error message if it's JSON
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || errorData.detail || 'Server error occurred');
      } catch {
        // If it's not JSON, use the text as error message
        throw new Error(text || 'Server error occurred');
      }
    }

    // Try to parse the success response
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  },

  register: async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    company: string
  ): Promise<RegisterResponse> => {
    try {
      // Log the request payload for debugging
      console.log('Registration payload:', { email, password, first_name, last_name, company });

      const response = await fetch(`${BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name,
          last_name,
          company
        }),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Registration error details:', error);
      throw error;
    }
  },

  passwordReset: async (email: string): Promise<PasswordResetResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          redirect_url: `${window.location.origin}/reset-password`  
        }),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  passwordResetConfirm: async (
    token: string,
    password: string
  ): Promise<PasswordResetConfirmResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/password-reset-confirm/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          password,
          token  
        }),
        credentials: 'include',
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    }
  },
};