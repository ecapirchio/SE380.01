import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
// new import
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './HomeScreen';
import { DetailsScreen} from './DetailsScreen';
import { ModalScreen } from './ModalScreen';


export type StackParamList = {
  Home: undefined;
  Details: { itemId: number; otherParam?: string };
  Modal: { itemId: number; otherParam?: string };
};


const Stack = createStackNavigator<StackParamList>();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Modal" component={ModalScreen} options={{ presentation: 'modal' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}




/*export function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to Details" onPress={() => {}} />
    </View>
  );
}*/


/*export function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button title="Go to Home" onPress={() => {}} />
    </View>
  );
}*/


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


/*
import React, { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { imageData, ImageData } from './data';


const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredImages, setFilteredImages] = useState<ImageData[]>(imageData);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);


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


  const renderImage = ({ item }: { item: ImageData }) => (
    <TouchableOpacity onPress={() => handleImagePress(item)}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by ID"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredImages}
        renderItem={renderImage}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
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
});*/