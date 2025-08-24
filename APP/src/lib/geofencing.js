import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const GEOFENCE_TASK = 'paradaboa-geofence-task';

TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) return;
  const { eventType, region } = data;
  if (eventType === Location.GeofencingEventType.Enter) {
    await Notifications.scheduleNotificationAsync({
      content: { title: '🍲 Refeição perto de você', body: `Oferta em ${region.identifier}` },
      trigger: null
    });
  }
});

export async function startGeofencing(regions) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return false;
  await Location.requestBackgroundPermissionsAsync();
  await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
  return true;
}
