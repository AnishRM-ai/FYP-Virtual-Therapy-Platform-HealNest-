import {create} from 'zustand';
import axios from 'axios';


axios.defaults.withCredentials = true;

const useTherapistStore = create((set) => ({
    therapists: [],
    availability: {},
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

    fetchAvailability: async ( therapistId) => {
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
            set({therapist: res.data.therapists});
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
    }
}));

export default useTherapistStore;