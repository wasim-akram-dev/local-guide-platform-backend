import prisma from "../../shared/prisma";

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

const updateUser = async (id: string, payload: any) => {
  const updated = await prisma.user.update({
    where: { id },
    data: payload,
  });
  return updated;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const UsersServices = {
  getUserById,
  updateUser,
  getAllUsers,
};
