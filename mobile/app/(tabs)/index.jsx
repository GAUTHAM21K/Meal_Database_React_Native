import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { homeStyles } from "../../assets/styles/home.styles";
import { MealAPI } from "../../services/mealAPI";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import CategoryFilter from "../../components/CategoryFilter";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useUser } from "@clerk/clerk-expo";

// const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipe, setRecipe] = useState([]);
  const [category, setCategory] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useUser();

  const loadData = async () => {
    try {
      setLoading(true);
      const [apiCategories, RandomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);
      // console.log("RandomMeals:", RandomMeals);

      const transformedCategory = apiCategories.map((category, index) => ({
        id: parseInt(category.idCategory), // or index + 1
        name: category.strCategory,
        image: category.strCategoryThumb,
        description: category.strCategoryDescription,
      }));
      setCategory(transformedCategory);

      if (!selectedCategory) {
        setSelectedCategory(transformedCategory[0].name);
      }

      const transformedMeal = Array.isArray(RandomMeals)
        ? RandomMeals.map((meal) => MealAPI.transformMealData(meal)).filter(
            Boolean
          )
        : [];
      // console.log("trsanformed:", transformedMeal[1]);
      setRecipe(transformedMeal);

      const transformedFeatured = MealAPI.transformMealData(featuredMeal);
      // console.log("trsanformed:", transformedFeatured)
      setFeaturedRecipe(transformedFeatured);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal) => MealAPI.transformMealData(meal)) // transform each meal
        .filter((meal) => meal !== null);
      // console.log(recipe); // remove nulls
      setRecipe(transformedMeals);
    } catch (error) {
      console.error("Error loading category data:", error);
      setRecipe([]); // fallback to empty list
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };
  const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{
              width: 100,
              height: 100,
            }}
          ></Image>
          <Image
            source={require("../../assets/images/chicken.png")}
            style={{
              width: 100,
              height: 100,
            }}
          ></Image>
          <Image
            source={require("../../assets/images/pork.png")}
            style={{
              width: 100,
              height: 100,
            }}
          ></Image>
        </View>

        {loading ? (
          <LoadingSpinner />
        ) : (
          featuredRecipe && (
            <View style={homeStyles.featuredSection}>
              <TouchableOpacity
                style={homeStyles.featuredCard}
                activeOpacity={0.9}
                onPress={() => router.push(`/recipes/${featuredRecipe.id}`)}
              >
                <View style={homeStyles.featuredImageContainer}>
                  <Image
                    source={{ uri: featuredRecipe.image }}
                    style={homeStyles.featuredImage}
                    contentFit="cover"
                    transition={500}
                  ></Image>
                  <View style={homeStyles.featuredOverlay}>
                    <View style={homeStyles.featuredBadge}>
                      <Text style={homeStyles.featuredBadgeText}>featured</Text>
                    </View>
                    <View style={homeStyles.featuredContent}>
                      <Text style={homeStyles.featuredTitle}>
                        {featuredRecipe.title}
                      </Text>

                      <View style={homeStyles.featuredMeta}>
                        <View style={homeStyles.metaItem}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={homeStyles.metaText}>
                            {featuredRecipe.cookTime}
                          </Text>
                        </View>

                        <View style={homeStyles.metaItem}>
                          <Ionicons
                            name="people-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={homeStyles.metaText}>
                            {featuredRecipe.servings}
                          </Text>
                        </View>
                        {featuredRecipe.area && (
                          <View style={homeStyles.metaItem}>
                            <Ionicons
                              name="location-outline"
                              size={16}
                              color={COLORS.white}
                            />
                            <Text style={homeStyles.metaText}>
                              {featuredRecipe.area}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )
        )}

        {category.length > 0 && (
          <CategoryFilter
            categories={category}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}> {selectedCategory} </Text>
          </View>
          {recipe.length > 0 ? (
            <FlatList
              data={recipe}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.recipesGrid}
              scrollEnabled={false}
            ></FlatList>
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons
                name="restaurant-outline"
                size={64}
                color={COLORS.textLight}
              ></Ionicons>
              <Text style={homeStyles.emptyTitle}>No recipes found</Text>
              <Text style={homeStyles.emptyDescription}>
                Try a different category
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
