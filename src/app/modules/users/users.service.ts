import bcrypt from "bcryptjs";
import prisma from "../../shared/prisma";

const createUser = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  const user = await prisma.user.create({ data: userData });
  return user;
};

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
  createUser,
  getUserById,
  updateUser,
  getAllUsers,
};
