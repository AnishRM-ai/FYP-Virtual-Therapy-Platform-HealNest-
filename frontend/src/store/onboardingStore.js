import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;
const useOnboardingStore = create((set) => ({
    user: null,
    fetchUser: async () => {
        try{
            const response = await axios.get('http://localhost:5555/api/auth/checkauth');
            set({user: response.data.user});
        }catch (error) {
            console.error("Failed to fetch user: ", error);
            set({ user: null});
        }
    },

    onboardTherapist: async (formData) => {
        try {
            const formDataObject = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item) => formDataObject.append(`${key}[]`, item));
                } else if (key === "qualificationProof") {
                    // Ensure files are correctly appended
                    value.forEach((file) => formDataObject.append("qualificationProof", file));
                } else {
                    formDataObject.append(key, value);
                }
            });
    
            const response = await axios.post(
                "http://localhost:5555/api/auth/therapist/onboarding",
                formDataObject,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
    
            set({ user: response.data.therapist });
            return { success: true, message: "Onboarding successful" };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Onboarding failed" };
        }
    },
    

    onboardClient: async (formData) => {
        try {
            const response = await axios.post(
                'http://localhost:5555/api/auth/client/onboarding',
                formData
            );

            set({ user: response.data.client });
            return { success: true, message: "Onboarding successful" };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Onboarding failed" };
        }
    }
}));

export default useOnboardingStore;
