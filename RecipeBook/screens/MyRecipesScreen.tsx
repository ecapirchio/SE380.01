import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define Recipe type
type Recipe = {
  id: number;
  title: string;
  image?: string;
  instructions?: string;
};

// Define the navigation type for the stack
type RootStackParamList = {
  MyRecipes: undefined;
  RecipeDetail: { recipe: Recipe };
};

// Define navigation prop type for MyRecipesScreen
type MyRecipesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecipeDetail'
>;

const MyRecipesScreen = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const navigation = useNavigation<MyRecipesScreenNavigationProp>();

  // Fetch favorites from AsyncStorage
  const fetchFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteRecipes');
      if (storedFavorites) {
        setFavoriteRecipes(JSON.parse(storedFavorites) as Recipe[]);
      }
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
    }
  };

  useEffect(() => {
    fetchFavorites(); // Initial load
  }, []);

  // Function to handle refreshing the list
  const handleRefresh = () => {
    fetchFavorites(); // Re-fetch the favorites when the button is pressed
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeContainer}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Add a refresh button */}
      <Button title="Refresh Favorites" onPress={handleRefresh} />
      <FlatList
        data={favoriteRecipes}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Combine id and index to ensure uniqueness
        renderItem={renderItem}
        ListEmptyComponent={() => <Text>No favorite recipes found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  recipeContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 18,
  },
});

export default MyRecipesScreen;
