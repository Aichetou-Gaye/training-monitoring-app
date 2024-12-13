<template>
    <div class="form-container d-flex align-items-center">
        <div class="form-content">
            <div class="">
                <router-link to="/apprenants" class="btn btn-secondary mb-3">
                    <i class="fas fa-arrow-left"></i>
                </router-link>
            </div>
            <form @submit.prevent="updateApprenant" class="p-4 shadow-sm rounded">
                <h2 class="text-center mb-4">Modifier un apprenant</h2>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="nom" class="form-label">Nom</label>
                        <input type="text" v-model="nom" class="form-control" placeholder="Entrez le nom" required />
                        <small v-if="errors.nom" class="text-danger">{{ errors.nom }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="prenom" class="form-label">Prénom</label>
                        <input type="text" v-model="prenom" class="form-control" placeholder="Entrez le prénom"
                            required />
                        <small v-if="errors.prenom" class="text-danger">{{ errors.prenom }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" v-model="email" class="form-control" placeholder="Entrez l'email"
                            required />
                        <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="telephone" class="form-label">Téléphone</label>
                        <input type="text" v-model="telephone" class="form-control"
                            placeholder="Entrez le numéro de téléphone" required />
                        <small v-if="errors.telephone" class="text-danger">{{ errors.telephone }}</small>
                    </div>
                </div>

                <div class="row">

                    <div class="col-md-6 mb-3">
                        <label for="adresse" class="form-label">Adresse</label>
                        <input type="text" v-model="adresse" class="form-control" placeholder="Entrez l'adresse"
                            required />
                        <small v-if="errors.adresse" class="text-danger">{{ errors.adresse }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="tuteur" class="form-label">Tuteur/Tutrice</label>
                        <input type="text" v-model="tuteur" class="form-control" placeholder="Entrez le tuteur"
                            required />
                        <small v-if="errors.tuteur" class="text-danger">{{ errors.tuteur }}</small>
                    </div>
                </div>

                <button type="submit" class="btn w-100 py-2">Modifier l'apprenant</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApprenantStore } from '@/stores/useApprenantStore';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from "vue-router";

const toast = useToast();
const router = useRouter();
const route = useRoute();


const nom = ref('');
const prenom = ref('');
const email = ref('');
const telephone = ref('');
const adresse = ref('');
const tuteur = ref('');
const errors = ref({});


const apprenantStore = useApprenantStore();


onMounted(() => {
    const apprenantId = route.params.id;
    apprenantStore.loadApprenantById(apprenantId).then(() => {
        nom.value = apprenantStore.apprenant.nom;
        prenom.value = apprenantStore.apprenant.prenom;
        email.value = apprenantStore.apprenant.email;
        telephone.value = apprenantStore.apprenant.telephone;
        adresse.value = apprenantStore.apprenant.addresse;
        tuteur.value = apprenantStore.apprenant.tuteur;
    }).catch((error) => {
        toast.error("Erreur lors du chargement de l'apprenant.");
        console.error("Erreur :", error.message);
    });
});

const updateApprenant = async () => {
    errors.value = {};
    try {
        await apprenantStore.updateApprenant(apprenantId, {
            nom: nom.value,
            prenom: prenom.value,
            email: email.value,
            telephone: telephone.value,
            adresse: adresse.value,
            tuteur: tuteur.value
        });
        toast.success('Apprenant modifié avec succès !');
        router.push("/apprenants");
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            error.response.data.errors.forEach(err => {
                errors.value[err.path] = err.msg;
            });
        } else {
            toast.error('Une erreur est survenue lors de la modification.');
        }
    }
};
</script>

<style scoped>
.form-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-content {
    flex: 1;
    background-color: #f9f9f9;
}

.form-control {
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid #ced4da;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: none;
}

.btn {
    background-color: #1abc9c;
    color: white;
    font-size: 16px;
    font-weight: 600;
}

.btn:hover {
    background-color: #1abc9c;
}

h2 {
    color: #343a40;
    font-weight: bold;
}

.shadow-sm {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bg-white {
    background-color: white;
}

.rounded {
    border-radius: 8px;
}
</style>
