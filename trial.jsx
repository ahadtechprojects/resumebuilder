// src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Landing() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const snap = await getDocs(collection(db, "landingContent"));
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setContent({
          stats: docs
            .filter((d) => d.type === "scorecard")
            .flatMap((d) => d.stats || []),
          previews: docs.filter((d) => d.type === "preview"),
          articles: docs.filter((d) => d.type === "article"),
          testimonials: docs.filter((d) => d.type === "testimonial"),
        });
      } catch (err) {
        console.error("Error fetching landing content:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading landing page...</p>;

  // Fallbacks if no content is found
  const stats = content?.stats?.length
    ? content.stats
    : [
        { label: "Users", value: 0 },
        { label: "CVs", value: 0 },
        { label: "Portfolios", value: 0 },
      ];

  const previews = content?.previews?.length
    ? content.previews
    : [{ title: "Preview 1", description: "Demo preview card" }];

  const articles = content?.articles?.length
    ? content.articles
    : [{ title: "Getting Started", body: "Default article content" }];

  const testimonials = content?.testimonials?.length
    ? content.testimonials
    : [{ name: "John Doe", feedback: "This is a sample testimonial" }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="p-10 bg-white shadow text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Our Platform</h1>
        <p className="text-gray-500 mt-2">Build your CVs, portfolios & more.</p>
      </header>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-6 p-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-md transition"
          >
            <h2 className="text-3xl font-bold text-blue-600">{s.value}</h2>
            <p className="text-gray-600">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Previews */}
      <section className="p-10">
        <h2 className="text-2xl font-bold mb-4">Previews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {previews.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-gray-500">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="p-10 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Articles</h2>
        <div className="space-y-4">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold">{a.title}</h3>
              <p className="text-gray-600">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="p-10">
        <h2 className="text-2xl font-bold mb-4">What People Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
            >
              <p className="italic text-gray-600 mb-2">"{t.feedback}"</p>
              <p className="font-semibold text-gray-800">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
// src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Landing() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const snap = await getDocs(collection(db, "landingContent"));
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setContent({
          stats: docs
            .filter((d) => d.type === "scorecard")
            .flatMap((d) => d.stats || []),
          previews: docs.filter((d) => d.type === "preview"),
          articles: docs.filter((d) => d.type === "article"),
          testimonials: docs.filter((d) => d.type === "testimonial"),
        });
      } catch (err) {
        console.error("Error fetching landing content:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading landing page...</p>;

  // Fallbacks if no content is found
  const stats = content?.stats?.length
    ? content.stats
    : [
        { label: "Users", value: 0 },
        { label: "CVs", value: 0 },
        { label: "Portfolios", value: 0 },
      ];

  const previews = content?.previews?.length
    ? content.previews
    : [{ title: "Preview 1", description: "Demo preview card" }];

  const articles = content?.articles?.length
    ? content.articles
    : [{ title: "Getting Started", body: "Default article content" }];

  const testimonials = content?.testimonials?.length
    ? content.testimonials
    : [{ name: "John Doe", feedback: "This is a sample testimonial" }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="p-10 bg-white shadow text-center">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Our Platform</h1>
        <p className="text-gray-500 mt-2">Build your CVs, portfolios & more.</p>
      </header>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-6 p-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-md transition"
          >
            <h2 className="text-3xl font-bold text-blue-600">{s.value}</h2>
            <p className="text-gray-600">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Previews */}
      <section className="p-10">
        <h2 className="text-2xl font-bold mb-4">Previews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {previews.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-gray-500">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="p-10 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Articles</h2>
        <div className="space-y-4">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-semibold">{a.title}</h3>
              <p className="text-gray-600">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="p-10">
        <h2 className="text-2xl font-bold mb-4">What People Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
            >
              <p className="italic text-gray-600 mb-2">"{t.feedback}"</p>
              <p className="font-semibold text-gray-800">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
