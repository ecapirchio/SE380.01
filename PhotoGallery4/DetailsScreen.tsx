import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Button, View, Text } from 'react-native';
import { StackParamList } from './App';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

type HomeScreenNavigationProp = StackNavigationProp<StackParamList, 'Home'>;

export function DetailsScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')} // No parameters passed
      />
      <Button
        title="Go to Modal"
        onPress={() =>
          navigation.navigate('Modal', { itemId: 123, otherParam: 'test' })
        }
      />
    </View>
  );
}
