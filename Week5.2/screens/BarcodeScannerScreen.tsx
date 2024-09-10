import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { BarCodeScanner, BarCodeEvent } from 'expo-barcode-scanner';

const BarcodeScannerScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    setScanned(true);

    // Verify that the scanned code is a QR code
    if (type === BarCodeScanner.Constants.BarCodeType.qr) {
      Alert.alert('Scanned URL', data);
    } else {
      Alert.alert('Error', 'Please scan a valid QR code.');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ width: '100%', height: '100%' }}
      />
      {scanned && <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />}
    </View>
  );
};

export default BarcodeScannerScreen;
