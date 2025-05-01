import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;
// Define API base URL - replace with your actual API URL
const API_URL = 'http://localhost:5555/notification';

const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,

  // Fetch all notifications
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await axios.get(`${API_URL}/`, {
      });
      
      const notifications = response.data.data;
      const unreadCount = notifications.filter(notification => !notification.read).length;
      
      set({ 
        notifications,
        unreadCount,
        loading: false 
      });
      
      return notifications;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch notifications', 
        loading: false 
      });
      return [];
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    set({ loading: true, error: null });
    
    try {
      await axios.patch(`${API_URL}/notifications/${notificationId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state to mark notification as read
      const updatedNotifications = get().notifications.map(notification => 
        notification._id === notificationId ? { ...notification, read: true } : notification
      );
      
      const unreadCount = updatedNotifications.filter(notification => !notification.read).length;
      
      set({ 
        notifications: updatedNotifications,
        unreadCount,
        loading: false 
      });
      
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to mark notification as read', 
        loading: false 
      });
      return false;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    set({ loading: true, error: null });
    
    try {
      // This assumes your backend has an endpoint to mark all as read
      // If it doesn't, you could call markAsRead for each unread notification instead
      const markAllPromises = get().notifications
        .filter(notification => !notification.read)
        .map(notification => get().markAsRead(notification._id));
      
      await Promise.all(markAllPromises);
      
      set({ 
        notifications: get().notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0,
        loading: false 
      });
      
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to mark all notifications as read', 
        loading: false 
      });
      return false;
    }
  },
  
  // Clear notification errors
  clearError: () => set({ error: null }),
}));

export default useNotificationStore;