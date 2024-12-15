<template>
    <div class="management">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <div class="top-bar">
            <h2>Liste des Paiements</h2>
            <router-link class="btn btn-success create" to="/payment/new">
                <i class="fas fa-plus-circle"></i> Ajouter un paiement
            </router-link>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Date de Paiement</th>
                    <th>Montant Payé</th>
                    <th>Montant Restant</th>
                    <th>Payeur</th>
                    <th>Numéro Télephone</th>
                    <th>Apprenant</th>
                    <th>Module</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="payment in store.payments" :key="payment.id">
                    <td>{{ formatDate(payment.payment_date) }}</td>
                    <td>{{ payment.amount }}</td>
                    <td>{{ payment.paid_amount}}</td>
                    <td>{{ payment.payer }}</td>
                    <td>{{ payment.payer_number }}</td>
                    <td>{{ payment.student_name }}</td>
                    <td>{{ payment.student_name }}</td>
                    <td class="actions">
                        <button class="action-btn" @click="showModal(payment.id)">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" @click="destroy(payment.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="isModalVisible" class="modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <span class="close" @click="closeModal">&times;</span>
                <h3>Détails du Paiement</h3>
                <p v-if="selected">
                    <strong>Apprenant :</strong> {{ selected?.student_name }}
                </p>
                <p v-if="selected">
                    <strong>Module :</strong> {{ selected?.module_name }}
                </p>
                <p v-if="selected">
                    <strong>Date de Paiement :</strong> {{ formatDate(selected.payment_date)
                    }}
                </p>
                <p v-if="selected">
                    <strong>Date d'Inscription :</strong> {{ formatDate(selected.registration_date)
                    }}
                </p>
                <p v-if="selected">
                    <strong>Payeur :</strong> {{ selected.payer }}
                </p>
                <p v-if="selected">
                    <strong>Numéro de téléphone :</strong> {{ selected.payer_number }}
                </p>
                <p v-if="selected">
                    <strong>Montant Payé :</strong> {{ selected.amount }}
                </p>
                <p v-if="selected">
                    <strong>Montant Restant :</strong> {{ selected.paid_amount }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { usePaymentStore } from '@/stores/paymentStore';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

const store = usePaymentStore();
const toast = useToast();
const isLoading = ref(false);
const isModalVisible = ref(false);
const selected = ref(null);

onMounted(async () => {
    isLoading.value = true;
    try {
        await store.loadDataFromApi();
    } finally {
        isLoading.value = false;
    }
});

const showModal = async (id) => {
    isLoading.value = false;
    isModalVisible.value = true
    try {
        selected.value = await store.getPaymentById(id);
    } catch (error) {
        toast.error(`${error}`);
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    isModalVisible.value = false;
};


const destroy = async (id) => {
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
            const resp = await store.destroy(id);
            toast.success(`${resp}`);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            isLoading.value = false;
        }
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
};
</script>

<style>
.management {
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

.create{
    color: white;
    border-radius: 5px;
    padding: 10px 15px;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.create i {
    margin-right: 8px;
}

.table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table th,
.table td {
    padding: 15px 20px;
    text-align: left;
}

.table th {
    background-color: #f9f9f9;
    color: #666;
    font-weight: bold;
}

.table td {
    border-bottom: 1px solid #e3e3e3;
    color: #333;
}

.table tbody tr:hover {
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