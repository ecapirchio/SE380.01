import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accelerometer } from 'expo-sensors';
import Icon from 'react-native-vector-icons/Ionicons'; // Import heart icon
import { StackScreenProps } from '@react-navigation/stack';

// Define Recipe type
type Recipe = {
  id: number;
  title: string;
  image?: string;
  instructions?: string;
};

// Define the navigation parameters for your stack navigator
type RootStackParamList = {
  AllRecipes: undefined;
  MyRecipes: undefined;
  RecipeDetail: { recipe: Recipe };
};

// Define props type using StackScreenProps from react-navigation/stack
type RecipeDetailProps = StackScreenProps<RootStackParamList, 'RecipeDetail'>;

const RecipeDetailScreen = ({ route }: RecipeDetailProps) => {
  const { recipe } = route.params;
  const [subscription, setSubscription] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    checkIfFavorite(); // Check if the recipe is already in favorites on mount
    subscribeToAccelerometer();

    return () => unsubscribeFromAccelerometer(); // Unsubscribe from accelerometer on unmount
  }, []);

  // Subscribe to accelerometer to detect shaking
  const subscribeToAccelerometer = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        const totalAcceleration = Math.sqrt(
          accelerometerData.x * accelerometerData.x +
          accelerometerData.y * accelerometerData.y +
          accelerometerData.z * accelerometerData.z
        );

        if (totalAcceleration > 1.78) {
          toggleFavorite(); // Handle adding/removing from favorites on shake
        }
      })
    );
  };

  const unsubscribeFromAccelerometer = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Check if the recipe is already in favorites
  const checkIfFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteRecipes');
      const favoriteRecipes = storedFavorites ? JSON.parse(storedFavorites) : [];
      const isAlreadyFavorite = favoriteRecipes.some((fav: { id: number }) => fav.id === recipe.id);
      setIsFavorite(isAlreadyFavorite); // Update state if the recipe is already a favorite
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  // Toggle recipe as favorite (add or remove)
  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteRecipes');
      let favoriteRecipes = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        // If it's already a favorite, remove it
        favoriteRecipes = favoriteRecipes.filter((fav: { id: number }) => fav.id !== recipe.id);
        Alert.alert('Removed', `${recipe.title} removed from favorites.`);
      } else {
        // Add to favorites
        favoriteRecipes.push(recipe);
        Alert.alert('Added', `${recipe.title} added to favorites!`);
      }

      await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
      setIsFavorite(!isFavorite); // Toggle the favorite state
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Function to add the recipe to MyRecipes (favorites)
  const handleAddToFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteRecipes');
      let favoriteRecipes = storedFavorites ? JSON.parse(storedFavorites) : [];

      // Check if the recipe is already in the favorites
      const isAlreadyFavorite = favoriteRecipes.some((fav: { id: number }) => fav.id === recipe.id);

      if (!isAlreadyFavorite) {
        favoriteRecipes.push(recipe);
        await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
        Alert.alert('Success', `${recipe.title} added to favorites!`);
      } else {
        Alert.alert('Notice', `${recipe.title} is already in favorites.`);
      }
    } catch (error) {
      console.error('Error saving recipe to favorites:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            {/* Toggle heart icon between filled and unfilled */}
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={30}
              color={isFavorite ? 'red' : 'black'}
            />
          </TouchableOpacity>
        </View>
        {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
        <Text style={styles.instructions}>{recipe.instructions}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
  },
});

export default RecipeDetailScreen;
