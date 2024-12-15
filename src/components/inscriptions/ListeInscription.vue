<template>
    <div class="management">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <div class="top-bar">
            <h2>Liste des Inscriptions</h2>
            <router-link class="btn btn-success create" to="/inscription/ajouter">
                <i class="fas fa-plus-circle"></i> Ajouter une inscription
            </router-link>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Étudiant</th>
                    <th>Module</th>
                    <th>Date d'Inscription</th>
                    <th>Date de Début</th>
                    <th>Payer</th>
                    <th>Montant</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="registration in registrations" :key="registration.id">
                    <td>{{ registration.student_name }}</td>
                    <td>{{ registration.module_name }}</td>
                    <td>{{ formatDate(registration.registration_date) }}</td>
                    <td>{{ formatDate(registration.start_date) }}</td>
                    <td>{{ registration.paid }}</td>
                    <td>{{ registration.amount }}</td>
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
                <div v-if="selectedRegistration">
                    <div class="mb-3">
                        <label for="student_name" class="form-label">Étudiant</label>
                        <input type="text" id="student_name" v-model="selectedRegistration.student_name"
                            class="form-control" readonly />
                    </div>
                    <div class="mb-3">
                        <label for="module_name" class="form-label">Module</label>
                        <input type="text" id="module_name" v-model="selectedRegistration.module_name"
                            class="form-control" readonly />
                    </div>
                    <div class="mb-3">
                        <label for="registration_date" class="form-label">Date d'Inscription</label>
                        <input type="date" id="registration_date" v-model="selectedRegistration.registration_date"
                            class="form-control" readonly />
                    </div>
                    <div class="mb-3">
                        <label for="start_date" class="form-label">Date de Début</label>
                        <input type="date" id="start_date" v-model="selectedRegistration.start_date"
                            class="form-control" readonly />
                    </div>
                    <div class="mb-3">
                        <label for="paid" class="form-label">Payer</label>
                        <input type="number" id="paid" v-model="selectedRegistration.paid" class="form-control"
                            readonly />

                    </div>
                    <div class="mb-3">
                        <label for="amount" class="form-label">Montant</label>
                        <input type="number" id="amount" v-model="selectedRegistration.amount" class="form-control"
                            readonly />
                    </div>
                </div>
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
    isLoading.value = true;
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
        console.log('Suppression ID:', id);
        isLoading.value = true;
        try {
            await store.removeRegistration(id);
            toast.success('Inscription supprimée avec succès !');
            await store.loadRegistrations();
            registrations.value = store.inscriptions;
        } catch (error) {
            console.error("Erreur lors de la suppression de l'inscription:", error.message);
            toast.error('Une erreur est survenue lors de la suppression.');
        } finally {
            isLoading.value = false;
        }
    } else {
        console.log('Suppression annulée');
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
};
</script>

<style scoped>
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
    transition: opacity 0.3s ease-in-out;
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
    background-color: #f9f9f9;
    transition: border-color 0.3s;
}

.form-control:focus {
    border-color: #1abc9c;
    outline: none;
}

.form-control[readonly] {
    background-color: #e9ecef;
    cursor: not-allowed;
}

.modal-content p {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.modal-content p strong {
    color: #1abc9c;
}
</style>