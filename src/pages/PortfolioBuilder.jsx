import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import usePortfolios from "../modules/data/usePortfolios.js";
import useResumes from "../modules/data/useResume.js";
import { Card, Input, TextArea, Button } from "../components/UI.jsx";
import { toast } from "react-toastify";

export default function PortfolioBuilder() {
  const { id } = useParams();
  const { user } = useAuth();
  const portfolios = usePortfolios(user?.id);
  const resumes = useResumes(user?.id);
  const nav = useNavigate();
  const p = portfolios.get(id);

  // Local state for form data
  const [formData, setFormData] = React.useState(null);

  // Initialize local state with portfolio data
  React.useEffect(() => {
    if (p) {
      setFormData({
        ...p,
        socials: p.socials || { github: "", twitter: "", linkedin: "" },
        skills: Array.isArray(p.skills) ? p.skills : [],
        featuredProjects: Array.isArray(p.featuredProjects) ? p.featuredProjects : [],
        education: Array.isArray(p.education) ? p.education : [],
        achievements: Array.isArray(p.achievements) ? p.achievements : [],
        certifications: Array.isArray(p.certifications) ? p.certifications : [],
        blogArticles: Array.isArray(p.blogArticles) ? p.blogArticles : [],
      });
    }
  }, [p]);

  // Redirect if no portfolio
  React.useEffect(() => {
    if (!p) nav("/dashboard");
  }, [p, nav]);

  // Debounce updates to backend
  React.useEffect(() => {
    if (formData) {
      const timeout = setTimeout(() => {
        try {
          portfolios.update(p.id, formData);
        } catch (err) {
          toast.error("Error updating portfolio: " + err.message);
        }
      }, 500); // 500ms debounce
      return () => clearTimeout(timeout);
    }
  }, [formData, p.id, portfolios]);

  if (!p || !formData) return null;

  const updateFormData = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Form */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">
          Editing: {formData.title}
        </h2>

        {/* Basic Info */}
        <Card className="border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(v) => updateFormData({ title: v })}
            />
            <Input
              label="Public slug"
              value={formData.slug}
              onChange={(v) =>
                updateFormData({ slug: v.replace(/\s+/g, "-").toLowerCase() })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="grid gap-2">
              <span className="text-sm text-gray-600 font-medium">Template</span>
              <select
                className="select-field"
                value={formData.template}
                onChange={(e) => updateFormData({ template: e.target.value })}
              >
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-gray-600 font-medium">Theme</span>
              <select
                className="select-field"
                value={formData.theme}
                onChange={(e) => updateFormData({ theme: e.target.value })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2 mt-4">
            <span className="text-sm text-gray-600 font-medium">Showcase Resume</span>
            <select
              className="select-field"
              value={formData.showcaseResumeId}
              onChange={(e) => updateFormData({ showcaseResumeId: e.target.value })}
            >
              <option value="">None</option>
              {resumes.list.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </label>

          <TextArea
            label="Short bio"
            value={formData.bio}
            onChange={(v) => updateFormData({ bio: v })}
          />

          {/* Socials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="GitHub"
              value={formData.socials.github}
              onChange={(v) => updateFormData({ socials: { ...formData.socials, github: v } })}
            />
            <Input
              label="Twitter"
              value={formData.socials.twitter}
              onChange={(v) => updateFormData({ socials: { ...formData.socials, twitter: v } })}
            />
            <Input
              label="LinkedIn"
              value={formData.socials.linkedin}
              onChange={(v) => updateFormData({ socials: { ...formData.socials, linkedin: v } })}
            />
          </div>
        </Card>

        {/* Skills Section */}
        <Card className="border border-green-100">
          <h3 className="text-lg font-semibold text-green-700 mb-4">Skills</h3>
          <div className="space-y-4">
            {formData.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  label={`Skill ${i + 1}`}
                  value={skill}
                  onChange={(v) => {
                    const arr = [...formData.skills];
                    arr[i] = v;
                    updateFormData({ skills: arr });
                  }}
                />
                <Button
                  kind="secondary"
                  onClick={() =>
                    updateFormData({ skills: formData.skills.filter((_, k) => k !== i) })
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button
            kind="primary"
            onClick={() => updateFormData({ skills: [...formData.skills, ""] })}
            className="mt-4"
          >
            Add Skill
          </Button>
        </Card>

        {/* Education Section */}
        <Card className="border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">Education</h3>
          <div className="space-y-6">
            {formData.education.map((edu, i) => (
              <Card key={i} className="bg-gray-50">
                <Input
                  label="School Name"
                  value={edu.school}
                  onChange={(v) => {
                    const arr = [...formData.education];
                    arr[i] = { ...edu, school: v };
                    updateFormData({ education: arr });
                  }}
                />
                <Input
                  label="Degree/Certification"
                  value={edu.degree}
                  onChange={(v) => {
                    const arr = [...formData.education];
                    arr[i] = { ...edu, degree: v };
                    updateFormData({ education: arr });
                  }}
                />
                <Input
                  label="Year(s)"
                  value={edu.years}
                  onChange={(v) => {
                    const arr = [...formData.education];
                    arr[i] = { ...edu, years: v };
                    updateFormData({ education: arr });
                  }}
                />
                <TextArea
                  label="Description (optional)"
                  value={edu.description}
                  onChange={(v) => {
                    const arr = [...formData.education];
                    arr[i] = { ...edu, description: v };
                    updateFormData({ education: arr });
                  }}
                />
                <Button
                  kind="secondary"
                  onClick={() =>
                    updateFormData({ education: formData.education.filter((_, k) => k !== i) })
                  }
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
          <Button
            kind="primary"
            onClick={() =>
              updateFormData({
                education: [
                  ...formData.education,
                  { school: "", degree: "", years: "", description: "" },
                ],
              })
            }
            className="mt-4"
          >
            Add Education
          </Button>
        </Card>

        {/* Achievements & Awards Section */}
        <Card className="border border-orange-100">
          <h3 className="text-lg font-semibold text-orange-700 mb-4">Achievements & Awards</h3>
          <div className="space-y-6">
            {formData.achievements.map((ach, i) => (
              <Card key={i} className="bg-gray-50">
                <Input
                  label="Title"
                  value={ach.title}
                  onChange={(v) => {
                    const arr = [...formData.achievements];
                    arr[i] = { ...ach, title: v };
                    updateFormData({ achievements: arr });
                  }}
                />
                <Input
                  label="Year"
                  value={ach.year}
                  onChange={(v) => {
                    const arr = [...formData.achievements];
                    arr[i] = { ...ach, year: v };
                    updateFormData({ achievements: arr });
                  }}
                />
                <TextArea
                  label="Description"
                  value={ach.description}
                  onChange={(v) => {
                    const arr = [...formData.achievements];
                    arr[i] = { ...ach, description: v };
                    updateFormData({ achievements: arr });
                  }}
                />
                <Button
                  kind="secondary"
                  onClick={() =>
                    updateFormData({ achievements: formData.achievements.filter((_, k) => k !== i) })
                  }
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
          <Button
            kind="primary"
            onClick={() =>
              updateFormData({
                achievements: [
                  ...formData.achievements,
                  { title: "", year: "", description: "" },
                ],
              })
            }
            className="mt-4"
          >
            Add Achievement
          </Button>
        </Card>

        {/* Certifications Section */}
        <Card className="border border-teal-100">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">Certifications</h3>
          <div className="space-y-6">
            {formData.certifications.map((cert, i) => (
              <Card key={i} className="bg-gray-50">
                <Input
                  label="Certificate Name"
                  value={cert.name}
                  onChange={(v) => {
                    const arr = [...formData.certifications];
                    arr[i] = { ...cert, name: v };
                    updateFormData({ certifications: arr });
                  }}
                />
                <Input
                  label="Issuer"
                  value={cert.issuer}
                  onChange={(v) => {
                    const arr = [...formData.certifications];
                    arr[i] = { ...cert, issuer: v };
                    updateFormData({ certifications: arr });
                  }}
                />
                <Input
                  label="Year"
                  value={cert.year}
                  onChange={(v) => {
                    const arr = [...formData.certifications];
                    arr[i] = { ...cert, year: v };
                    updateFormData({ certifications: arr });
                  }}
                />
                <Button
                  kind="secondary"
                  onClick={() =>
                    updateFormData({ certifications: formData.certifications.filter((_, k) => k !== i) })
                  }
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
          <Button
            kind="primary"
            onClick={() =>
              updateFormData({
                certifications: [
                  ...formData.certifications,
                  { name: "", issuer: "", year: "" },
                ],
              })
            }
            className="mt-4"
          >
            Add Certification
          </Button>
        </Card>

        {/* Blog / Articles Section */}
        <Card className="border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">Blog / Articles</h3>
          <div className="space-y-6">
            {formData.blogArticles.map((article, i) => (
              <Card key={i} className="bg-gray-50">
                <Input
                  label="Title"
                  value={article.title}
                  onChange={(v) => {
                    const arr = [...formData.blogArticles];
                    arr[i] = { ...article, title: v };
                    updateFormData({ blogArticles: arr });
                  }}
                />
                <Input
                  label="Link"
                  value={article.link}
                  onChange={(v) => {
                    const arr = [...formData.blogArticles];
                    arr[i] = { ...article, link: v };
                    updateFormData({ blogArticles: arr });
                  }}
                />
                <TextArea
                  label="Summary"
                  value={article.summary}
                  onChange={(v) => {
                    const arr = [...formData.blogArticles];
                    arr[i] = { ...article, summary: v };
                    updateFormData({ blogArticles: arr });
                  }}
                />
                <Button
                  kind="secondary"
                  onClick={() =>
                    updateFormData({ blogArticles: formData.blogArticles.filter((_, k) => k !== i) })
                  }
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
          <Button
            kind="primary"
            onClick={() =>
              updateFormData({
                blogArticles: [
                  ...formData.blogArticles,
                  { title: "", link: "", summary: "" },
                ],
              })
            }
            className="mt-4"
          >
            Add Article
          </Button>
        </Card>

        {/* Featured Projects */}
        <Card className="border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">
            Featured Projects
          </h3>
          <div className="space-y-6">
            {formData.featuredProjects.map((fp, i) => (
              <Card key={i} className="bg-gray-50">
                <Input
                  label="Title"
                  value={fp.title}
                  onChange={(v) => {
                    const arr = [...formData.featuredProjects];
                    arr[i] = { ...fp, title: v };
                    updateFormData({ featuredProjects: arr });
                  }}
                />
                <Input
                  label="Link"
                  value={fp.link}
                  onChange={(v) => {
                    const arr = [...formData.featuredProjects];
                    arr[i] = { ...fp, link: v };
                    updateFormData({ featuredProjects: arr });
                  }}
                />
                <TextArea
                  label="Summary"
                  value={fp.summary}
                  onChange={(v) => {
                    const arr = [...formData.featuredProjects];
                    arr[i] = { ...fp, summary: v };
                    updateFormData({ featuredProjects: arr });
                  }}
                />
                <Button
                  kind="secondary"
                  onClick={() =>
                    updateFormData({
                      featuredProjects: formData.featuredProjects.filter(
                        (_, k) => k !== i
                      ),
                    })
                  }
                >
                  Remove
                </Button>
              </Card>
            ))}
          </div>
          <Button
            kind="primary"
            onClick={() =>
              updateFormData({
                featuredProjects: [
                  ...formData.featuredProjects,
                  { title: "", link: "", summary: "" },
                ],
              })
            }
            className="mt-4"
          >
            Add Featured Project
          </Button>
        </Card>
      </div>

      {/* Right Column - Preview */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Portfolio Preview
          </h3>
          <Button
            kind="primary"
            onClick={() => formData.slug && window.open(`/p/${formData.slug}`, "_blank")}
          >
            Open Public Page
          </Button>
        </div>
        <Card className="preview-card shadow-lg rounded-lg overflow-hidden">
          {formData.template === "modern" ? (
            <ModernPortfolio p={formData} />
          ) : (
            <MinimalPortfolio p={formData} />
          )}
        </Card>
      </div>
    </div>
  );
}

/* --- Sub Components --- */
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

function ModernPortfolio({ p }) {
  return (
    <div className="p-6 bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-200 pb-6">
        {p.profileImage && (
          <img
            src={p.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        )}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">{p.title}</h2>
          <p className="text-sm text-gray-500">/{p.slug || "(no-slug)"}</p>
          <p className="mt-2 text-gray-700">{p.bio}</p>
          <Socials s={p.socials} />
        </div>
      </div>

      {/* Grid for Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Skills */}
        {p.skills.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {p.skills.map((skill, i) => (
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
        {p.education.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Education</h3>
            <div className="space-y-4">
              {p.education.map((edu, i) => (
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
        {p.achievements.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">Achievements & Awards</h3>
            <div className="space-y-4">
              {p.achievements.map((ach, i) => (
                <div key={i} className="border-l-2 border-orange-200 pl-4">
                  <p className="font-medium">{ach.title} ({ach.year})</p>
                  <p className="text-gray-500 text-sm mt-1">{ach.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Certifications */}
        {p.certifications.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-teal-700 mb-4">Certifications</h3>
            <div className="space-y-4">
              {p.certifications.map((cert, i) => (
                <div key={i} className="border-l-2 border-teal-200 pl-4">
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-gray-600">{cert.issuer} ({cert.year})</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Blog / Articles */}
        {p.blogArticles.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Blog / Articles</h3>
            <div className="space-y-4">
              {p.blogArticles.map((article, i) => (
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
        {p.featuredProjects.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Featured Projects</h3>
            <div className="space-y-4">
              {p.featuredProjects.map((fp, i) => (
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
  );
}

function MinimalPortfolio({ p }) {
  return (
    <div className="p-6 bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-gray-200 pb-6">
        {p.profileImage && (
          <img
            src={p.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        )}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">{p.title}</h2>
          <p className="text-sm text-gray-500">/{p.slug || "(no-slug)"}</p>
          <p className="mt-2 text-gray-700">{p.bio}</p>
          <Socials s={p.socials} />
        </div>
      </div>

      {/* Grid for Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Skills */}
        {p.skills.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {p.skills.map((skill, i) => (
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
        {p.education.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Education</h3>
            <div className="space-y-4">
              {p.education.map((edu, i) => (
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
        {p.achievements.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">Achievements & Awards</h3>
            <div className="space-y-4">
              {p.achievements.map((ach, i) => (
                <div key={i} className="border-l-2 border-orange-200 pl-4">
                  <p className="font-medium">{ach.title} ({ach.year})</p>
                  <p className="text-gray-500 text-sm mt-1">{ach.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Certifications */}
        {p.achievements.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-teal-700 mb-4">Certifications</h3>
            <div className="space-y-4">
              {p.certifications.map((cert, i) => (
                <div key={i} className="border-l-2 border-teal-200 pl-4">
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-gray-600">{cert.issuer} ({cert.year})</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Blog / Articles */}
        {p.blogArticles.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Blog / Articles</h3>
            <div className="space-y-4">
              {p.blogArticles.map((article, i) => (
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
        {p.featuredProjects.length > 0 && (
          <Card className="bg-gray-50 shadow-md hover:shadow-lg transition rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">Featured Projects</h3>
            <div className="space-y-4">
              {p.featuredProjects.map((fp, i) => (
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
  );
}