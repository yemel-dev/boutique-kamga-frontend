import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem("jwt_token"));
  const [role, setRole] = useState(sessionStorage.getItem("jwt_role"));
  const [username, setUsername] = useState(sessionStorage.getItem("jwt_username"));

  function saveSession({ token, role, username }) {
    sessionStorage.setItem("jwt_token", token);
    sessionStorage.setItem("jwt_role", role);
    sessionStorage.setItem("jwt_username", username);
    setToken(token);
    setRole(role);
    setUsername(username);
  }

  function logout() {
    sessionStorage.clear();
    setToken(null);
    setRole(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, username, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}