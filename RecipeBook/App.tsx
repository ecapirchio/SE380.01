import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AllRecipesScreen from './screens/AllRecipesScreen';
import MyRecipesScreen from './screens/MyRecipesScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import SearchRecipesScreen from './screens/SearchRecipesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// AllRecipes Stack
function AllRecipesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AllRecipes" component={AllRecipesScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

// MyRecipes Stack
function MyRecipesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyRecipes" component={MyRecipesScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator containing the two stacks
function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="All Recipes" component={AllRecipesStack} />
      <Tab.Screen name="My Recipes" component={MyRecipesStack} />
    </Tab.Navigator>
  );
}

// Main App with Drawer
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        {/* Drawer with Tab Navigator */}
        <Drawer.Screen name="Home" component={TabNavigator} />
        {/* Drawer with SearchRecipesScreen */}
        <Drawer.Screen name="Search Recipes" component={SearchRecipesScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
