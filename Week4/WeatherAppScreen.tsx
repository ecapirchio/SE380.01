import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useFetchWeather } from './useFetch'; // Custom hook for fetching weather data

// Create Left Drawer for WeatherApp
const LeftDrawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Current Weather Screen
function CurrentWeatherScreen() {
  const { data, loading, error } = useFetchWeather('current.json?q=Cranston,Rhode Island'); // Set location to Cranston, RI

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>{error}</Text>;

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
  const { data, loading, error } = useFetchWeather(`forecast.json?q=Cranston,Rhode Island&days=${days}`); // Set location to Cranston, RI

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

// Main WeatherApp Screen
export function WeatherAppScreen() {
  return (
    <LeftDrawer.Navigator initialRouteName="CurrentWeather">
      <LeftDrawer.Screen name="CurrentWeather" component={CurrentWeatherScreen} options={{ title: 'Current Weather' }} />
      <LeftDrawer.Screen name="Forecast" component={ForecastScreen} options={{ title: 'Forecast' }} />
    </LeftDrawer.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});
