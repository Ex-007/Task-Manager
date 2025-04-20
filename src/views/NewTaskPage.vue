<!-- src/views/NewTaskPage.vue -->
<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button default-href="/tasks"></ion-back-button>
          </ion-buttons>
          <ion-title>New Task</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content class="ion-padding">
      <form @submit.prevent="validateAndSave" class="task-form">
        <ion-item :class="{ 'ion-invalid': errors.title }">
          <ion-label position="floating">Title</ion-label>
          <ion-input v-model="task.title" @ionBlur="validateTitle"></ion-input>
          <ion-note slot="error" v-if="errors.title">{{ errors.title }}</ion-note>
        </ion-item>

        <ion-item>
        <ion-label>Set Reminder</ion-label>
        <ion-toggle v-model="setReminder"></ion-toggle>
      </ion-item>
        
        <ion-item>
          <ion-label position="floating">Description</ion-label>
          <ion-textarea v-model="task.description" rows="4"></ion-textarea>
        </ion-item>
        
        <ion-item>
          <ion-label>Due Date</ion-label>
          <ion-datetime v-model="task.due_date" display-format="MMM DD, YYYY"></ion-datetime>
        </ion-item>
        
        <ion-item>
          <ion-label>Priority</ion-label>
          <ion-select v-model="task.priority">
            <ion-select-option value="low">Low</ion-select-option>
            <ion-select-option value="medium">Medium</ion-select-option>
            <ion-select-option value="high">High</ion-select-option>
          </ion-select>
        </ion-item>
        
        <ion-button 
          type="submit" 
          expand="block" 
          class="ion-margin-top" 
          :disabled="loading"
        >
          <ion-spinner v-if="loading" name="crescent"></ion-spinner>
          <span v-else>Save Task</span>
        </ion-button>
      </form>
    </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
import { NotificationService } from '../services/notificationService';
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
    IonTextarea,
    IonDatetime,
    IonButton,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonSelect,
  IonSelectOption,
  IonNote,
  IonToggle
  } from '@ionic/vue';
  import { supabase } from '../supabase';
  import { useToast } from '../composables/useToast';
  
  const router = useRouter();
  const loading = ref(false);
  const { showSuccess, showError } = useToast();
  const setReminder = ref(true);
const errors = ref({
  title: ''
});
  const task = ref({
    title: '',
    description: '',
    due_date: null,
    status: 'pending',
    priority: 'medium'
  });

  const validateTitle = () => {
  if (!task.value.title.trim()) {
    errors.value.title = 'Title is required';
    return false;
  }
  errors.value.title = '';
  return true;
};

const validateAndSave = () => {
  const isValid = validateTitle();
  if (isValid) {
    saveTask();
  }
};
  
const saveTask = async () => {
  try {
    loading.value = true;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task.value,
        user_id: user.id
      })
      .select()
      
    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('Task was created but no data was returned');
    } else {
      // Now schedule reminder if needed
      if (setReminder.value && task.value.due_date) {
        const hasPermission = await NotificationService.requestPermissions();
        if (hasPermission) {
          await NotificationService.scheduleTaskReminder({
            id: data[0].id,
            title: task.value.title,
            due_date: task.value.due_date
          });
        }
      }
    }
    
    showSuccess('Task created successfully');
    // router.push('/tasks');
    router.push({ 
      path: '/tasks',
      query: { refresh: Date.now() }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    showError('Failed to create task');
  } finally {
    loading.value = false;
  }
};
  </script>
  
  <style scoped>
  .task-form {
    max-width: 500px;
    margin: 0 auto;
  }
  </style>