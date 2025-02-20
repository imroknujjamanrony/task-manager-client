/* eslint-disable react/prop-types */
import axios from "axios";

import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  //   updateProfile,
} from "firebase/auth";
import { app } from "../firebase/firebase.config";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in with Google
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logOut = () => {
    setLoading(true);

    return signOut(auth);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken"); // Retrieve JWT token from localStorage

    // Set the Authorization header globally for Axios
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Monitor auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    signInWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
