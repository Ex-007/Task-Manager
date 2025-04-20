// src/composables/useAuth.js
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';

export function useAuth() {
  const user = ref(null);
  const loading = ref(true);
  
  const initialize = async () => {
    loading.value = true;
    user.value = supabase.auth.user();
    loading.value = false;
    
    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user || null;
    });
  };
  
  onMounted(() => {
    initialize();
  });
  
  return {
    user,
    loading,
    isLoggedIn: () => !!user.value
  };
}