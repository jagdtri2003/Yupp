import { Audio } from "expo-av";

// Map your sounds to the sound files
const soundMap = {
  success: require('../assets/audio/sucess.wav'),
  posted: require('../assets/audio/posted.wav'),
};

// Function to play sound with ducking enabled
async function playSound({ name }) {
  const soundObject = soundMap[name];

  if (!soundObject) {
    console.warn(`Sound with name "${name}" not found.`);
    return;
  }

  // Load and play the sound
  const { sound } = await Audio.Sound.createAsync(soundObject);
  await sound.setVolumeAsync(0.7);
  await sound.playAsync();

  // Unload the sound after playing
  setTimeout(() => sound.unloadAsync(), 1500);

}

export default playSound;
