import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type SafePrismaSkipReason = "missing-table" | "client-init";

export type SafePrismaResult<T> =
  | { status: "success"; data: T }
  | { status: "skipped"; reason: SafePrismaSkipReason };

export function isPrismaMissingTableError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}

export function isPrismaInitializationError(error: unknown): error is Prisma.PrismaClientInitializationError {
  return error instanceof Prisma.PrismaClientInitializationError;
}

function mapPrismaErrorToSkipResult(error: unknown): SafePrismaResult<never> | null {
  if (isPrismaMissingTableError(error)) {
    const meta = typeof error.meta === "object" && error.meta !== null ? error.meta : undefined;
    const modelName = typeof meta?.modelName === "string" ? meta.modelName : undefined;
    const message = modelName
      ? `Prisma table for model "${modelName}" is missing. Skipping query.`
      : "Prisma table is missing. Skipping query.";
    console.warn(message);
    return { status: "skipped", reason: "missing-table" };
  }

  if (isPrismaInitializationError(error)) {
    const message = "Prisma client could not initialize. Ensure the DATABASE_URL environment variable is set.";
    console.warn(message);
    return { status: "skipped", reason: "client-init" };
  }

  return null;
}

async function runSafePrismaCall<T>(callback: () => Promise<T>): Promise<SafePrismaResult<T>> {
  try {
    const data = await callback();
    return { status: "success", data };
  } catch (error) {
    const handled = mapPrismaErrorToSkipResult(error);
    if (handled) {
      return handled;
    }
    throw error;
  }
}

export async function safePrismaQuery<T>(promise: Promise<T>): Promise<SafePrismaResult<T>> {
  return runSafePrismaCall(() => promise);
}

export async function safePrismaAction<T>(callback: () => Promise<T>): Promise<SafePrismaResult<T>> {
  return runSafePrismaCall(callback);
}

export function prismaUnavailableMessage(
  reason: SafePrismaSkipReason,
  audience: "public" | "admin" = "public"
): string {
  if (audience === "admin") {
    return reason === "client-init"
      ? "Tidak dapat menghubungkan ke database. Pastikan variabel lingkungan DATABASE_URL sudah disetel."
      : "Skema database belum lengkap. Jalankan migrasi Prisma sebelum melanjutkan.";
  }

  return "Data tidak tersedia saat ini. Silakan coba lagi nanti.";
}
