<template>
    <div class="registration-management">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <div class="top-bar">
            <h2>Liste des Inscriptions</h2>
            <router-link class="btn btn-success create-registration" to="/inscription/ajouter">
                <i class="fas fa-plus-circle"></i> Ajouter une inscription
            </router-link>
        </div>

        <table class="registration-table">
            <thead>
                <tr>
                    <th>Étudiant</th>
                    <th>Module</th>
                    <th>Date d'Inscription</th>
                    <th>Date de Début</th>
                    <th>Date de Fin</th>
                    <th>Montant</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(registration, index) in registrations" :key="registration.id">
                    <td>{{ registration.student_name }}</td>
                    <td>{{ registration.module_name }}</td>
                    <td>{{ formatDate(registration.registration_date) }}</td>
                    <td>{{ formatDate(registration.start_date) }}</td>
                    <td>{{ formatDate(registration.end_date) }}</td>
                    <td>{{ registration.total_amount }}</td>
                    <td class="actions">
                        <button class="action-btn" @click="viewRegistrationDetails(registration.id)">
                            <i class="fas fa-eye"></i>
                        </button>

                        <router-link :to="`/inscription/modifier/${registration.id}`" class="action-btn">
                            <i class="fas fa-edit"></i>
                        </router-link>
                        <button class="action-btn" @click="confirmRemoveRegistration(registration.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="isModalVisible" class="modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <span class="close" @click="closeModal">&times;</span>
                <h3>Détails de l'Inscription</h3>
                <p v-if="selectedRegistration">
                    <strong>Étudiant :</strong> {{ selectedRegistration.student?.student_name }}
                </p>
                <p v-if="selectedRegistration">
                    <strong>Module :</strong> {{ selectedRegistration.module?.module_name }}
                </p>
                <p v-if="selectedRegistration">
                    <strong>Date d'Inscription :</strong> {{ formatDate(selectedRegistration.registration_date)
                    }}
                </p>
                <p v-if="selectedRegistration">
                    <strong>Date de Début :</strong> {{ formatDate(selectedRegistration.start_date) }}
                </p>
                <p v-if="selectedRegistration">
                    <strong>Date de Fin :</strong> {{ formatDate(selectedRegistration.end_date) }}
                </p>
                <p v-if="selectedRegistration">
                    <strong>Montant :</strong> {{ selectedRegistration.total_amount }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useRegistrationStore } from '@/stores/inscriptionStore';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

const store = useRegistrationStore();
const toast = useToast();
const registrations = ref([]);
const isLoading = ref(false);
const isModalVisible = ref(false);
const selectedRegistration = ref(null);

onMounted(async () => {
    isLoading.value = true;
    try {
        await store.loadRegistrations();
        registrations.value = store.inscriptions;

    } catch (error) {
        console.error("Erreur lors du chargement des inscriptions:", error);
        toast.error("Une erreur est survenue lors du chargement des inscriptions.");
    } finally {
        isLoading.value = false;
    }
});

const viewRegistrationDetails = async (id) => {
    isLoading.value = false;
    try {
        selectedRegistration.value = await store.loadRegistrationById(id);
        isModalVisible.value = true;
    } catch (error) {
        console.error("Erreur lors du chargement des détails de l'inscription :", error);
        toast.error("Une erreur est survenue lors du chargement des détails de l'inscription.");
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    isModalVisible.value = false;

};


const confirmRemoveRegistration = async (id) => {
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
            await registrationStore.removeRegistration(id);
            toast.success('Inscription supprimée avec succès !');
            await registrationStore.loadRegistrations();
            registrations.value = registrationStore.registrations;
        } catch (error) {
            console.error("Erreur lors de la suppression de l'inscription:", error.message);
            toast.error('Une erreur est survenue lors de la suppression.');
        } finally {
            isLoading.value = false;
        }
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
};
</script>

<style scoped>
.registration-management {
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

.create-registration {
    color: white;
    border-radius: 5px;
    padding: 10px 15px;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.create-registration i {
    margin-right: 8px;
}

.registration-table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.registration-table th,
.registration-table td {
    padding: 15px 20px;
    text-align: left;
}

.registration-table th {
    background-color: #f9f9f9;
    color: #666;
    font-weight: bold;
}

.registration-table td {
    border-bottom: 1px solid #e3e3e3;
    color: #333;
}

.registration-table tbody tr:hover {
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

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
    color: #999;
}

.close:hover {
    color: #333;
}
</style>