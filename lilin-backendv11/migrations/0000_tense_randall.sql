CREATE TABLE "admin_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"image_url" text NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text NOT NULL,
	"website" text NOT NULL,
	"address" text NOT NULL,
	"map_embed" text NOT NULL,
	"instagram" text NOT NULL,
	"facebook" text NOT NULL,
	"tiktok" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(500),
	"image_url" varchar(1000) NOT NULL,
	"is_highlighted" boolean DEFAULT false,
	"category" varchar(100) DEFAULT 'workshop',
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hero_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"title1" text NOT NULL,
	"title2" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"image_alt" text NOT NULL,
	"show_buttons" boolean DEFAULT true NOT NULL,
	"show_stats" boolean DEFAULT true NOT NULL,
	"stats_number" text NOT NULL,
	"stats_label" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" text NOT NULL,
	"stock" text NOT NULL,
	"sold" text NOT NULL,
	"status" text NOT NULL,
	"image_url" text,
	"description" text,
	"moq" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "workshop_curriculum" (
	"id" serial PRIMARY KEY NOT NULL,
	"step" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration" text NOT NULL,
	"order" serial NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workshop_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" text NOT NULL,
	"duration" text NOT NULL,
	"features" text NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
