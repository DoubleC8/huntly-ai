import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import { revalidateUserCache } from "./cache/users";

type UserInsertInput = Prisma.UserUncheckedCreateInput & {
  id: string; // Required for insertUser since we need it to check existence and revalidate cache
  createdAt?: Date;
  updatedAt?: Date;
};

type UserUpdateInput = Prisma.UserUncheckedUpdateInput;

export async function insertUser(user: UserInsertInput) {
  const { createdAt, updatedAt, ...userData } = user;
  
  // Check if user already exists by ID or email (equivalent to onConflictDoNothing)
  const existingUserById = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const existingUserByEmail = userData.email 
    ? await prisma.user.findUnique({
        where: { email: userData.email },
      })
    : null;

  // Only create if user doesn't exist by ID or email
  if (!existingUserById && !existingUserByEmail) {
    try {
      await prisma.user.create({
        data: {
          ...userData,
          createdAt: createdAt ?? new Date(),
          updatedAt: updatedAt ?? new Date(),
        },
      });
    } catch (error: any) {
      // If it's a unique constraint error, ignore it (user already exists)
      if (error?.code === 'P2002') {
        // User already exists, silently ignore (equivalent to onConflictDoNothing)
        return;
      }
      throw error;
    }
  }

  revalidateUserCache(user.id);
}

export async function updateUser(
  id: string,
  user: UserUpdateInput
) {
  await prisma.user.update({
    where: { id },
    data: user,
  });

  revalidateUserCache(id);
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  });

  revalidateUserCache(id);
}

