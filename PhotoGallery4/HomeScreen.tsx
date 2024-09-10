import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Button, View, Text } from 'react-native';
import { StackParamList } from './App'; // Import the StackParamList from your App.tsx
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

// Define the navigation prop type for HomeScreen
type HomeScreenNavigationProp = StackNavigationProp<StackParamList, 'Home'>;

export function HomeScreen() {
  // Tell useNavigation what type of navigation we expect
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() =>
          navigation.navigate('Details', { itemId: 123, otherParam: 'test' })
        }
      />
    </View>
  );
}
