<template>
    <div class="apprenant-management">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <div class="top-bar">
            <h2>Liste des apprenants</h2>
            <router-link class="btn btn-success create-apprenant" to="/apprenant/ajouter">
                <i class="fas fa-user-plus"></i> Ajouter un apprenant
            </router-link>
        </div>


        <table class="apprenant-table">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Adresse</th>
                    <th>Tuteur/Tutrice</th>
                    <th>Status</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(apprenant, index) in apprenantStore.apprenants" :key="apprenant.id">
                    <td>{{ apprenant.nom }}</td>
                    <td>{{ apprenant.prenom }}</td>
                    <td>{{ apprenant.email }}</td>
                    <td>{{ apprenant.telephone }}</td>
                    <td>{{ apprenant.adresse }}</td>
                    <td>{{ apprenant.tuteur }}</td>
                    <td class="status">
                        <i :class="apprenant.status ? 'fas fa-check-circle active-status' : 'fas fa-ban blocked-status'"
                            :title="apprenant.status ? 'Actif' : 'Inactif'"
                            @click="toggleApprenantStatus(apprenant)"></i>
                    </td>
                    <td class="actions">
                        <router-link :to="`/apprenant/modifier/${apprenant.id}`" class="action-btn">
                            <i class="fas fa-edit"></i>
                        </router-link>
                        <button class="action-btn" @click="confirmRemoveApprenant(apprenant.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useApprenantStore } from '@/stores/useApprenantStore';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

const apprenantStore = useApprenantStore();
const toast = useToast();
const apprenants = ref([]);
const isLoading = ref(false);

onMounted(async () => {
    isLoading.value = false;
    try {

        await apprenantStore.loadApprenantData();
        apprenants.value = apprenantStore.apprenants;
    } catch (error) {
        console.error("Erreur lors du chargement des apprenants:", error);
        toast.error("Une erreur est survenue lors du chargement des apprenants.");
    } finally {
        isLoading.value = false;
    }
});



const confirmRemoveApprenant = async (id) => {
    const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Voulez-vous vraiment supprimer cet apprenant ?',
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
            await apprenantStore.removeApprenant(id);
            toast.success('Apprenant supprimé avec succès !');
            await apprenantStore.loadApprenantData();
            apprenants.value = apprenantStore.apprenants;
        } catch (error) {
            console.error("Erreur lors de la suppression:", error.message);
            toast.error('Une erreur est survenue lors de la suppression.');
        } finally {
            isLoading.value = false;
        }
    }
};

const toggleApprenantStatus = async (apprenant) => {
    try {
        const updatedStatus = !apprenant.status;
        await apprenantStore.updateApprenant(apprenant.id, {
            nom: apprenant.nom,
            prenom: apprenant.prenom,
            email: apprenant.email,
            telephone: apprenant.telephone,
            adresse: apprenant.adresse,
            tuteur: apprenant.tuteur,
            status: updatedStatus
        });

        apprenant.status = updatedStatus;

        toast.success(
            `Le statut de l'apprenant ${apprenant.nom} a été mis à jour avec succès !`
        );
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error.message);
        toast.error("Une erreur est survenue lors de la mise à jour du statut.");
    }
};
</script>

<style scoped>
.apprenant-management {
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

.create-apprenant {
    color: white;
    border-radius: 5px;
    padding: 10px 15px;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.create-apprenant i {
    margin-right: 8px;
}

.apprenant-table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.apprenant-table th,
.apprenant-table td {
    padding: 15px 20px;
    text-align: left;
}

.apprenant-table th {
    background-color: #f9f9f9;
    color: #666;
    font-weight: bold;
}

.apprenant-table td {
    border-bottom: 1px solid #e3e3e3;
    color: #333;
}

.apprenant-table tbody tr:hover {
    background-color: #f1f1f1;
}

.status i {
    font-size: 18px;
    cursor: pointer;
}

.active-status {
    color: #28a745;
}

.blocked-status {
    color: #dc3545;
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
