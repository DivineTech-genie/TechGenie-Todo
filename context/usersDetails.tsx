"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type UsersProp = {
  userID: string;
  userName: string;
  password: string;
  email: string;
  setEmail: (email: string) => void;
  setUserID: (userID: string) => void;
  setUserName: (userName: string) => void;
  setPassword: (password: string) => void;
};

// ✅ FIX: Use consistent naming (UserContext instead of Usercontext)
export const UserContext = createContext<UsersProp | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <UserContext.Provider // ✅ FIX: Use UserContext (capital C)
      value={{
        userID,
        setUserID,
        userName,
        email,
        setEmail,
        setUserName,
        password,
        setPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsersDetails = () => {
  const context = useContext(UserContext); // ✅ FIX: Use UserContext

  if (!context) {
    throw new Error("useUsersDetails must be used within a UserProvider"); // ✅ Better error
  }

  return context;
};
