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
  
  // Check if user already exists (equivalent to onConflictDoNothing)
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        ...userData,
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date(),
      },
    });
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

