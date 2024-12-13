import { defineStore } from "pinia";
import axios from "axios";
// import { useAuthStore } from './authStore'; 

export const useApprenantStore = defineStore("apprenantStore", {
  state: () => ({
    apprenants: [],
    apprenant: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      addresse: "",
      tuteur:"",
    }
  }),

  actions: {
    async loadApprenantData() {
      // const authStore = useAuthStore(); 
      try {
        const response = await axios.get("http://localhost:3000/api/apprenants", {
          headers: {
            // Authorization: `Bearer ${authStore.token}` 
          }
        });
        this.apprenants = response.data;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des apprenants :",
          error.message
        );
      }
    },
    
    async loadApprenantById(id) {
      // const authStore = useAuthStore(); 
      try {
        const response = await axios.get(
          `http://localhost:3000/api/apprenants/${id}`,
          {
            headers: {
              // Authorization: `Bearer ${authStore.token}` 
            }
          }
        );
        const apprenantData = response.data;
        this.apprenant = {
          nom: apprenantData.nom,
          email: apprenantData.email,
          role: apprenantData.role
        };
       
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l'utilisateur :",
          error.message
        );
      }
    },

    async addApprenant(newApprenant) {
      // const authStore = useAuthStore();
      try {
        const response = await axios.post(
          "http://localhost:3000/api/apprenants",
          newApprenant,
          {
            headers: {
              // Authorization: `Bearer ${authStore.token}` 
            }
          }
        );
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("L'ajout a échoué.");
        }
        await this.loadApprenantData();
      } catch (error) {
        console.error(
          "Erreur lors de l'ajout de l'utilisateur :",
          error.response?.data || error.message
        );
        throw error;
      }
    },    

    async updateApprenant(id, updatedApprenant) {
      // const authStore = useAuthStore();
      try {
        const response = await axios.put(
          `http://localhost:3000/api/apprenants/${id}`,
          updatedApprenant,
          {
            headers: {
              // Authorization: `Bearer ${authStore.token}` 
            }
          }
        );

        if (response.status !== 200) {
          throw new Error("La mise à jour a échoué.");
        }

       await this.loadApprenantData();
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de l'utilisateur :",
          error.message
        );
        throw error;
      }
    },

    async removeApprenant(id) {
      // const authStore = useAuthStore();
      try {
        await axios.delete(`http://localhost:3000/api/apprenants/${id}`, {
          headers: {
            // Authorization: `Bearer ${authStore.token}` 
          }
        });
      await this.loadApprenantData();
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'utilisateur :",
          error.message
        );
        throw error;
      }
    }
  },

  persist: false
});
