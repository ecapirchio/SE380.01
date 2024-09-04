import React, { useState, useRef } from 'react';
import { View, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, Animated } from 'react-native';
import { imageData, ImageData } from '../data';
import { useNavigation } from '@react-navigation/native';

const GalleryScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState(imageData);
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setFilteredImages(imageData.filter(image => image.id.toString().includes(text)));
  };

  const handlePress = (image: ImageData) => {
    navigation.navigate('PhotoDetail', { image });
  };

  const renderItem = ({ item, index }: { item: ImageData; index: number }) => {
    const inputRange = [
      (index - 1) * 1500,  // Adjusted for slower rotation
      index * 1500,
      (index + 1) * 1500
    ];
    const rotate = scrollY.interpolate({
      inputRange,
      outputRange: ['0deg', '360deg', '0deg'],  // The same full rotation but over a larger scroll distance
    });

    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <Animated.Image source={{ uri: item.url }} style={[styles.image, { transform: [{ rotate }] }]} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by ID"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <Animated.FlatList
        data={filteredImages}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  searchInput: {
    margin: 10,
    padding: 10,
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 2,
  },
});

export default GalleryScreen;
