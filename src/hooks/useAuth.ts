import { useContext } from "react";
import {
  AuthContext,
  AuthProvider,
  IAuthContext,
} from "../context/authContext/authContext";

function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
