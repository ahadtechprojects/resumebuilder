// src/modules/data/useCVs.js
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function useCVs(userId) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!userId) {
      setList([]);
      return () => {}; // ✅ always return cleanup
    }

    const q = query(collection(db, "cvs"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setList(data);
      },
      (err) => {
        console.error("Error listening to CVs:", err);
        setList([]);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Create
  const create = async () => {
    if (!userId) throw new Error("User must be logged in to create a CV.");

    const newCV = {
      userId,
      title: "New CV",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      experience: [],
      education: [],
      skills: [],
      sections: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      format: "default",
    };

    const docRef = await addDoc(collection(db, "cvs"), newCV);
    return docRef.id;
  };

  // Get
  const get = async (id) => {
    if (!userId || !id) return null;
    const docRef = doc(db, "cvs", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().userId === userId) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  };

  // Update
  const update = async (id, patch) => {
    if (!userId || !id) throw new Error("User ID or CV ID missing");
    const docRef = doc(db, "cvs", id);
    await updateDoc(docRef, { ...patch, updatedAt: serverTimestamp() });
  };

  // Remove
  const remove = async (id) => {
    if (!id) throw new Error("CV ID is required for deletion.");
    if (!userId) throw new Error("User must be authenticated to delete a CV.");

    const docRef = doc(db, "cvs", id);
    const cvSnap = await getDoc(docRef);

    if (!cvSnap.exists()) throw new Error("CV not found.");
    if (cvSnap.data().userId !== userId) {
      throw new Error("Unauthorized: You do not own this CV.");
    }

    await deleteDoc(docRef);
  };

  return { list, create, get, update, remove };
}
