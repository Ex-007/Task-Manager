<!-- src/components/TaskItem.vue -->
<template>
    <ion-item-sliding>
      <ion-item @click="$emit('view', task)">
        <ion-checkbox 
          slot="start" 
          :checked="task.status === 'completed'" 
          @ionChange="updateStatus"
        ></ion-checkbox>
        <ion-label>
          <h2 :class="{ 'completed-task': task.status === 'completed' }">{{ task.title }}</h2>
          <p v-if="task.description">{{ shortDescription }}</p>
          <p v-if="task.due_date" class="due-date" :class="{ overdue: isOverdue }">
            Due: {{ formatDate(task.due_date) }}
            <ion-badge v-if="isOverdue" color="danger">Overdue</ion-badge>
          </p>
        </ion-label>
      </ion-item>
      
      <ion-item-options side="end">
        <ion-item-option color="primary" @click="$emit('edit', task)">
          <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
        </ion-item-option>
        <ion-item-option color="danger" @click="$emit('delete', task.id)">
          <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { 
    IonItemSliding, 
    IonItem, 
    IonItemOptions, 
    IonItemOption, 
    IonLabel, 
    IonCheckbox,
    IonIcon,
    IonBadge
  } from '@ionic/vue';
  import { trashOutline, createOutline } from 'ionicons/icons';
  
  const props = defineProps({
    task: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['update-status', 'delete', 'edit', 'view']);
  
  const updateStatus = () => {
    emit('update-status', props.task);
  };
  
  const shortDescription = computed(() => {
    if (!props.task.description) return '';
    return props.task.description.length > 60 
      ? props.task.description.slice(0, 60) + '...' 
      : props.task.description;
  });
  
  const isOverdue = computed(() => {
    if (!props.task.due_date) return false;
    const dueDate = new Date(props.task.due_date);
    const today = new Date();
    return dueDate < today && props.task.status !== 'completed';
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  </script>
  
  <style scoped>
  .completed-task {
    text-decoration: line-through;
    color: var(--ion-color-medium);
  }
  
  .due-date {
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .overdue {
    color: var(--ion-color-danger);
  }
  </style>