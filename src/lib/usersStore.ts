import { promises as fs } from "fs";
import path from "path";
import type { User } from "@/types/user";

const DATA_FILE = path.join(process.cwd(), "src/data/users.json");

export async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

export async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserByPhone(phone: string): Promise<User | undefined> {
  const users = await readUsers();
  const clean = phone.replace(/\D/g, "");
  return users.find((u) => u.phone.replace(/\D/g, "") === clean);
}

export async function findUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(user: User): Promise<void> {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
}
