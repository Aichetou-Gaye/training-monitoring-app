<template>
    <div class="management">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <div class="top-bar">
            <h2>Liste des apprenants</h2>
            <router-link class="btn btn-success create" to="/apprenant/ajouter">
                <i class="fas fa-user-plus"></i> Ajouter un apprenant
            </router-link>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Adresse</th>
                    <th>Tuteur/Titrice</th>
                    <th>Status</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="apprenant in apprenants" :key="apprenant.id">
                    <td>{{ apprenant.full_name }}</td>
                    <td>{{ apprenant.email }}</td>
                    <td>{{ apprenant.phone_number }}</td>
                    <td>{{ apprenant.address }}</td>
                    <td>{{ apprenant.tutor }}</td>
                    <td class="status">
                        <i :class="apprenant.status ? 'fas fa-check-circle active-status' : 'fas fa-ban blocked-status'"
                            :title="apprenant.status ? 'Actif' : 'Inactif'"
                            @click="toggleApprenantStatus(apprenant)"></i>
                    </td>
                    <td class="actions">
                        <button class="action-btn" @click="viewApprenantDetails(apprenant.id)">
                            <i class="fas fa-eye"></i>
                        </button>

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

        <div v-if="isModalVisible" class="modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <span class="close" @click="closeModal">&times;</span>
                <h3>Détails de l'apprenant</h3>
                <div v-if="selectedApprenant">
                    <div class="mb-3">
                        <label for="full_name" class="form-label">Nom</label>
                        <input type="text" id="full_name" v-model="selectedApprenant.full_name" class="form-control"
                            readonly />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" id="email" v-model="selectedApprenant.email" class="form-control"
                            readonly />
                    </div>
                    <div class="mb-3">
                        <label for="phone_number" class="form-label">Téléphone</label>
                        <input type="text" id="phone_number" v-model="selectedApprenant.phone_number"
                            class="form-control" readonly />
                    </div>
                    <div class="mb-3">
                        <label for="address" class="form-label">Adresse</label>
                        <input type="text" id="address" v-model="selectedApprenant.address" class="form-control"
                            readonly />
                    </div>
                    <div class="mb-3">
                        <label for="tutor" class="form-label">Tuteur/Titrice</label>
                        <input type="text" id="tutor" v-model="selectedApprenant.tutor" class="form-control" readonly />
                    </div>
                    <!-- <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <input type="text" id="status" v-model="selectedApprenant.status ? 'Actif' : 'Inactif'"
                            class="form-control" readonly />
                    </div> -->
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useApprenantStore } from '@/stores/useApprenantStore';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

const apprenantStore = useApprenantStore();
const toast = useToast();
const apprenants = ref([]);
const isLoading = ref(false);
const isModalVisible = ref(false);
const selectedApprenant = ref(null);

onMounted(async () => {
    isLoading.value = true;
    try {
        await apprenantStore.loadApprenantData();
        apprenants.value = apprenantStore.apprenants;
        // console.log("fghjkhgfddf", apprenants.value);

    } catch (error) {
        console.error("Erreur lors du chargement des apprenants:", error);
        toast.error("Une erreur est survenue lors du chargement des apprenants.");
    } finally {
        isLoading.value = false;
    }
});

const viewApprenantDetails = async (id) => {
    isLoading.value = true;
    try {
        selectedApprenant.value = await apprenantStore.loadApprenantById(id);
        // selectedApprenant.value = apprenantStore.apprenant;
        isModalVisible.value = true;
    } catch (error) {
        console.error("Erreur lors du chargement des détails de l'apprenant :", error);
        toast.error("Une erreur est survenue lors du chargement des détails de l'apprenant.");
    } finally {
        isLoading.value = false;
    }
};


const closeModal = () => {
    isModalVisible.value = false;
};

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
            full_name: apprenant.full_name,
            email: apprenant.email,
            phone_number: apprenant.phone_number,
            address: apprenant.address,
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

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Fond semi-transparent */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: opacity 0.3s ease-in-out;
    /* Animation d'apparition du modal */
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    /* Coins arrondis */
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* Ombre subtile autour du modal */
    transition: transform 0.3s ease-in-out;
}

.modal-content h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 28px;
    cursor: pointer;
    color: #999;
    transition: color 0.3s;
}

.close:hover {
    color: #333;
    /* Changer la couleur au survol */
}

.mb-3 {
    margin-bottom: 15px;
}

.form-label {
    font-size: 16px;
    color: #555;
    font-weight: 500;
    margin-bottom: 5px;
}

.form-control {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    /* Coins arrondis des champs de saisie */
    background-color: #f9f9f9;
    /* Couleur de fond des champs */
    transition: border-color 0.3s;
}

.form-control:focus {
    border-color: #1abc9c;
    /* Couleur de la bordure au focus */
    outline: none;
}

.form-control[readonly] {
    background-color: #e9ecef;
    /* Changer la couleur de fond des champs readonly */
    cursor: not-allowed;
    /* Désactiver le curseur de texte */
}

.modal-content p {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.modal-content p strong {
    color: #1abc9c;
    /* Couleur pour les labels */
}
</style>
