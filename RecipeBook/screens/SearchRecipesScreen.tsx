import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
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
  RecipeDetail: { recipe: Recipe };
};

// Replace with your recipe API URL
const RECIPE_API_URL = 'https://api.spoonacular.com/recipes/complexSearch';
const API_KEY = 'efa1dada02f34366b906258c62507853';

const SearchRecipesScreen = () => {
  const [searchTerm, setSearchTerm] = useState<string>(''); // The user-input search term
  const [recipes, setRecipes] = useState<Recipe[]>([]); // The list of fetched recipes
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Navigation prop

  // Function to search recipes by the search term (e.g., ID or name)
  const searchRecipes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Make an API call to fetch recipes based on the search term (ID or name)
      const response = await axios.get(RECIPE_API_URL, {
        params: {
          apiKey: API_KEY,
          query: searchTerm, // This can be ID, name, or any query criteria
        },
      });

      setRecipes(response.data.results); // Assuming the API returns results in `data.results`
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to navigate to RecipeDetailScreen
  const goToRecipeDetail = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail', { recipe }); // Navigate to the recipe detail screen with the recipe data
  };

  // Function to render each recipe item
  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.recipeContainer} onPress={() => goToRecipeDetail(item)}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      {item.image && <Text>Image URL: {item.image}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Input field to enter search term */}
      <TextInput
        style={styles.input}
        placeholder="Search Recipes by Name or ID"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Search button */}
      <Button title="Search" onPress={searchRecipes} />

      {/* Display loading state */}
      {isLoading && <Text>Loading...</Text>}

      {/* Display error message */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Display list of recipes */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipe}
        ListEmptyComponent={() => !isLoading && <Text>No recipes found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  recipeContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default SearchRecipesScreen;
