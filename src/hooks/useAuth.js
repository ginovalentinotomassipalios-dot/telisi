import { useEffect, useState } from "react";
import { listenAuth } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = listenAuth(currentUser => {
      console.log(
        "USUARIO FIREBASE:",
        currentUser
      );

      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    checkingAuth
  };
}