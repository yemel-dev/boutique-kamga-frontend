import { createContext, useContext, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = sessionStorage.getItem("jwt_token");
    const role = sessionStorage.getItem("user_role");
    const username = sessionStorage.getItem("username");
    return token ? { token, role, username } : null;
  });

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    sessionStorage.setItem("jwt_token", data.token);
    sessionStorage.setItem("user_role", data.role);
    sessionStorage.setItem("username", data.username);
    setUser({ token: data.token, role: data.role, username: data.username });
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);