import {
  View,
  Text,
  TextComponent,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MealAPI } from "../../services/mealAPI";
import { useDebounce } from "../../hooks/useDebounce";
import { searchStyles } from "../../assets/styles/search.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipe, setRecipe] = useState([]);
  const [loading, setloading] = useState(false);
  const [initalLoading, setInitaialLoading] = useState(true);

  const debouncedSearchquery = useDebounce(searchQuery, 300);

  const performSearch = async (query) => {
    if (!query) {
      const randomMeals = await MealAPI.getRandomMeals(12);
      // console.log("random result :", randomMeals);
      return randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal != null);
    }
    const nameResult = await MealAPI.searchMealsByName(query);
    let result = nameResult;
    // console.log("name result :", nameResult);
    if (nameResult.length === 0) {
      const ingrediantResult = await MealAPI.filterByIngredient(query);
      result = ingrediantResult;
      // console.log("ingredianrt result :", ingrediantResult);
    }

    return result
      .map((meal) => MealAPI.transformMealData(meal))
      .filter((meal) => meal != null);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const result = await performSearch("");
        setRecipe(result);
      } catch (error) {
        console.log(error);
      } finally {
        setInitaialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (initalLoading) {
      return;
    }

    const handleSearch = async () => {
      setloading(true);
      try {
        const result = await performSearch(debouncedSearchquery);
        setRecipe(result);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    handleSearch();
  }, [debouncedSearchquery, initalLoading]);

  if (initalLoading) return <LoadingSpinner />;

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searchIcon}
          ></Ionicons>
          <TextInput
            style={searchStyles.searchInput}
            placeholder="search recipe, ingrediants ..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          ></TextInput>
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
              }}
              style={searchStyles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              ></Ionicons>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery ? `Result for "${searchQuery}"` : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>found {recipe.length}</Text>
        </View>
        {loading ? (
          <View style={searchStyles.loadingContainer}>
            <LoadingSpinner />
          </View>
        ) : (
          <FlatList
            data={recipe}
            renderItem={({ item }) => <RecipeCard recipe={item}></RecipeCard>}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoResulFound />}
          ></FlatList>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;

function NoResulFound() {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons
        name="search-outline"
        size={64}
        color={COLORS.textLight}
      ></Ionicons>
      <Text style={searchStyles.emptyTitle}>No Recipe Found</Text>
      <Text style={searchStyles.emptyDescription}>
        try adjusting your search
      </Text>
    </View>
  );
}
