import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigationTypes'; // Adjust the import path as necessary

type PhotoDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PhotoDetail'>;

const PhotoDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PhotoDetail'>>();
  const route = useRoute<PhotoDetailScreenProps['route']>();
  const { image } = route.params;

  const handlePress = () => {
    navigation.navigate('PhotoModal', { image });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.imageContainer}>
        <Image source={{ uri: image.url }} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.urlText}>{image.url}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  imageContainer: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  urlText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray'
  }
});

export default PhotoDetailScreen;
