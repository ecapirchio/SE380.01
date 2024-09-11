import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Battery from 'expo-battery';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null); // Real battery level
  const [fakeBatteryLevel, setFakeBatteryLevel] = useState<number>(0); // Fake battery level for "charging"
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchBatteryLevel = async () => {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level);
      setFakeBatteryLevel(level * 100); // Convert to percentage for the progress bar
    };
    fetchBatteryLevel();
    _subscribe();

    return () => _unsubscribe();
  }, []);

  const handleShake = () => {
    const totalForce = Math.sqrt(
      accelerometerData.x * accelerometerData.x +
      accelerometerData.y * accelerometerData.y +
      accelerometerData.z * accelerometerData.z
    );

    // Adjust the threshold if necessary to make shake detection easier
    if (totalForce > 1.0) { // You can adjust this value (e.g., 1.5-2) to make it more sensitive
      console.log('Shake detected!', totalForce);
      setFakeBatteryLevel((prevLevel) => Math.min(prevLevel + 5, 100));
    }
  };

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(200); // Update every 200ms
    setSubscription(
      Accelerometer.addListener((data) => {
        setAccelerometerData(data);
        handleShake(); // Check for shake on every update
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const batteryColor = () => {
    if (fakeBatteryLevel < 20) return 'red';
    if (fakeBatteryLevel < 50) return 'yellow';
    return 'green';
  };

  return (
    <View style={styles.container}>
      {/* Display the fake battery level percentage */}
      <Text style={styles.batteryText}>Battery Level: {fakeBatteryLevel.toFixed(0)}%</Text>

      {/* Display message when fully charged */}
      {fakeBatteryLevel === 100 && <Text style={styles.fullChargedText}>Device fully charged!</Text>}

      {/* Custom Battery Progress Bar */}
      <View style={styles.batteryContainer}>
        <View style={[styles.batteryProgress, { width: `${fakeBatteryLevel}%`, backgroundColor: batteryColor() }]} />
      </View>

      {/* Debugging: display accelerometer data */}
      <Text style={styles.debugText}>
        Accelerometer Data - x: {accelerometerData.x.toFixed(2)}, y: {accelerometerData.y.toFixed(2)}, z: {accelerometerData.z.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  batteryText: {
    fontSize: 20,
    marginBottom: 20,
  },
  fullChargedText: {
    fontSize: 18,
    color: 'green',
    marginBottom: 20,
  },
  batteryContainer: {
    width: '80%',
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  batteryProgress: {
    height: '100%',
  },
  debugText: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
});
