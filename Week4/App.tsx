import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons
import { imageData, ImageData } from './data'; // Assuming your image data is in a separate file

// Create Navigators
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Screen component
function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Details Screen component
function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Text>Details Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Additional Home Detail Screen (in Home stack)
function HomeDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Detail Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Home Stack Navigator with multiple screens
function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="HomeDetail" component={HomeDetailScreen} />
    </Stack.Navigator>
  );
}

// Details Stack Navigator with multiple screens
function DetailsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator component
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'DetailsTab') {
            iconName = focused ? 'reader' : 'reader-outline';
          }

          // Return the Ionicons component with the icon name
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="DetailsTab" component={DetailsNavigator} />
    </Tab.Navigator>
  );
}

// Photo Gallery Screen component
function PhotoGalleryScreen() {
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
}

function WeatherAppScreen() {
  return (
    <View style={styles.container}>
      <Text>Weather App (Coming Soon)</Text>
    </View>
  );
}

// Main App component with Drawer and Tab Navigators
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          drawerIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Details') {
              iconName = focused ? 'reader' : 'reader-outline';
            } else if (route.name === 'PhotoGallery') {
              iconName = focused ? 'images' : 'images-outline';
            } else if (route.name === 'WeatherApp') {
              iconName = focused ? 'cloudy' : 'cloud-outline';
            }

            // Return the Ionicons component with the icon name
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Drawer.Screen name="Home" component={TabNavigator} />
        <Drawer.Screen name="Details" component={DetailsScreen} />
        <Drawer.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
        <Drawer.Screen name="WeatherApp" component={WeatherAppScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// Styling for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
