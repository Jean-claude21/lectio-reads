CREATE TABLE IF NOT EXISTS "books" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "author" text NOT NULL,
  "finished" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
