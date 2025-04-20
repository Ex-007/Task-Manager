import { toastController } from '@ionic/vue';

export function useToast() {
  const showToast = async (message, color = 'primary', duration = 2000) => {
    const toast = await toastController.create({
      message,
      color,
      duration,
      position: 'bottom'
    });

    await toast.present();
  };

  return {
    showToast,
    showSuccess: (message) => showToast(message, 'success'),
    showError: (message) => showToast(message, 'danger', 3000)
  };
}