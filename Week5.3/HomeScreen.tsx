/*import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from './types';

type HomeScreenNavigationProp = StackNavigationProp<StackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', { itemId: 123, otherParam: 'test' })}
      />
    </View>
  );
}
*/

import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from './types';

type HomeScreenNavigationProp = StackNavigationProp<StackParamList, 'Home'>;

export function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate('Modal')}
        title="Open Modal"
      />
    </View>
  );
}
