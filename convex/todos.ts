import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodos = query({
  args: {},
  handler: async (ctx) =>
    ctx.db
      .query("todos")
      .withIndex("by_created_at")
      .order("desc")
      .collect(),
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const total = todos.length;
    const completed = todos.filter((todo) => todo.isCompleted).length;

    return {
      total,
      completed,
      active: total - completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  },
});

export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const text = args.text.trim();
    if (text.length === 0 || text.length > 120) {
      throw new ConvexError("Текст завдання має містити від 1 до 120 символів.");
    }

    return ctx.db.insert("todos", {
      text,
      isCompleted: false,
      createdAt: Date.now(),
    });
  },
});

export const toggleTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get("todos", args.id);
    if (!todo) {
      throw new ConvexError("Завдання не знайдено.");
    }

    await ctx.db.patch("todos", args.id, {
      isCompleted: !todo.isCompleted,
    });
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const text = args.text.trim();
    if (text.length === 0 || text.length > 120) {
      throw new ConvexError("Текст завдання має містити від 1 до 120 символів.");
    }

    const todo = await ctx.db.get("todos", args.id);
    if (!todo) {
      throw new ConvexError("Завдання не знайдено.");
    }

    await ctx.db.patch("todos", args.id, { text });
  },
});

export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get("todos", args.id);
    if (!todo) {
      throw new ConvexError("Завдання не знайдено.");
    }

    await ctx.db.delete("todos", args.id);
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completedTodos = await ctx.db
      .query("todos")
      .withIndex("by_completion", (query) => query.eq("isCompleted", true))
      .collect();

    for (const todo of completedTodos) {
      await ctx.db.delete("todos", todo._id);
    }

    return { deletedCount: completedTodos.length };
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();

    for (const todo of todos) {
      await ctx.db.delete("todos", todo._id);
    }

    return { deletedCount: todos.length };
  },
});
