<!-- src/components/DarkModeToggle.vue -->
<template>
    <ion-item lines="none">
      <ion-icon :icon="sunnyOutline" slot="start" v-if="!isDarkMode"></ion-icon>
      <ion-icon :icon="moonOutline" slot="start" v-else></ion-icon>
      <ion-label>Dark Mode</ion-label>
      <ion-toggle slot="end" v-model="isDarkMode" @ionChange="toggleDarkMode"></ion-toggle>
    </ion-item>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { IonItem, IonLabel, IonToggle, IonIcon } from '@ionic/vue';
  import { moonOutline, sunnyOutline } from 'ionicons/icons';
  
  const isDarkMode = ref(false);
  
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark', isDarkMode.value);
    localStorage.setItem('darkMode', isDarkMode.value ? 'dark' : 'light');
  };
  
  onMounted(() => {
    // Check if user has a preference saved
    const savedMode = localStorage.getItem('darkMode');
    
    // Check if user prefers dark mode at system level
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set based on saved preference or system preference
    isDarkMode.value = savedMode ? savedMode === 'dark' : prefersDark;
    
    // Apply immediately
    document.body.classList.toggle('dark', isDarkMode.value);
  });
  </script>