<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { supabase } from './supabase';

// Listen for auth changes
onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    // You can add additional logic here if needed
    console.log('Auth event:', event);
  });
});
</script>