// src/pages/AdminLandingContent.jsx
import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Card, Input, Button } from "../components/UI.jsx";

export default function AdminLandingContent() {
  const [user, setUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [type, setType] = useState("article");

  // Generic fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [slug, setSlug] = useState("");

  // Testimonial fields
  const [tName, setTName] = useState("");
  const [tRole, setTRole] = useState("");
  const [tQuote, setTQuote] = useState("");
  const [tAvatar, setTAvatar] = useState("");

  // Scorecard fields
  const [stats, setStats] = useState([{ label: "", value: "" }]);

  // Preview fields
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewDesc, setPreviewDesc] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewLink, setPreviewLink] = useState("");

  // Button fields
  const [btnLabel, setBtnLabel] = useState("");
  const [btnLink, setBtnLink] = useState("");
  const [btnStyle, setBtnStyle] = useState("primary");

  // auth + snapshot (unchanged)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const col = collection(db, "landingContent");
    const unsub = onSnapshot(
      col,
      (snap) => {
        setSections(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Error listening landingContent:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const resetForm = useCallback(() => {
    setType("article");
    setTitle("");
    setContent("");
    setImageUrl("");
    setSlug("");
    setTName("");
    setTRole("");
    setTQuote("");
    setTAvatar("");
    setStats([{ label: "", value: "" }]);
    setPreviewTitle("");
    setPreviewDesc("");
    setPreviewImage("");
    setPreviewLink("");
    setBtnLabel("");
    setBtnLink("");
    setBtnStyle("primary");
  }, []);

  const handleAddSection = async () => {
    if (!user) return alert("You must be logged in as admin to add content.");
    const col = collection(db, "landingContent");
    let payload = { type, createdAt: serverTimestamp() };

    try {
      if (type === "article") {
        if (!title || !content) return alert("Article requires title & content.");
        payload = {
          ...payload,
          title,
          slug: slug || title.toLowerCase().replace(/\s+/g, "-").slice(0, 50),
          excerpt: content,
          imageUrl: imageUrl || "",
          body: content,
        };
      } else if (type === "testimonial") {
        if (!tName || !tQuote) return alert("Testimonial requires name & quote.");
        payload = { ...payload, name: tName, role: tRole, quote: tQuote, avatarUrl: tAvatar };
      } else if (type === "scorecard") {
        const normalized = stats.filter((s) => s.label.trim());
        if (normalized.length === 0) return alert("Add at least one stat.");
        payload = { ...payload, stats: normalized };
      } else if (type === "preview") {
        if (!previewTitle) return alert("Preview requires title.");
        payload = { ...payload, title: previewTitle, desc: previewDesc, imageUrl: previewImage, link: previewLink };
      } else if (type === "button") {
        if (!btnLabel) return alert("Button requires a label.");
        payload = { ...payload, label: btnLabel, link: btnLink, style: btnStyle };
      }

      await addDoc(col, payload);
      resetForm();
    } catch (err) {
      console.error("Error adding section:", err);
      alert("Error adding section: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!user) return alert("You must be logged in as admin to delete content.");
    try {
      await deleteDoc(doc(db, "landingContent", id));
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  // ... keep updateStat, addStat, removeStat as-is

  if (!user) {
    return <div className="p-12 text-center"><Card className="p-8">Login required</Card></div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Landing Page Admin</h1>

      {/* Add Section */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add New Section</h2>
        <label className="block">
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 p-2 border rounded w-full">
            <option value="article">Article</option>
            <option value="testimonial">Testimonial</option>
            <option value="scorecard">Scorecard</option>
            <option value="preview">Preview</option>
            <option value="button">Button</option>
          </select>
        </label>

        {/* BUTTON */}
        {type === "button" && (
          <>
            <Input label="Button Label" value={btnLabel} onChange={setBtnLabel} />
            <Input label="Button Link (URL)" value={btnLink} onChange={setBtnLink} />
            <label className="block">
              Style:
              <select value={btnStyle} onChange={(e) => setBtnStyle(e.target.value)} className="mt-1 p-2 border rounded w-full">
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </label>
          </>
        )}

        {/* keep your other form sections (article, testimonial, scorecard, preview) unchanged */}

        <div className="flex gap-3">
          <Button kind="primary" onClick={handleAddSection}>Add Section</Button>
          <Button kind="default" onClick={resetForm}>Reset</Button>
        </div>
      </Card>

      {/* Sections List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Sections</h2>
        {loading ? <p>Loading...</p> : sections.length === 0 ? <p>No sections yet</p> : (
          <div className="space-y-3">
            {sections.map((s) => (
              <Card key={s.id} className="p-4 flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">{s.type}</div>
                  <h3 className="font-semibold">
                    {s.title || s.name || s.label || s.slug}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {s.type === "article" && s.excerpt}
                    {s.type === "testimonial" && s.quote}
                    {s.type === "scorecard" && s.stats?.map((st) => `${st.label}: ${st.value}`).join(" • ")}
                    {s.type === "preview" && s.desc}
                    {s.type === "button" && `Label: ${s.label} → ${s.link} (${s.style})`}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button kind="default" onClick={() => s.link && window.open(s.link, "_blank")}>View</Button>
                  <Button kind="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

