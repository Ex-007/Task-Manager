<!-- src/views/LoginPage.vue -->
<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button default-href="/"></ion-back-button>
          </ion-buttons>
          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="ion-padding">
        <form @submit.prevent="handleLogin" class="login-form">
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input 
              type="email" 
              v-model="email" 
              required
              autocomplete="email"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input 
              type="password" 
              v-model="password" 
              required
              autocomplete="current-password"
            ></ion-input>
          </ion-item>
          
          <ion-button 
            type="submit" 
            expand="block" 
            class="ion-margin-top" 
            :disabled="loading"
          >
            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
            <span v-else>Login</span>
          </ion-button>
          
          <p class="ion-text-center ion-margin-top">
            Don't have an account? 
            <router-link to="/register">Register</router-link>
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
    IonText
  } from '@ionic/vue';
  import { supabase } from '../supabase';
  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const errorMessage = ref('');
  const { showError, showSuccess } = useToast();
  
  const handleLogin = async () => {
  try {
    loading.value = true;
    
    const { user, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });
    
    if (error) throw error;
    
    showSuccess('Login successful');
    await router.push('/tasks');
  } catch (error) {
    showError(error.message || 'Failed to login');
  } finally {
    loading.value = false;
  }
};
  </script>
  
  <style scoped>
  .login-form {
    max-width: 500px;
    margin: 0 auto;
    padding-top: 2rem;
  }
  a{
    text-decoration: none;
  }
  </style>