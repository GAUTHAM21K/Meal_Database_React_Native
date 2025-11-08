import express from "express";
import { ENV } from "../config/env.js";
import { db } from "../config/db.js";
import { favorites } from "./database/schema.js";
import { and, eq } from "drizzle-orm";
import job from "../config/cron.js";

// Start the cron job{
if (ENV.NODE_ENV === "production") {
  job.start();
}

const app = express();
const PORT = ENV.PORT || 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

//Favorites Endpoints
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, imageUrl, cookTime, servings } = req.body;
    console.log("📥 Incoming favorites body:", req.body);

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorites = await db
      .insert(favorites)
      .values({
        userId,
        recipeId,
        title,
        imageUrl,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json({ newFavorites });
  } catch (err) {
    console.log("error adding favorites", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete Endpoint
app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId))
      );

    res.status(200).json({ message: "removed successfully" });
  } catch (err) {
    console.log("error removing favorites", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get favorites Endpoint
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));

    res.status(200).json({ userFavorites });
  } catch (err) {
    console.log("error removing favorites", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
