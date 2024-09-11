import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { useFetchWeather } from './useFetch'; // Custom hook for fetching weather data
import { imageData, ImageData } from './data';

// Create Navigators
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const BarCodeStack = createStackNavigator(); // New Stack for Barcode Scanner

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

// Current Weather Screen
function CurrentWeatherScreen() {
  const { data, loading, error } = useFetchWeather('current.json?q=RhodeIsland'); // Replace YOUR_LOCATION with an actual location

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>{error}</Text>;

  // Ensure data is defined before accessing its properties
  if (!data || !data.location || !data.current) {
    return <Text>Weather data not available</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Location: {data.location.name}</Text>
      <Text>{data.current.condition.text}</Text>
      <Image source={{ uri: `https:${data.current.condition.icon}` }} style={styles.icon} />
      <Text>Temperature: {data.current.temp_c}°C</Text>
    </View>
  );
}


// Forecast Component (Reusable)
function ForecastComponent({ days }: { days: number }) {
  const { data, loading, error } = useFetchWeather(`forecast.json?q=RhodeIsland&days=${days}`);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      {data.forecast.forecastday.map((day: any, index: number) => (
        <View key={index}>
          <Text>Date: {day.date}</Text>
          <Text>Condition: {day.day.condition.text}</Text>
          <Image source={{ uri: `https:${day.day.condition.icon}` }} style={styles.icon} />
          <Text>Max Temp: {day.day.maxtemp_c}°C</Text>
          <Text>Min Temp: {day.day.mintemp_c}°C</Text>
        </View>
      ))}
    </View>
  );
}

// Forecast Screen with Tabs
function ForecastScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="3 Days" children={() => <ForecastComponent days={3} />} />
      <Tab.Screen name="7 Days" children={() => <ForecastComponent days={7} />} />
    </Tab.Navigator>
  );
}

// WeatherApp Screen with Left Drawer
function WeatherAppScreen() {
  const LeftDrawer = createDrawerNavigator();

  return (
    <LeftDrawer.Navigator initialRouteName="CurrentWeather">
      <LeftDrawer.Screen name="CurrentWeather" component={CurrentWeatherScreen} options={{ title: 'Current Weather' }} />
      <LeftDrawer.Screen name="Forecast" component={ForecastScreen} options={{ title: 'Forecast' }} />
    </LeftDrawer.Navigator>
  );
}

// BarCode Scanner Screen component
function BarCodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  // Add typing for the event parameters
  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

// BarCode Stack Navigator
function BarCodeNavigator() {
  return (
    <BarCodeStack.Navigator>
      <BarCodeStack.Screen name="BarCodeScanner" component={BarCodeScannerScreen} options={{ title: 'Barcode Scanner' }} />
    </BarCodeStack.Navigator>
  );
}

// Main App component with Drawer and Tab Navigators
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="BarCode" // Set this to the screen you're currently working on (optional)
        screenOptions={({ route }) => ({
          drawerPosition: 'right', // Right-side drawer
          drawerIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Details') {
              iconName = focused ? 'reader' : 'reader-outline';
            } else if (route.name === 'PhotoGallery') {
              iconName = focused ? 'images' : 'images-outline';
            } else if (route.name === 'WeatherApp') {
              iconName = focused ? 'cloudy' : 'cloud-outline';
            } else if (route.name === 'BarCode') {
              iconName = focused ? 'barcode' : 'barcode-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Drawer.Screen name="Home" component={TabNavigator} />
        <Drawer.Screen name="Details" component={DetailsScreen} />
        <Drawer.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
        <Drawer.Screen name="WeatherApp" component={WeatherAppScreen} options={{ title: 'Weather App' }} />
        <Drawer.Screen name="BarCode" component={BarCodeNavigator} options={{ title: 'Barcode Scanner' }} />
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
  icon: {
    width: 50,
    height: 50,
  },
  absoluteFillObject: {
    flex: 1,
  },
});
