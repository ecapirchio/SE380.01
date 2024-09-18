import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';



// Define the stack param list
type RootStackParamList = {
  AllRecipes: undefined;
  RecipeDetail: { recipe: any }; // RecipeDetail expects a recipe object
};

type AllRecipesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AllRecipes'
>;

type RecipeDetailRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

type Recipe = {
  id: number;
  title: string;
  image: string;
  instructions: string;
};

const AllRecipesScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // State expects an array of Recipe objects
  const navigation = useNavigation<AllRecipesScreenNavigationProp>();
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('https://api.spoonacular.com/recipes/random', {
          params: {
            apiKey: 'efa1dada02f34366b906258c62507853',
            number: 10, // fetch 10 random recipes
          },
        });
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
        style={styles.recipeContainer}
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })} // item is passed as the recipe
    >
        <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>

  );

  return (
    <View style={styles.container}>
        <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()} // TypeScript now knows item has an 'id'
            renderItem={renderItem}
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

export default AllRecipesScreen;
