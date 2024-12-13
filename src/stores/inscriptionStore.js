import { defineStore } from "pinia";
import axios from "axios";

export const useInscriptionStore = defineStore("apprenantStore", {
  state: () => ({
    apprenants: [],
    inscriptions: [],
    moduls: [],
  }),

  actions: {
    async loadInscriptions() {
      try {
        const response = await axios.get("http://localhost:3000/api/apprenants");
        this.apprenants = response.data;
      } catch (error) {
        console.error(
          "Erreur lors du chargement des apprenants :",
          error.message
        );
      }
    },
    
    async loadInscriptionById(id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/apprenants/${id}`);
          this.inscription = response.data;
          return this.inscription;
      } catch (error) {
        console.error(
          "Erreur lors du chargement de l'utilisateur :",
          error.message
        );
      }
    },

    async addInscription(newInscription) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/apprenants",
          newInscription);
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("L'ajout a échoué.");
        }
        await this.loadInscriptions();
      } catch (error) {
        console.error(
          "Erreur lors de l'ajout de l'utilisateur :",
          error.response?.data || error.message
        );
        throw error;
      }
    },    

    async updateApprenant(id, updatedApprenant) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/apprenants/${id}`,
          updatedApprenant,);

        if (response.status !== 200) {
          throw new Error("La mise à jour a échoué.");
        }

       await this.loadInscriptions();
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de l'utilisateur :",
          error.message
        );
        throw error;
      }
    },

    async removeApprenant(id) {
      try {
        await axios.delete(`http://localhost:3000/api/apprenants/${id}`);
      await this.loadInscriptions();
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
