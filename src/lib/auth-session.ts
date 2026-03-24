import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session.user;
}
