// screens/PhotoModalScreen.tsx
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ImageData } from '../data';

type ParamList = {
  PhotoModal: {
    image: ImageData;
  };
};

const PhotoModalScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'PhotoModal'>>();
  const { image } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/icon.png')}  // Ensure you have a close icon in your assets
          style={styles.icon}
        />
      </TouchableOpacity>
      <Image source={{ uri: image.url }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain'
  },
  closeButton: {
    position: 'absolute',
    top: 45,
    right: 20,
    zIndex: 1,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: 'white'
  }
});

export default PhotoModalScreen;
