import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import GalleryScreen from '../screens/GalleryScreen';
import PhotoDetailScreen from '../screens/PhotoDetailScreen';
import PhotoModalScreen from '../screens/PhotoModalScreen';
import WeatherAppScreen from '../screens/WeatherAppScreen';
import { RootStackParamList } from '../types/navigationTypes';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const HiddenDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right', // Drawer opens from the right
        swipeEnabled: true, // Allow swipe gesture
        headerShown: false, // No visible header
        drawerStyle: { width: 250 }, // Customize drawer size
      }}
      drawerContentOptions={{
        activeTintColor: '#000', // Style the active drawer item
      }}
    >
      <Drawer.Screen name="Photo Gallery" component={GalleryScreen} />
      <Drawer.Screen name="Weather App" component={WeatherAppScreen} />
      {/* Add more assignments here */}
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Gallery" component={HiddenDrawer} />
        <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} />
        <Stack.Screen name="PhotoModal" component={PhotoModalScreen} options={{
          presentation: 'modal',
          headerShown: false
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
