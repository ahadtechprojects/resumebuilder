// src/modules/data/useCollection.js
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed

export function useCollection(path, userId) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, path), where("userId", "==", userId));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setList(items);
    });

    return () => unsub();
  }, [path, userId]);

  // --- CRUD functions ---
  const create = async (data = {}) => {
    const ref = await addDoc(collection(db, path), {
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...data,
    });
    return ref.id;
  };

  const update = async (id, data) => {
    await updateDoc(doc(db, path, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, path, id));
  };

  return { list, create, update, remove };
}
