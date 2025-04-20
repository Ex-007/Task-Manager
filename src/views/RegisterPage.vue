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
              autocomplete="new-password"
            ></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="floating">Confirm Password</ion-label>
            <ion-input 
              type="password" 
              v-model="confirmPassword" 
              required
              autocomplete="new-password"
            ></ion-input>
          </ion-item>
          
          <ion-button 
            type="submit" 
            expand="block" 
            class="ion-margin-top" 
            :disabled="loading || password !== confirmPassword"
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
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
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
  const confirmPassword = ref('');
  const loading = ref(false);
  const errorMessage = ref('');
  
  const handleRegister = async () => {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    
    try {
      loading.value = true;
      errorMessage.value = '';
      
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      });
      
      if (error) throw error;
      
      // Navigate to tasks page on successful registration
      router.push('/tasks');
    } catch (error) {
      errorMessage.value = error.message || 'Failed to create account';
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
  a{
    text-decoration: none;
  }
  </style>