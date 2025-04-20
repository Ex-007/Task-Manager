<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>My Tasks</ion-title>
        <ion-note slot="end" class="ion-padding-end">{{ userName }}</ion-note>
        <ion-buttons slot="end">
          <ion-button @click="router.push('/settings')">
            <ion-icon :icon="settingsOutline"></ion-icon>
          </ion-button>
          <ion-button @click="logout">
            <ion-icon :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          placeholder="Search tasks"
          v-model="searchQuery"
        ></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="activeFilter">
          <ion-segment-button value="all">All</ion-segment-button>
          <ion-segment-button value="pending">Pending</ion-segment-button>
          <ion-segment-button value="completed">Completed</ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
    
      <ion-list v-if="!loading && filteredTasks.length > 0">
        <task-item
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @update-status="updateTaskStatus"
          @delete="confirmDelete"
          @view="viewTask"
          @edit="viewTask"
        ></task-item>
      </ion-list>
      
      <div class="empty-state" v-else-if="!loading && filteredTasks.length === 0">
        <ion-icon :icon="listOutline" size="large"></ion-icon>
        <h2>No tasks found</h2>
        <p v-if="tasks.length === 0">Create your first task to get started</p>
        <p v-else>Try adjusting your search or filter</p>
      </div>
      
      <ion-spinner v-if="loading" class="spinner"></ion-spinner>
      
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="router.push('/tasks/new')">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonSearchbar,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  alertController
} from '@ionic/vue';
import { 
  addOutline, 
  listOutline,
  logOutOutline
} from 'ionicons/icons';

import { supabase } from '../supabase';
import { useToast } from '../composables/useToast';
import TaskItem from '../components/TaskItem.vue';

const router = useRouter();
const route = useRoute()
const tasks = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const activeFilter = ref('all');
const { showSuccess, showError } = useToast();
const signedUser = ref('')
const userName = ref('')

const filteredTasks = computed(() => {
  let result = tasks.value;
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.description && task.description.toLowerCase().includes(query))
    );
  }
  
  // Apply status filter
  if (activeFilter.value !== 'all') {
    result = result.filter(task => 
      activeFilter.value === 'completed' 
        ? task.status === 'completed' 
        : task.status !== 'completed'
    );
  }
  
  return result;
});

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.refresh) {
      fetchTasks(signedUser.value);
    }
  }
);

// FETCH CURRENT USER ID
const userDet = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    signedUser.value = data.user.id;
    userName.value = data.user.user_metadata.name;
    // console.log(data.user.user_metadata.name)
    return data.user.id;
  } catch (err) {
    showError('Failed to load user data');
    return null;
  }
};


const fetchTasks = async (userId) => {
  try {

    if (!userId) {
      console.error("No user ID provided for fetching tasks");
      return;
    }

    loading.value = true;
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    tasks.value = data || [];
    // console.log(`Fetched ${tasks.value.length} tasks for user ${userId}`);
  } catch (error) {
    console.log(error)
    showError('Failed to load tasks');
  } finally {
    loading.value = false;
  }
};

const updateTaskStatus = async (task) => {
  try {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id);
      
    if (error) throw error;
    
    // Update local task
    // task.status = newStatus;
    // showSuccess(`Task marked as ${newStatus}`);
    await fetchTasks(signedUser.value);
    showSuccess(`Task marked as ${newStatus}`);
  } catch (error) {
    console.error('Error updating task:', error);
    showError('Failed to update task');
  }
};

const confirmDelete = async (taskId) => {
  const alert = await alertController.create({
    header: 'Confirm Delete',
    message: 'Are you sure you want to delete this task?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => deleteTask(taskId)
      }
    ]
  });
  
  await alert.present();
};

const deleteTask = async (taskId) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) throw error;
    
    // tasks.value = tasks.value.filter(task => task.id !== taskId);
    await fetchTasks(signedUser.value);
    showSuccess('Task deleted');
  } catch (error) {
    console.error('Error deleting task:', error);
    showError('Failed to delete task');
  }
};

const viewTask = (task) => {
  router.push(`/tasks/${task.id}`);
};

const refresh = async (event) => {
  await fetchTasks();
  event.target.complete();
};

const logout = async () => {
  await supabase.auth.signOut();
  router.push('/');
  showSuccess('Logged out successfully');
};

// Watch for filter changes
watch(activeFilter, () => {
  // You could add analytics tracking here
});

onMounted(async () => {
  loading.value = true;
  try {
    const userId = await userDet();
    if (userId) {
      await fetchTasks(userId);
    } else {
      loading.value = false;
    }
  } catch (error) {
    console.error('Error in onMounted:', error);
    loading.value = false;
  }
});
</script>
  
  <style scoped>
  .completed-task {
    text-decoration: line-through;
    color: var(--ion-color-medium);
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--ion-color-medium);
    text-align: center;
    padding: 2rem;
  }
  
  .empty-state ion-icon {
    font-size: 64px;
    margin-bottom: 1rem;
  }
  
  .spinner {
    display: block;
    margin: 2rem auto;
  }
  .ion-padding-end{
    color: white;
  }
  </style>