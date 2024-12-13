<template>
    <div class="inscription-management">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <div class="top-bar">
            <h2>Liste des Inscriptions</h2>
            <router-link class="btn btn-success create-inscription" to="/inscription/ajouter">
                <i class="fas fa-plus"></i> Ajouter une inscription
            </router-link>
        </div>

        <table class="inscription-table">
            <thead>
                <tr>
                    <th>Date d'inscription</th>
                    <th>ID Apprenant</th>
                    <th>ID Module</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Montant</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(inscription, index) in inscriptions" :key="inscription.id">
                    <td>{{ new Date(inscription.dateInscription).toLocaleDateString() }}</td>
                    <td>{{ inscription.apprenantId }}</td>
                    <td>{{ inscription.moduleId }}</td>
                    <td>{{ new Date(inscription.dateDebut).toLocaleDateString() }}</td>
                    <td>{{ new Date(inscription.dateFin).toLocaleDateString() }}</td>
                    <td>{{ inscription.montant }} €</td>
                    <td class="actions">
                        <button class="action-btn" @click="(inscription.id)">
                            <i class="fas fa-eye"></i>
                        </button>
                        <router-link :to="`/inscription/modifier/${inscription.id}`" class="action-btn">
                            <i class="fas fa-edit"></i>
                        </router-link>
                        <button class="action-btn" @click="confirmRemoveInscription(inscription.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useInscriptionStore } from '@/stores/inscriptionStore';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const inscriptionStore = useInscriptionStore();
const toast = useToast();
const inscriptions = ref([]);
const isLoading = ref(false);
const router = useRouter();

onMounted(async () => {
    isLoading.value = false;
    try {
        await inscriptionStore.loadInscriptions();
        inscriptions.value = inscriptionStore.inscriptions;
    } catch (error) {
        console.error("Erreur lors du chargement des inscriptions :", error.message);
        toast.error("Une erreur est survenue lors du chargement des inscriptions.");
    } finally {
        isLoading.value = false;
    }
});



const confirmRemoveInscription = async (id) => {
    const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Voulez-vous vraiment supprimer cette inscription ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
    });
    if (result.isConfirmed) {
        isLoading.value = true;
        try {
            await inscriptionStore.removeInscription(id);
            toast.success('Inscription supprimée avec succès !');
            await inscriptionStore.loadInscriptions();
            inscriptions.value = inscriptionStore.inscriptions;
        } catch (error) {
            console.error("Erreur lors de la suppression :", error.message);
            toast.error('Une erreur est survenue lors de la suppression.');
        } finally {
            isLoading.value = false;
        }
    }
};
</script>

<style scoped>
.inscription-management {
    margin: 0 auto;
    max-width: 1200px;
    padding: 10px;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 100px;
}

h2 {
    font-size: 24px;
    color: #4a4a4a;
}

.create-inscription {
    color: white;
    border-radius: 5px;
    padding: 10px 15px;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.create-inscription i {
    margin-right: 8px;
}

.inscription-table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.inscription-table th,
.inscription-table td {
    padding: 15px 20px;
    text-align: left;
}

.inscription-table th {
    background-color: #f9f9f9;
    color: #666;
    font-weight: bold;
}

.inscription-table td {
    border-bottom: 1px solid #e3e3e3;
    color: #333;
}

.inscription-table tbody tr:hover {
    background-color: #f1f1f1;
}

.actions {
    text-align: center;
}

.action-btn {
    background-color: transparent;
    border: none;
    margin-right: 10px;
    cursor: pointer;
}

.action-btn i {
    color: #6c757d;
    font-size: 18px;
}
</style>
