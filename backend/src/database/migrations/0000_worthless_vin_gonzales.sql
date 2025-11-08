CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" text NOT NULL,
	"title" text NOT NULL,
	"image_url" text,
	"cook_time" integer,
	"servings" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
