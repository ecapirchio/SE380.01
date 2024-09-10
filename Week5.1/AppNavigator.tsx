import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BarcodeScannerScreen from './screens/BarcodeScannerScreen.js'; // Import the barcode scanner screen
import { NavigationContainer } from '@react-navigation/native';

// Define the types for your navigators
export type RootStackParamList = {
  'Barcode Scanner': undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function HomeworkStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Barcode Scanner" component={BarcodeScannerScreen} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

function AppNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      {/* Other screens */}
      <Drawer.Screen name="Homework" component={HomeworkStackNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppContainer() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
