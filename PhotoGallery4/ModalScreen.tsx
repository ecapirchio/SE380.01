import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackParamList } from './App';
import { Button, View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

type DetailsScreenNavigationProp = StackNavigationProp<StackParamList, 'Details'>;

export function ModalScreen() {
  const navigation = useNavigation<DetailsScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Modal Screen</Text>
      <Button
        title="Go to Details hi"
        onPress={() =>
          navigation.navigate('Details', { itemId: 123, otherParam: 'test' })
        }
      />
    </View>
  );
}
