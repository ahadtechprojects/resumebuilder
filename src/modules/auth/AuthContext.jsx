import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Add logging to debug React environment
  if (!React.useState) {
    console.error("React.useState is undefined. Check for multiple React instances or SSR issues.");
  }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("AuthProvider: Setting up onAuthStateChanged listener");
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const tokenResult = await firebaseUser.getIdTokenResult(true);
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: firebaseUser.email,
              createdAt: new Date(),
              role: tokenResult.claims.admin ? "admin" : "user",
            });
          }

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
          });
          setIsAdmin(!!tokenResult.claims.admin);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("AuthProvider: Error in onAuthStateChanged:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log("AuthProvider: Cleaning up onAuthStateChanged listener");
      unsub();
    };
  }, []);

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("AuthProvider: Login error:", err);
      throw err;
    }
  };

  const register = async (email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", cred.user.uid);
      await setDoc(userDocRef, {
        email,
        createdAt: new Date(),
        role: "user",
      });
      return cred;
    } catch (err) {
      console.error("AuthProvider: Register error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("AuthProvider: Logout error:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}