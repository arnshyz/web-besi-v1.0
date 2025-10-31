import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type SafePrismaResult<T> =
  | { status: "success"; data: T }
  | { status: "skipped"; reason: "missing-table" | "client-init"; message: string };

export function isPrismaMissingTableError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}

export function isPrismaInitializationError(error: unknown): error is Prisma.PrismaClientInitializationError {
  return error instanceof Prisma.PrismaClientInitializationError;
}

export async function safePrismaQuery<T>(promise: Promise<T>): Promise<SafePrismaResult<T>> {
  try {
    const data = await promise;
    return { status: "success", data };
  } catch (error) {
    if (isPrismaMissingTableError(error)) {
      const meta = typeof error.meta === "object" && error.meta !== null ? error.meta : undefined;
      const modelName = typeof meta?.modelName === "string" ? meta.modelName : undefined;
      const message = modelName ? `Prisma table for model "${modelName}" is missing. Skipping query.` : "Prisma table is missing. Skipping query.";
      console.warn(message);
      return { status: "skipped", reason: "missing-table", message };
    }
    if (isPrismaInitializationError(error)) {
      const message = "Prisma client could not initialize. Ensure the DATABASE_URL environment variable is set.";
      console.warn(message);
      return { status: "skipped", reason: "client-init", message };
    }
    throw error;
  }
}
