import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: text("recipe_id").notNull(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  cookTime: integer("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
