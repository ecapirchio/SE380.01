// navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import GalleryScreen from '../screens/GalleryScreen';
import PhotoDetailScreen from '../screens/PhotoDetailScreen';
import PhotoModalScreen from '../screens/PhotoModalScreen';
import { RootStackParamList } from '../types/navigationTypes';  // Adjust the import path as necessary

const Stack = createNativeStackNavigator<RootStackParamList>();


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Gallery" component={GalleryScreen} />
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
