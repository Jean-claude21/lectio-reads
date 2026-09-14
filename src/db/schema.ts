import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  finished: boolean("finished").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Book = typeof books.$inferSelect;
