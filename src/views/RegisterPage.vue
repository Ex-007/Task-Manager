<!-- src/views/RegisterPage.vue -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Create Account</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <form @submit.prevent="handleRegister" class="register-form">
        <ion-item class="input-item">
          <ion-label position="floating">Email</ion-label>
          <ion-input 
            type="email" 
            v-model="email" 
            required
            autocomplete="email"
            class="custom-input"
          ></ion-input>
        </ion-item>

        <ion-item class="input-item">
          <ion-label position="floating">Enter Name:</ion-label>
          <ion-input 
            type="text" 
            v-model="name" 
            required
            autocomplete="name"
            class="custom-input"
          ></ion-input>
        </ion-item>
        
        <ion-item class="input-item">
          <ion-label position="floating">Password</ion-label>
          <ion-input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            required
            autocomplete="new-password"
            class="custom-input"
          ></ion-input>
          <ion-button 
            fill="clear" 
            slot="end" 
            @click="togglePasswordVisibility('password')"
            class="password-toggle"
          >
            <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline"></ion-icon>
          </ion-button>
        </ion-item>
        
        <ion-item class="input-item">
          <ion-label position="floating">Confirm Password</ion-label>
          <ion-input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="confirmPassword" 
            required
            autocomplete="new-password"
            class="custom-input"
          ></ion-input>
          <ion-button 
            fill="clear" 
            slot="end" 
            @click="togglePasswordVisibility('confirm')"
            class="password-toggle"
          >
            <ion-icon :icon="showConfirmPassword ? eyeOffOutline : eyeOutline"></ion-icon>
          </ion-button>
        </ion-item>
        
        <ion-text color="danger" v-if="password !== confirmPassword && confirmPassword.length > 0">
          <p class="password-mismatch">Passwords do not match</p>
        </ion-text>
        
        <ion-button 
          type="submit" 
          expand="block" 
          class="ion-margin-top" 
          :disabled="loading || password !== confirmPassword || !password.length"
        >
          <ion-spinner v-if="loading" name="crescent"></ion-spinner>
          <span v-else>Create Account</span>
        </ion-button>
        
        <p class="ion-text-center ion-margin-top">
          Already have an account? 
          <router-link to="/login">Login</router-link>
        </p>
        
        <ion-text color="danger" v-if="errorMessage">
          <p class="ion-text-center">{{ errorMessage }}</p>
        </ion-text>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonText,
  IonIcon
} from '@ionic/vue';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { supabase } from '../supabase';

const router = useRouter();
const email = ref('');
const password = ref('');
const name = ref('')
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const { showError, showSuccess } = useToast();

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else if (field === 'confirm') {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    showError(errorMessage.value);
    return;
  }
  
  try {
    loading.value = true;
    errorMessage.value = '';
    
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value
        },
        emailRedirectTo: null 
      }
    });
    
    if (error) throw error;
    
    showSuccess('Account created successfully');
    router.push('/tasks');
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create account';
    showError(errorMessage.value);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 2rem;
}

a {
  text-decoration: none;
}

.input-item {
  margin-bottom: 16px;
}

.custom-input {
  --padding-top: 12px;
  --padding-bottom: 12px;
  margin-top: 8px;
}

.password-toggle {
  margin: 0;
  height: 100%;
  --padding-end: 8px;
  --padding-start: 8px;
}

.password-mismatch {
  margin: 0;
  padding-left: 16px;
  font-size: 0.8rem;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}
</style>