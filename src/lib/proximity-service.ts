import { useAppStore } from './store';
import { toast } from 'sonner';

/**
 * Proximity Alert Engine (Phase 7)
 * Monitors real-time distances of Favorite profiles and triggers alerts.
 */
export const useProximityEngine = () => {
  const { conversations, savedProfiles, settings } = useAppStore();

  const checkProximity = () => {
    savedProfiles.forEach(profileId => {
      const convo = conversations.find(c => c.id === profileId);
      if (!convo || !convo.distance) return;

      // Parse distance (e.g. "350 ft" or "1.2 mi")
      const isFeet = convo.distance.includes('ft');
      const value = parseFloat(convo.distance);
      const distanceInFeet = isFeet ? value : value * 5280;

      if (distanceInFeet <= settings.proximityAlertRadius) {
        // Trigger Proximity Sound (mock)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3');
        audio.play().catch(() => {});

        toast.info(`Proximity Alert: ${convo.userName}`, {
          description: `Target within ${convo.distance}. Transmission range established.`,
          duration: 6000,
        });
      }
    });
  };

  return { checkProximity };
};
