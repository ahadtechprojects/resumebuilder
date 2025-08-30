import { React, useMemo, useState, useEffect } from "react";
import { load, save, uid, STORAGE_KEYS } from "../core/storage.js";

const emptyPortfolio = () => ({
  id: uid(),
  ownerId: "",
  title: "My Portfolio",
  slug: "",
  template: "modern",
  theme: "light",
  showcaseResumeId: "",
  bio: "",
  socials: { github: "", twitter: "", linkedin: "" },
  skills: [],
  featuredProjects: [],
  education: [],
  achievements: [],
  certifications: [],
  blogArticles: [],
  updatedAt: Date.now(),
});

export default function usePortfolios(userId) {
  const [portfolios, setPortfolios] = useState(() => {
    const storedPortfolios = load(STORAGE_KEYS.portfolios, []);
    // Normalize existing portfolios to include new fields
    return storedPortfolios.map(p => ({
      ...p,
      skills: Array.isArray(p.skills) ? p.skills : [],
      featuredProjects: Array.isArray(p.featuredProjects) ? p.featuredProjects : [],
      education: Array.isArray(p.education) ? p.education : [],
      achievements: Array.isArray(p.achievements) ? p.achievements : [],
      certifications: Array.isArray(p.certifications) ? p.certifications : [],
      blogArticles: Array.isArray(p.blogArticles) ? p.blogArticles : [],
      socials: p.socials || { github: "", twitter: "", linkedin: "" },
    }));
  });

  useEffect(() => save(STORAGE_KEYS.portfolios, portfolios), [portfolios]);

  const list = useMemo(() => portfolios.filter(p => p.ownerId === userId), [portfolios, userId]);

  const create = () => {
    const p = {
      ...emptyPortfolio(),
      ownerId: userId,
      title: `Portfolio ${list.length + 1}`,
    };
    setPortfolios(prev => [p, ...prev]);
    return p.id;
  };

  const update = (id, patch) => {
    setPortfolios(prev =>
      prev.map(x =>
        x.id === id
          ? {
              ...x,
              ...patch,
              skills: Array.isArray(patch.skills) ? patch.skills : x.skills,
              featuredProjects: Array.isArray(patch.featuredProjects)
                ? patch.featuredProjects
                : x.featuredProjects,
              education: Array.isArray(patch.education) ? patch.education : x.education,
              achievements: Array.isArray(patch.achievements) ? patch.achievements : x.achievements,
              certifications: Array.isArray(patch.certifications)
                ? patch.certifications
                : x.certifications,
              blogArticles: Array.isArray(patch.blogArticles) ? patch.blogArticles : x.blogArticles,
              socials: patch.socials || x.socials,
              updatedAt: Date.now(),
            }
          : x
      )
    );
  };

  const remove = id => setPortfolios(prev => prev.filter(x => x.id !== id));
  const get = id => portfolios.find(x => x.id === id);
  const getBySlug = slug => portfolios.find(x => x.slug === slug);

  return { list, create, update, remove, get, getBySlug, all: portfolios };
}