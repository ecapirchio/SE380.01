import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Battery from 'expo-battery';
import { Accelerometer } from 'expo-sensors';

export default function App() {
  // Battery level state
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batterySubscription, setBatterySubscription] = useState<any>(null);

  // Accelerometer state
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [accelerometerSubscription, setAccelerometerSubscription] = useState<any>(null);

  // Battery level subscription
  const _subscribeToBattery = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    setBatteryLevel(batteryLevel);

    setBatterySubscription(
      Battery.addBatteryLevelListener(({ batteryLevel }) => {
        setBatteryLevel(batteryLevel);
        console.log('Battery Level changed!', batteryLevel);
      })
    );
  };

  const _unsubscribeFromBattery = useCallback(() => {
    if (batterySubscription) {
      batterySubscription.remove();
      setBatterySubscription(null);
    }
  }, [batterySubscription]);

  // Accelerometer functions
  const _subscribeToAccelerometer = () => {
    setAccelerometerSubscription(Accelerometer.addListener(setData));
  };

  const _unsubscribeFromAccelerometer = () => {
    if (accelerometerSubscription) {
      accelerometerSubscription.remove();
      setAccelerometerSubscription(null);
    }
  };

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  // Subscribe to both battery and accelerometer once on mount
  useEffect(() => {
    _subscribeToBattery();
    _subscribeToAccelerometer();

    // Clean up subscriptions on unmount
    return () => {
      _unsubscribeFromBattery();
      _unsubscribeFromAccelerometer();
    };
  }, []); // Empty dependency array to only run on mount

  return (
    <View style={styles.container}>
      {/* Battery Level Display */}
      <Text style={styles.text}>
        Current Battery Level: {batteryLevel !== null ? (batteryLevel * 100).toFixed(0) + '%' : 'Loading...'}
      </Text>

      {/* Accelerometer Display */}
      <Text style={styles.text}>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
      <Text style={styles.text}>x: {x.toFixed(2)}</Text>
      <Text style={styles.text}>y: {y.toFixed(2)}</Text>
      <Text style={styles.text}>z: {z.toFixed(2)}</Text>

      {/* Accelerometer Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={accelerometerSubscription ? _unsubscribeFromAccelerometer : _subscribeToAccelerometer}
          style={styles.button}
        >
          <Text>{accelerometerSubscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
