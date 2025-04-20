<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Task Details</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="deleteTask" color="danger">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="loading" class="spinner-container">
        <ion-spinner></ion-spinner>
      </div>

      <div v-else-if="task">
        <form @submit.prevent="saveTask" class="task-form">
          <ion-item>
            <ion-label position="floating">Title</ion-label>
            <ion-input v-model="task.title" required></ion-input>
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
            <ion-label>Status</ion-label>
            <ion-select v-model="task.status">
              <ion-select-option value="pending">Pending</ion-select-option>
              <ion-select-option value="in_progress">In Progress</ion-select-option>
              <ion-select-option value="completed">Completed</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-button expand="block" type="submit" class="ion-margin-top">
            Save Task
          </ion-button>
        </form>
      </div>

      <div v-else>
        <p>Task not found.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { alertController, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonSelect, IonSelectOption, IonButton, IonIcon, IonSpinner } from '@ionic/vue';
import { supabase } from '../supabase';
import { trashOutline } from 'ionicons/icons';
import { useToast } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const { showSuccess, showError } = useToast();

const taskId = route.params.id;
const task = ref(null);
const loading = ref(true);

// Fetch task by ID
const fetchTask = async () => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error || !data) throw error;
    task.value = data;
  } catch (error) {
    console.error('Error fetching task:', error);
    showError('Failed to fetch task');
  } finally {
    loading.value = false;
  }
};

const saveTask = async () => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update(task.value)
      .eq('id', taskId);

    if (error) throw error;

    showSuccess('Task updated successfully');
    router.push('/tasks');
  } catch (error) {
    console.error('Error saving task:', error);
    showError('Failed to update task');
  }
};

const deleteTask = async () => {
  const alert = await alertController.create({
    header: 'Confirm Delete',
    message: 'Are you sure you want to delete this task?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: async () => {
          try {
            const { error } = await supabase
              .from('tasks')
              .delete()
              .eq('id', taskId);

            if (error) throw error;

            showSuccess('Task deleted');
            await fetchTask()
            router.push('/tasks');
          } catch (error) {
            console.error('Error deleting task:', error);
            showError('Failed to delete task');
          }
        },
      },
    ],
  });

  await alert.present();
};

onMounted(() => {
  fetchTask();
});
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
