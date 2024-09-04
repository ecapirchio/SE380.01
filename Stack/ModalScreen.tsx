import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from './types';

type ModalScreenNavigationProp = StackNavigationProp<StackParamList, 'Modal'>;

export function ModalScreen() {
  const navigation = useNavigation<ModalScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Modal Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', { itemId: 123, otherParam: 'test' })}
      />
    </View>
  );
}
