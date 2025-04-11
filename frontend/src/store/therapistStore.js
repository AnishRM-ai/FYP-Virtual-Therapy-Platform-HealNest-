import {create} from 'zustand';
import axios from 'axios';


axios.defaults.withCredentials = true;

const useTherapistStore = create((set) => ({
    therapists: [],
    therapist: null,
    availability: {},
    sessions:[],
    clientHistory: {},
    sessionNotes: {},
    loading: false,
    error: null,

    fetchTherapists: async () => {
        set({ loading: true, error: null});
        try{
            const res = await axios.get('http://localhost:5555/api/therapist');
            set({therapists: res.data.therapists});
        } catch (err) {
            set({error: 'Failed to fetch therapists', err});
        } finally{
            set({ loading: false});
        }
    },

    fetchAvailability: async (therapistId) => {
        set((state) => ({
            availability: {...state.availability, [therapistId]: []}
        }));
        try{
            const res = await axios.get(`http://localhost:5555/api/therapist/${therapistId}/slots`);
            console.log(`Fetched availability for ${therapistId}:`, res.data);
            set((state)=> ({
                availability: { ...state.availability, [therapistId]: res.data.availability}
            }));

        }catch (err) {
            console.error('Error fetching availability: ', err);
        }
    },
    fetchTherapistsById: async (therapistId) => {
        set({loading: true, error:null});
        try{
            const res = await axios.get(`http://localhost:5555/api/therapist/${therapistId}`);
            set({therapist: res.data.therapist});
        } catch (err) {
            set({error: 'Failed to fetch therapists', err});
        } finally{
            set({ loading: false});
        }
    },
    fetchAuthenticatedTherapist: async () => {
        set({loading: true , error: null});
          try{
            const response = await axios.get(`http://localhost:5555/api/auth/check-auth`);
            set({therapist: response.data.user});
          } catch (error) {
            set({ error: 'Failed to fetch therapist data.'});
            throw error;
          } finally{
            set({ loading: false});
          }
    },

    fetchAuthenticatedAvailability: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get('http://localhost:5555/api/therapist/availability');
            set((state) => ({
                availability: { ...state.availability, [res.data.availability.therapistId]: res.data.availability }
            }));
        } catch (err) {
            console.error('Error fetching authenticated therapist availability:', err);
            set({ error: 'Failed to fetch availability' });
        } finally {
            set({ loading: false });
        }
    },
    addUpdateAvailability: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`http://localhost:5555/api/therapist/createAvailability`,{
                slots: data.slots,
                timezone: data.timezone || 'GMT',
                isAvailable: data.isAvailable
        });
        set((state) => ({
            availability: { ...state.availability, [response.data.availability.therapistId]: response.data.availability }
        }));
        return response.data.availability;
        } catch (err) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    deleteAvailability: async(startDateTime) => {
        set({ loading: true, error: null });
        try {
            // Send a DELETE request to remove the slot
            const response = await axios.delete('http://localhost:5555/api/therapist/delete/slot', {
                data: { startDateTime }
            });

            // Update the availability in the store after the slot deletion
            set((state) => {
                const updatedAvailability = state.availability?.filter(
                    (slot) => new Date(slot.startDateTime).toISOString() !== startDateTime
                );
                return {
                    availability: updatedAvailability
                };
            });

            // Success response
            set({ loading: false });
            console.log('Slot deleted successfully:', response.data);
        } catch (err) {
            set({ error: 'Failed to delete slot', loading: false });
            console.error('Error deleting slot:', err);
        }
    },

    fetchSessions: async () => {
        set({loading: true, error:null});
        try{
            const response = await axios.get(`http://localhost:5555/session/getSession`);
            set({sessions: response.data.sessions, loading:false});
        }catch(err){
            set({error: err.message, loading:false});
        }
    },

    updateSessionNotes: async (sessionId, therapistNotes)=>{
        set({loading: true, error:null});
        try {
            const response = await axios.put(`http://localhost:5555/session/notes/${sessionId}`, {
                therapistNotes
            });
            // Optionally, update the session state after successful update
            set((state) => {
                const updatedSessions = state.sessions.map(session =>
                    session._id === sessionId ? { ...session, notes: { ...session.notes, therapistNotes } } : session
                );
                return { sessions: updatedSessions };
            });
            set({ loading: false });
            return response.data;  // Return the updated session data
        } catch (err) {
            set({ error: 'Failed to update session notes', loading: false });
            console.error('Error updating session notes:', err);
        }
    },

     // Mark session as completed
     markSessionComplete: async (sessionId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`http://localhost:5555/session/status/${sessionId}`);
            // Optionally, update the session state after successful update
            set((state) => {
                const updatedSessions = state.sessions.map(session =>
                    session._id === sessionId ? { ...session, status: 'completed' } : session
                );
                return { sessions: updatedSessions };
            });
            set({ loading: false });
            return response.data;  // Return the updated session data
        } catch (err) {
            set({ error: 'Failed to mark session as completed', loading: false });
            console.error('Error marking session complete:', err);
        }
    },

    updateAvailability: async (startDateTime, therapistId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`http://localhost:5555/api/updateAvailability`, {
                startDateTime, therapistId
            },);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update availability', loading: false });
            console.error('Error updating availability:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to update availability' };
        }
    },

    deleteSession: async(sessionId) =>{
        set({loading: true, error:null});
        try{
            const response = await axios.delete(`http://localhost:5555/session/delete/${sessionId}`);
            set({loading:false});
            return response.data;
        }catch(error){
            set({error: error.response?.data?.message || 'Failed to delete session', loading: false});
            console.error('Error deleting session:', error);
            return{ success: false, message: error.response?.data?.message || 'Failed to delete session'};
        }
    },

    // New function to update private notes for a session
    updatePrivateNotes: async (sessionId, privateNotes) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`http://localhost:5555/session/${sessionId}/privateNotes`, {
                privateNotes
            });
            
            // Update the sessions in the store
            set((state) => {
                const updatedSessions = state.sessions.map(session =>
                    session._id === sessionId 
                        ? { ...session, notes: { ...session.notes, therapistNotes: privateNotes } } 
                        : session
                );
                return { sessions: updatedSessions };
            });
            
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update private notes', loading: false });
            console.error('Error updating private notes:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to update private notes' };
        }
    },

    // New function to update shared notes for a session
    updateSharedNotes: async (sessionId, sharedNotes) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(`http://localhost:5555/session/${sessionId}/sharedNotes`, {
                sharedNotes
            });
            
            // Update the sessions in the store
            set((state) => {
                const updatedSessions = state.sessions.map(session =>
                    session._id === sessionId 
                        ? { ...session, notes: { ...session.notes, sharedNotes: sharedNotes } } 
                        : session
                );
                return { sessions: updatedSessions };
            });
            
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to update shared notes', loading: false });
            console.error('Error updating shared notes:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to update shared notes' };
        }
    },

    // New function to fetch client session history
    fetchClientSessionHistory: async (clientId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:5555/session/client/${clientId}/history`);
            
            // Store the client history in the state
            set((state) => ({
                clientHistory: { 
                    ...state.clientHistory, 
                    [clientId]: response.data.sessions 
                },
                loading: false
            }));
            
            return response.data.sessions;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch client history', loading: false });
            console.error('Error fetching client history:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to fetch client history' };
        }
    },

    // Optional: Function to fetch session notes specifically
    fetchSessionNotes: async (sessionId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:5555/session/${sessionId}/notes`);
            
            // Store the session notes in the state
            set((state) => ({
                sessionNotes: { 
                    ...state.sessionNotes, 
                    [sessionId]: response.data.notes 
                },
                loading: false
            }));
            
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch session notes', loading: false });
            console.error('Error fetching session notes:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to fetch session notes' };
        }
    }
}));

export default useTherapistStore;