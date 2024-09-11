import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, Modal, ActivityIndicator, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To store favorites
import { useFetchWeather } from './useFetch'; // Custom hook for fetching weather data
import { RouteProp } from '@react-navigation/native';
import { imageData, ImageData } from './data'; // Assuming data contains imageData
import { StackScreenProps } from '@react-navigation/stack';

// Create Navigators
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const BarCodeStack = createStackNavigator();

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
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

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
  const { data, loading, error } = useFetchWeather('current.json?q=RhodeIsland');

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>{error}</Text>;

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
function BarCodeScannerScreen({ navigation, route }: { navigation: any; route: RouteProp<any, any> }) {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    navigation.navigate('ProductDetail', { productUrl: data });
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

// Define a type for the Product object
type Product = {
  id: string;
  name: string;
  description: string;
};


// Define a type for your stack navigator's route params
type RootStackParamList = {
  BarCodeScanner: undefined;
  ProductDetail: { productUrl: string };
};

// Product Detail Screen
function ProductDetailScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, 'ProductDetail'>) {
  const { productUrl } = route.params; // Now TypeScript knows productUrl exists
  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`${productUrl}.json`);
      const data = await response.json();
      setProduct(data);
      checkFavorite(data);
    };
    fetchProduct();
  }, [productUrl]);

  const checkFavorite = async (product: Product) => {
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites) {
      const favoritesArray: Product[] = JSON.parse(favorites);
      const isFavorited = favoritesArray.some((fav) => fav.id === product.id);
      setIsFavorite(isFavorited);
    }
  };

  const toggleFavorite = async () => {
    let favorites = await AsyncStorage.getItem('favorites');
    let favoritesArray: Product[] = favorites ? JSON.parse(favorites) : [];

    if (isFavorite) {
      favoritesArray = favoritesArray.filter((fav) => fav.id !== product?.id);
      setIsFavorite(false);
    } else {
      if (product) {
        favoritesArray.push(product);
        setIsFavorite(true);
      }
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
  };

  if (!product) {
    return <Text>Loading product...</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 24 }}>{product.name}</Text>
      <Text>{product.description}</Text>
      <TouchableOpacity onPress={toggleFavorite}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={32}
          color={isFavorite ? 'red' : 'gray'}
        />
      </TouchableOpacity>
    </View>
  );
}

// BarCode Stack Navigator
function BarCodeNavigator() {
  return (
    <BarCodeStack.Navigator>
      <BarCodeStack.Screen
        name="BarCodeScanner"
        component={BarCodeScannerScreen}
        options={{ title: 'Barcode Scanner' }}
      />
      <BarCodeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Detail' }}
      />
    </BarCodeStack.Navigator>
  );
}



// Main App component with Drawer and Tab Navigators
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="BarCode"
        screenOptions={({ route }) => ({
          drawerPosition: 'right',
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
});
