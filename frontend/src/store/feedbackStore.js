import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;

const API = 'http://localhost:5555/feedback';
const useFeedbackStore = create((set) => ({
    feedbacks: [],
    loading: false,
    error: null,

    // Fetch feedback for a therapist
    fetchTherapistFeedback: async (therapistId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API} /${therapistId}`, { withCredentials: true });
            set({ feedbacks: response.data, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch feedback', loading: false });
        }
    },

    // Fetch feedback for a specific session
    fetchSessionFeedback: async (sessionId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API}/${sessionId}`, { withCredentials: true });
            set({ feedbacks: [response.data], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch feedback', loading: false });
        }
    },

    // Submit feedback
    submitFeedback: async (feedbackData) => {
        set({ loading: true, error: null });
        try {
            await axios.post(`${API}/create`, feedbackData, { withCredentials: true });
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to submit feedback', loading: false });
        }
    }
}));

export default useFeedbackStore;
