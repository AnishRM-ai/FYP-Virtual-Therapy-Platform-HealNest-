import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

axios.defaults.withCredentials = true;
const API_URL ='http://localhost:5555/api/auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      registerAdmin: async (name, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post(`${API_URL}/admin/register`, {
            name,
            email,
            password
          });
          
          set({ 
            isLoading: false,
            error: null
          });
          
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ 
            isLoading: false, 
            error: errorMessage
          });
          
          return { success: false, message: errorMessage };
        }
      },

      loginAdmin: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post(`${API_URL}/admin/login`, {
            email,
            password
          });
          
          const { token, admin } = response.data;
          
          // Set auth headers for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ 
            admin,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ 
            isLoading: false, 
            error: errorMessage,
            admin: null,
            token: null,
            isAuthenticated: false
          });
          
          return { success: false, message: errorMessage };
        }
      },

      logout: () => {
        // Clear auth header
        delete axios.defaults.headers.common['Authorization'];
        
        set({ 
          admin: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
        
        return { success: true };
      },

      clearError: () => set({ error: null }),

      checkAuthState: () => {
        const { token } = get();
        if (token) {
          // Set auth header with stored token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return true;
        }
        return false;
      },

      // Utility method to make authenticated requests
      authRequest: async (method, endpoint, data = null) => {
        const { token, logout } = get();
        
        if (!token) {
          return { success: false, message: 'Not authenticated' };
        }
        
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };
          
          let response;
          
          if (method === 'get') {
            response = await axios.get(`${API_URL}${endpoint}`, config);
          } else if (method === 'post') {
            response = await axios.post(`${API_URL}${endpoint}`, data, config);
          } else if (method === 'put') {
            response = await axios.put(`${API_URL}${endpoint}`, data, config);
          } else if (method === 'delete') {
            response = await axios.delete(`${API_URL}${endpoint}`, config);
          }
          
          return { success: true, data: response.data };
        } catch (error) {
          // If token expired or invalid, logout
          if (error.response?.status === 401) {
            logout();
            return { success: false, message: 'Session expired. Please login again.' };
          }
          
          return { 
            success: false, 
            message: error.response?.data?.message || 'Request failed' 
          };
        }
      }
    }),
    {
      name: 'admin-auth-storage', // name for localStorage
      partialize: (state) => ({ 
        token: state.token, 
        admin: state.admin,
        isAuthenticated: state.isAuthenticated
      }), // only persist these fields
    }
  )
);

export default useAuthStore;