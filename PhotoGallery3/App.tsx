import React, { useState, useRef } from 'react';
import { View, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, Modal, Animated } from 'react-native';
import { imageData, ImageData } from './data';

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredImages, setFilteredImages] = useState<ImageData[]>(imageData);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  // Create an animated value to track the scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const filtered = imageData.filter(image => image.id.toString().includes(text));
    setFilteredImages(filtered);
  };

  const handleImagePress = (image: ImageData) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const renderItem = ({ item, index }: { item: ImageData; index: number }) => {
    const inputRange = [
      (index - 1) * 150,  // Adjust these values based on how fast you want the scale change to happen
      index * 150,
      (index + 1) * 150
    ];

    const scale = scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: [1, 0.5],  // Start at full size, shrink to 0.5x, then back to full size
      extrapolate: 'clamp',  // Ensures values don't go beyond the specified range
    });

    return (
      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <Animated.Image
          source={{ uri: item.url }}
          style={[styles.image, { transform: [{ scale }] }]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by ID"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <Animated.FlatList
        data={filteredImages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
      <Modal visible={!!selectedImage} transparent={true}>
        <TouchableOpacity style={styles.modalContainer} onPress={handleCloseModal}>
          <Image source={{ uri: selectedImage?.url }} style={styles.modalImage} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 8,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
});

export default App;
