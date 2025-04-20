<!-- src/views/SettingsPage.vue -->
<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button default-href="/tasks"></ion-back-button>
          </ion-buttons>
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content>
        <ion-list>
          <ion-item-divider>
            <ion-label>Appearance</ion-label>
          </ion-item-divider>
          
          <dark-mode-toggle></dark-mode-toggle>
          
          <ion-item-divider>
            <ion-label>Notifications</ion-label>
          </ion-item-divider>
          
          <ion-item>
            <ion-label>Task Reminders</ion-label>
            <ion-toggle v-model="enableReminders" @ionChange="saveReminderSetting"></ion-toggle>
          </ion-item>
          
          <ion-item-divider>
            <ion-label>Account</ion-label>
          </ion-item-divider>
          
          <ion-item>
            <ion-label>Email</ion-label>
            <ion-note slot="end">{{ user?.email }}</ion-note>
          </ion-item>
          
          <ion-button expand="block" color="danger" class="ion-margin" @click="confirmLogout">
            Logout
          </ion-button>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonList,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonToggle,
    IonNote,
    IonButton,
    IonButtons,
    IonBackButton,
    alertController
  } from '@ionic/vue';
  import { supabase } from '../supabase';
  import { useToast } from '../composables/useToast';
  import DarkModeToggle from '../components/DarkModeToggle.vue';
  
  const router = useRouter();
  const { showSuccess } = useToast();
  const user = ref(supabase.auth.user());
  const enableReminders = ref(true);
  
  const saveReminderSetting = () => {
    localStorage.setItem('enableReminders', enableReminders.value.toString());
  };
  
  const confirmLogout = async () => {
    const alert = await alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: async () => {
            await supabase.auth.signOut();
            showSuccess('Logged out successfully');
            router.push('/');
          }
        }
      ]
    });
    
    await alert.present();
  };
  
  onMounted(() => {
    // Load saved reminder setting
    const savedSetting = localStorage.getItem('enableReminders');
    if (savedSetting !== null) {
      enableReminders.value = savedSetting === 'true';
    }
  });
  </script>