<template>
    <div class="update-registration">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <h2>Modifier l'Inscription</h2>

        <form @submit.prevent="updateRegistration">
            <div class="form-group">
                <label for="student_id">Sélectionner l'étudiant :</label>
                <select id="student_id" v-model="formData.student_id" required>
                    <option v-for="student in students" :key="studentId" :value="studentId">
                        {{ student.full_name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="module_id">Sélectionner le module :</label>
                <select id="module_id" v-model="formData.module_id" required>
                    <option v-for="module in modules" :key="moduleId" :value="moduleId">
                        {{ module.name }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label for="registration_date">Date d'Inscription :</label>
                <input type="date" id="registration_date" v-model="formData.registration_date" required />
            </div>
            <div class="form-group">
                <label for="start_date">Date de Début :</label>
                <input type="date" id="start_date" v-model="formData.start_date" required />
            </div>
            <div class="form-group">
                <label for="end_date">Date de Fin :</label>
                <input type="date" id="end_date" v-model="formData.end_date" required />
            </div>

            <div class="form-group">
                <label for="amount">Montant :</label>
                <input type="number" id="amount" v-model="formData.amount" required />
            </div>

            <div class="form-group">
                <button type="submit" :disabled="isLoading">Mettre à jour</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRegistrationStore } from '@/stores/inscriptionStore';
import { useApprenantStore } from '@/stores/apprenantStore';
import { useModuleStore } from '@/stores/moduleStore';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const store = useRegistrationStore();
const studentStore = useApprenantStore();
const moduleStore = useModuleStore();

const isLoading = ref(false);
const formData = ref({
    studentId: '',
    moduleId: '',
    registration_date: '',
    start_date: '',
    end_date: '',
    amount: ''
});
const students = ref([]);
const modules = ref([]);

onMounted(async () => {
    const registrationId = route.params.id;
    try {
        isLoading.value = true;

        await studentStore.loadApprenantData();
        students.value = studentStore.students;

        await moduleStore.loadModuleData();
        modules.value = moduleStore.modules;

        const registration = await store.loadRegistrationById(registrationId);
        formData.value = {
            studentId: registration.studentId,
            moduleId: registration.moduleId,
            registration_date: registration.registration_date,
            start_date: registration.start_date,
            end_date: registration.end_date,
            amount: registration.amount
        };
    } catch (error) {
        toast.error('Erreur lors du chargement des données.');
    } finally {
        isLoading.value = false;
    }
});


const updateRegistration = async () => {
    isLoading.value = true;
    const registrationId = route.params.id;
    try {
        await store.updateRegistration(registrationId, formData.value);
        toast.success('Inscription mise à jour avec succès!');
        router.push('/inscriptions');
    } catch (error) {
        toast.error('Erreur lors de la mise à jour de l\'inscription.');
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.update-registration {
    margin: 0 auto;
    max-width: 800px;
    padding: 20px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

h2 {
    font-size: 24px;
    color: #4a4a4a;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    font-size: 16px;
    color: #333;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px 20px;
    background-color: #1abc9c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #ccc;
}
</style>