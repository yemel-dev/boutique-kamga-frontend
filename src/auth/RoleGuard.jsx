import { useAuth } from "./AuthContext";

export function RoleGuard({ allow, children }) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) return null;

  return children;
}