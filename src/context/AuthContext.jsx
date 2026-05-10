import { createContext, useEffect, useState } from "react";
import authservice from "../appwrite/auth";
import dataservice from "../appwrite/database";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const currentUser = await authservice.currentuser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      await authservice.login({ email, password });

      const currentUser = await authservice.currentuser();

      if (!currentUser) {
        throw new Error("Login failed. Please try again.");
      }

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const {
        name,
        course,
        department,
        year,
        rollno,
        email,
        password,
      } = data;

      let userAccount;

      try {
        userAccount = await authservice.createaccount({
          email,
          password,
          name,
        });
      } catch (error) {
        if (
          error.message?.toLowerCase().includes("already exists") ||
          error.code === 409
        ) {
          throw new Error("Account already exists. Please login.");
        }

        throw error;
      }

      if (!userAccount) {
        throw new Error("Signup failed.");
      }

      await authservice.login({ email, password });

      let currentUser = null;

      for (let i = 0; i < 5; i++) {
        currentUser = await authservice.currentuser();

        if (currentUser) break;

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (!currentUser) {
        throw new Error("Signup succeeded but login failed.");
      }

      try {
        await dataservice.createprofile({
          userId: currentUser.$id,
          name,
          email,
          course,
          department:
            course === "BTech" || course === "MTech"
              ? department
              : "NA",
          year,
          rollno,
        });
      } catch (profileError) {
        console.error(profileError);
      }

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authservice.logout();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};