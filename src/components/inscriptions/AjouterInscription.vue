<template>
    <div class="inscription-form">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <h2>Ajouter une inscription</h2>

        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="apprenantId">Apprenant</label>
                <input type="text" id="apprenantId" v-model="inscription.apprenantId" required
                    placeholder="Entrez l'ID de l'apprenant" />
            </div>

            <div class="form-group">
                <label for="moduleId">ID Module</label>
                <input type="text" id="moduleId" v-model="inscription.moduleId" required
                    placeholder="Entrez l'ID du module" />
            </div>

            <div class="form-group">
                <label for="dateDebut">Date de Début</label>
                <input type="date" id="dateDebut" v-model="inscription.dateDebut" required />
            </div>

            <div class="form-group">
                <label for="dateFin">Date de Fin</label>
                <input type="date" id="dateFin" v-model="inscription.dateFin" required />
            </div>

            <div class="form-group">
                <label for="montant">Montant</label>
                <input type="number" id="montant" v-model="inscription.montant" required
                    placeholder="Entrez le montant" />
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-primary">Ajouter l'inscription</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useInscriptionStore } from '@/stores/inscriptionStore';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const inscriptionStore = useInscriptionStore();
const toast = useToast();
const router = useRouter();

const inscription = ref({
    apprenantId: '',
    moduleId: '',
    dateDebut: '',
    dateFin: '',
    montant: 0
});

const isLoading = ref(false);

const submitForm = async () => {
    isLoading.value = true;
    try {
        await inscriptionStore.addInscription(inscription.value);
        toast.success("Inscription ajoutée avec succès !");
        router.push('/inscriptions');
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'inscription :", error.message);
        toast.error("Une erreur est survenue lors de l'ajout de l'inscription.");
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.inscription-form {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
}

h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

input[type="text"],
input[type="date"],
input[type="number"] {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

input[type="text"]:focus,
input[type="date"]:focus,
input[type="number"]:focus {
    border-color: #66afe9;
    outline: none;
}

button[type="submit"] {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button[type="submit"]:hover {
    background-color: #16a085;
}
</style>
