import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { API_URL } from "../../constants/api";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavorites";
import LoadingSpinner from "../../components/LoadingSpinner";

const FavoriteScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipe, setFavoriteRecipe] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = user.id;

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (!user?.id) return;
        setLoading(true);

        const response = await fetch(`${API_URL}/favorites/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch favorites");

        const data = await response.json();
        console.log("✅ Raw favorites response:", data);

        // ✅ FIX: Extract the correct array from backend
        const favoritesArray = data?.userFavorites ?? [];

        if (!Array.isArray(favoritesArray)) {
          console.error("❌ userFavorites is not an array:", favoritesArray);
          Alert.alert("Unexpected data format from server");
          setFavoriteRecipe([]);
          return;
        }

        // ✅ Transform the array for FlatList
        const transformedFavorites = favoritesArray.map((fav) => ({
          id: fav.recipeId, // or use fav.id if you prefer DB id
          title: fav.title,
          imageUrl: fav.imageUrl,
          cookTime: fav.cookTime,
          servings: fav.servings,
        }));

        console.log("✅ Transformed favorites:", transformedFavorites);
        setFavoriteRecipe(transformedFavorites);
      } catch (error) {
        console.error("❌ Error loading favorites:", error);
        Alert.alert("Error", "Failed to load favorites.");
        setFavoriteRecipe([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure!?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut },
    ]);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={favoritesStyles.container}>
      <View style={favoritesStyles.header}>
        <Text style={favoritesStyles.title}>Favorites</Text>
        <TouchableOpacity
          style={favoritesStyles.logoutButton}
          onPress={handleSignOut}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={COLORS.text}
          ></Ionicons>
        </TouchableOpacity>
      </View>

      <View style={favoritesStyles.recipesSection}>
        <FlatList
          data={favoriteRecipe}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={favoritesStyles.row}
          contentContainerStyle={favoritesStyles.recipesGrid}
          ListEmptyComponent={<NoFavoritesFound />}
        />
      </View>
    </View>
  );
};

export default FavoriteScreen;
