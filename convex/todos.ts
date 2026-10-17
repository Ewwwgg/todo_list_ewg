import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx } from "./_generated/server";

function cleanText(raw: string) {
  const text = raw.trim();
  if (text.length === 0 || text.length > 120) {
    throw new ConvexError("Текст завдання має містити від 1 до 120 символів.");
  }
  return text;
}

async function requireUserId(ctx: MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Необхідно авторизуватися.");
  }
  return userId;
}

async function getOwnedTodo(
  ctx: MutationCtx,
  userId: Id<"users">,
  id: Id<"todos">,
) {
  const todo = await ctx.db.get("todos", id);
  if (!todo || todo.userId !== userId) {
    throw new ConvexError("Завдання не знайдено або доступ заборонено.");
  }
  return todo;
}

export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    return ctx.db
      .query("todos")
      .withIndex("by_user_creation", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { total: 0, completed: 0, active: 0, percentage: 0 };
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
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
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return ctx.db.insert("todos", {
      userId,
      text: cleanText(args.text),
      isCompleted: false,
      createdAt: Date.now(),
    });
  },
});

export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const todo = await getOwnedTodo(ctx, userId, args.id);

    await ctx.db.patch("todos", args.id, { isCompleted: !todo.isCompleted });
  },
});

export const updateTodo = mutation({
  args: { id: v.id("todos"), text: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await getOwnedTodo(ctx, userId, args.id);

    await ctx.db.patch("todos", args.id, { text: cleanText(args.text) });
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await getOwnedTodo(ctx, userId, args.id);

    await ctx.db.delete("todos", args.id);
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);

    const completedTodos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isCompleted"), true))
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
    const userId = await requireUserId(ctx);

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const todo of todos) {
      await ctx.db.delete("todos", todo._id);
    }

    return { deletedCount: todos.length };
  },
});
