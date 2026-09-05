import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authApi";


const AuthContext = createContext(null);

const TOKEN_KEY = "bookverse_token";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || "";
  });

  const [loading, setLoading] = useState(true);


  // ==============================
  // Restore Login on Page Refresh
  // ==============================

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const result =
          await getCurrentUser(token);

        setUser(result.user);
      } catch (error) {
        console.error(
          "Failed to restore BookVerse session:",
          error.message
        );

        localStorage.removeItem(TOKEN_KEY);

        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [token]);


  // ==============================
  // Save Auth Session
  // ==============================

  const saveSession = (
    newToken,
    newUser
  ) => {
    localStorage.setItem(
      TOKEN_KEY,
      newToken
    );

    setToken(newToken);
    setUser(newUser);
  };


  // ==============================
  // Register
  // ==============================

  const register = async (payload) => {
    const result =
      await registerUser(payload);

    saveSession(
      result.token,
      result.user
    );

    return result;
  };


  // ==============================
  // Login
  // ==============================

  const login = async (payload) => {
    const result =
      await loginUser(payload);

    saveSession(
      result.token,
      result.user
    );

    return result;
  };


  // ==============================
  // Logout
  // ==============================

  const logout = () => {
    localStorage.removeItem(
      TOKEN_KEY
    );

    setToken("");
    setUser(null);
  };


  // ==============================
  // Refresh Current User
  // ==============================

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      return null;
    }

    const result =
      await getCurrentUser(token);

    setUser(result.user);

    return result.user;
  };


  // ==============================
  // Role Helpers
  // ==============================

  const isAdmin =
    user?.role === "Admin";

  const isModerator =
    user?.role ===
      "Community Moderator" ||
    user?.role === "Admin";

  const isReader =
    user?.role === "Reader";


  const value = useMemo(
    () => ({
      user,
      token,
      loading,

      isAuthenticated: Boolean(
        user && token
      ),

      isReader,
      isModerator,
      isAdmin,

      register,
      login,
      logout,
      refreshUser,
    }),
    [
      user,
      token,
      loading,
      isReader,
      isModerator,
      isAdmin,
    ]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


// ==============================
// useAuth Hook
// ==============================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}