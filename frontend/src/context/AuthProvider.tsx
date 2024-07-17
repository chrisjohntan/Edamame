import { createContext, useState, ReactNode } from "react";
import { Auth } from "../types";

// Context type to expose setter
type AuthContextType = {
  auth: Auth;
  setAuth: (auth: Auth) => void;
}

const defaultAuthContext: AuthContextType = {
  auth: { user: { username: "", email: "" } },
  setAuth: () => {},
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({ user: { username: "", email: "" } });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// maybe we shld have just used js