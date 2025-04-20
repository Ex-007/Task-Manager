<!-- src/views/LandingPage.vue -->
<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>TaskMaster by ABTech</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="ion-padding">
        <div class="welcome-container">
          <h1 class="app-title">TaskMaster</h1>
          <p class="app-subtitle">Organize your life, one task at a time</p>
          
          <div class="feature-list">
            <div class="feature-item">
              <ion-icon :icon="checkmarkCircleOutline" class="feature-icon"></ion-icon>
              <p>Easily manage your daily tasks</p>
            </div>
            <div class="feature-item">
              <ion-icon :icon="timeOutline" class="feature-icon"></ion-icon>
              <p>Set due dates and never miss a deadline</p>
            </div>
            <div class="feature-item">
              <ion-icon :icon="cloudOutline" class="feature-icon"></ion-icon>
              <p>Sync across all your devices</p>
            </div>
          </div>
          
          <div class="auth-buttons">
            <ion-button expand="block" color="primary" router-link="/login">
              Login
            </ion-button>
            <ion-button expand="block" fill="outline" router-link="/register">
              Create Account
            </ion-button>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton,
    IonIcon 
  } from '@ionic/vue';
  import { 
    checkmarkCircleOutline, 
    timeOutline, 
    cloudOutline 
  } from 'ionicons/icons';
  </script>
  
  <style scoped>
  .welcome-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .app-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: var(--ion-color-primary);
  }
  
  .app-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: var(--ion-color-medium);
  }
  
  .feature-list {
    margin: 2rem 0;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .feature-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    color: var(--ion-color-primary);
  }
  
  .auth-buttons {
    margin-top: 2rem;
  }
  
  .auth-buttons ion-button {
    margin-bottom: 1rem;
  }
  </style>