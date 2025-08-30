import React from "react";
import { useParams } from "react-router-dom";
import usePortfolios from "../modules/data/usePortfolios.js";
import { Card } from "../components/UI.jsx";

function Socials({ s }) {
  return (
    <div className="flex gap-3 mt-4">
      {s.github && (
        <a className="link text-blue-600 hover:text-blue-800 transition" href={s.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      )}
      {s.twitter && (
        <a className="link text-blue-600 hover:text-blue-800 transition" href={s.twitter} target="_blank" rel="noreferrer">
          Twitter
        </a>
      )}
      {s.linkedin && (
        <a className="link text-blue-600 hover:text-blue-800 transition" href={s.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      )}
    </div>
  );
}

export default function PublicPortfolio() {
  const { slug } = useParams();
  const { getBySlug } = usePortfolios(""); // load from storage
  const p = getBySlug(slug);

  // Normalize portfolio data
  const safePortfolio = p
    ? {
        ...p,
        socials: p.socials || { github: "", twitter: "", linkedin: "" },
        skills: Array.isArray(p.skills) ? p.skills : [],
        featuredProjects: Array.isArray(p.featuredProjects) ? p.featuredProjects : [],
        education: Array.isArray(p.education) ? p.education : [],
        achievements: Array.isArray(p.achievements) ? p.achievements : [],
        certifications: Array.isArray(p.certifications) ? p.certifications : [],
        blogArticles: Array.isArray(p.blogArticles) ? p.blogArticles : [],
      }
    : null;

  if (!safePortfolio) {
    return (
      <div className="container mx-auto max-w-7xl p-6 text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800">Portfolio not found</h2>
        <p className="text-gray-500 mt-2">Check the URL slug.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-6 animate-fade-in">
      <Card className="preview-card shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-white">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-200 pb-6">
            {safePortfolio.profileImage && (
              <img
                src={safePortfolio.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{safePortfolio.title}</h1>
              <p className="text-sm text-gray-500">/{safePortfolio.slug || "(no-slug)"}</p>
              <p className="mt-2 text-gray-700">{safePortfolio.bio}</p>
              <Socials s={safePortfolio.socials} />
            </div>
          </div>

          {/* Grid for Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Skills */}
            {safePortfolio.skills.length > 0 && (
              <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-700 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {safePortfolio.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Education */}
            {safePortfolio.education.length > 0 && (
              <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">Education</h3>
                <div className="space-y-4">
                  {safePortfolio.education.map((edu, i) => (
                    <div key={i} className="border-l-2 border-purple-200 pl-4">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-gray-600">{edu.school} ({edu.years})</p>
                      {edu.description && (
                        <p className="text-gray-500 text-sm mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Achievements & Awards */}
            {safePortfolio.achievements.length > 0 && (
              <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">Achievements & Awards</h3>
                <div className="space-y-4">
                  {safePortfolio.achievements.map((ach, i) => (
                    <div key={i} className="border-l-2 border-orange-200 pl-4">
                      <p className="font-medium">{ach.title} ({ach.year})</p>
                      <p className="text-gray-500 text-sm mt-1">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Certifications */}
            {safePortfolio.certifications.length > 0 && (
              <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
                <h3 className="text-lg font-semibold text-teal-700 mb-4">Certifications</h3>
                <div className="space-y-4">
                  {safePortfolio.certifications.map((cert, i) => (
                    <div key={i} className="border-l-2 border-teal-200 pl-4">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-gray-600">{cert.issuer} ({cert.year})</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Blog / Articles */}
            {safePortfolio.blogArticles.length > 0 && (
              <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
                <h3 className="text-lg font-semibold text-indigo-700 mb-4">Blog / Articles</h3>
                <div className="space-y-4">
                  {safePortfolio.blogArticles.map((article, i) => (
                    <div key={i} className="border-l-2 border-indigo-200 pl-4">
                      <a
                        className="link text-indigo-600 hover:text-indigo-800 transition font-medium"
                        href={article.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {article.title}
                      </a>
                      <p className="text-gray-500 text-sm mt-1">{article.summary}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Featured Projects */}
            {safePortfolio.featuredProjects.length > 0 && (
              <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
                <h3 className="text-lg font-semibold text-indigo-700 mb-4">Featured Projects</h3>
                <div className="space-y-4">
                  {safePortfolio.featuredProjects.map((fp, i) => (
                    <div key={i} className="border-l-2 border-indigo-200 pl-4">
                      <a
                        className="link text-indigo-600 hover:text-indigo-800 transition font-medium"
                        href={fp.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {fp.title}
                      </a>
                      <p className="text-gray-500 text-sm mt-1">{fp.summary}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}