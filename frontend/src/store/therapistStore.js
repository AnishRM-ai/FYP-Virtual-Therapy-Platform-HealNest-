import {create} from 'zustand';
import axios from 'axios';


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
            const res = await axios.get(`http://localhost:5555/api/therapist/${therapistId}/availability`);
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
    }
}));

export default useTherapistStore;