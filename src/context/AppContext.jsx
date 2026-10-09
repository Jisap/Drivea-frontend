import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../config/api";
import { toast } from "react-hot-toast";

const AppContext = createContext();

const getErrMsg = (err, fallback) => err.response?.data?.error || fallback || "Something went wrong."

export const AppProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh User Profile & Storage Stats
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
      return data.user;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  // Check Auth Status on App Load
  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  //Auth Actions Helper
  const authAction = async (requestFn, successMsg, errorFallback) => {
    try {
      const { data } = await requestFn();
      setUser(data.user);
      if (successMsg) toast.success(successMsg);
      return true;
    } catch (error) {
      toast.error(getErrMsg(error, errorFallback));
      return false;
    }
  }

  const login = (email, password) => {
    return authAction(() => api.post(
      "/api/auth/login",
      { email, password }),
      "Welcome back!",
      "Login failed."
    )
  }

  const register = (name, email, password) => {
    return authAction(() => api.post(
      "/api/auth/register",
      { name, email, password }),
      "Account created successfully!",
      "Registration failed."
    )
  }

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out");
    } catch (error) {
      toast.error("Logout failed.");
    }
  }

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext);