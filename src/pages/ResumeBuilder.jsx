import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import useResumes from "../modules/data/useResume.js";
import { Card, Input, TextArea, Tabs, TagEditor, Button, Modal } from "../components/UI.jsx";
import { toast } from "react-toastify";
import { mockAiSuggest } from "../modules/core/storage.js";

export default function ResumeBuilder() {
  const { id } = useParams();
  const { user } = useAuth();
  const resumes = useResumes(user?.id);
  const nav = useNavigate();
  const r = resumes.get(id);
  const [tab, setTab] = React.useState("content");
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const resumeRef = React.useRef(null);

  React.useEffect(() => { if (!r) nav("/dashboard"); }, [r, nav]);
  if (!r) return null;

  function updateBasics(k, v) {
    try {
      resumes.update(r.id, { basics: { ...r.basics, [k]: v } });
    } catch (err) {
      toast.error("Error updating resume: " + err.message);
    }
  }

  function updateField(path, value) {
    try {
      resumes.update(r.id, { [path]: value });
    } catch (err) {
      toast.error("Error updating resume: " + err.message);
    }
  }

  function updateArray(path, arr, i, newItem) {
    const newArr = [...arr];
    newArr[i] = newItem;
    updateField(path, newArr);
  }

  async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const element = resumeRef.current;

    try {
      const canvas = await window.html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (pdfHeight > doc.internal.pageSize.getHeight()) {
        const scaleFactor = doc.internal.pageSize.getHeight() / pdfHeight;
        doc.addImage(imgData, "PNG", 0, 0, pdfWidth * scaleFactor, pdfHeight * scaleFactor);
      } else {
        doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      doc.save(`${r.title || "resume"}.pdf`);
      setIsPreviewOpen(false);
    } catch (err) {
      toast.error("Error generating PDF: " + err.message);
    }
  }

  return (
    <div className="container mx-auto max-w-7xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left editor */}
      <div className="space-y-4">
        <div className="flex justify-between items-center animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800">Editing: {r.title}</h2>
          <div className="flex items-center gap-2">
            <select
              className="select-field"
              value={r.template}
              onChange={(e) => updateField("template", e.target.value)}
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>
            <Button kind="default" onClick={() => setIsPreviewOpen(true)}>
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="border border-blue-100 max-w-full">
          <Tabs
            className="max-w-full"
            value={tab}
            onChange={setTab}
            items={[
              { id: "content", label: "Content" },
              { id: "experience", label: "Experience" },
              { id: "education", label: "Education" },
              { id: "skills", label: "Skills" },
              { id: "projects", label: "Projects" },
            ]}
          />

          {/* Basics */}
          {tab === "content" && (
            <div className="grid gap-4 mt-4">
              <Input label="Full name" value={r.basics.fullName} onChange={(v) => updateBasics("fullName", v)} />
              <Input label="Headline" value={r.basics.headline} onChange={(v) => updateBasics("headline", v)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Email" value={r.basics.email} onChange={(v) => updateBasics("email", v)} />
                <Input label="Phone" value={r.basics.phone} onChange={(v) => updateBasics("phone", v)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Location" value={r.basics.location} onChange={(v) => updateBasics("location", v)} />
                <Input label="Website" value={r.basics.website} onChange={(v) => updateBasics("website", v)} />
              </div>
              <TextArea
                label="Summary"
                value={r.basics.summary}
                onChange={(v) => updateBasics("summary", v)}
                rows={4}
              />
            </div>
          )}

          {/* Experience */}
          {tab === "experience" && (
            <div className="grid gap-4 mt-4">
              {r.experience.map((x, i) => (
                <Card key={x.id} className="bg-gray-50 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Input label="Role" value={x.role} onChange={(v) => updateArray("experience", r.experience, i, { ...x, role: v })} />
                    <Input label="Company" value={x.company} onChange={(v) => updateArray("experience", r.experience, i, { ...x, company: v })} />
                    <Input label="Start" value={x.start} onChange={(v) => updateArray("experience", r.experience, i, { ...x, start: v })} />
                    <Input label="End" value={x.end} onChange={(v) => updateArray("experience", r.experience, i, { ...x, end: v })} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <b>Bullets</b>
                      <Button kind="primary" onClick={() => updateArray("experience", r.experience, i, { ...x, bullets: [...x.bullets, ""] })}>
                        Add
                      </Button>
                    </div>
                    {x.bullets.map((b, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <input
                          className="input-field flex-1"
                          value={b}
                          onChange={(e) => {
                            const bl = [...x.bullets];
                            bl[j] = e.target.value;
                            updateArray("experience", r.experience, i, { ...x, bullets: bl });
                          }}
                        />
                        <Button
                          kind="default"
                          onClick={() => {
                            const suggestion = mockAiSuggest(b, `${x.role} at ${x.company}`);
                            const bl = [...x.bullets];
                            bl[j] = suggestion;
                            updateArray("experience", r.experience, i, { ...x, bullets: bl });
                          }}
                        >
                          AI
                        </Button>
                        <Button
                          kind="secondary"
                          onClick={() => {
                            const bl = x.bullets.filter((_, k) => k !== j);
                            updateArray("experience", r.experience, i, { ...x, bullets: bl });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <Button
                      kind="secondary"
                      onClick={() => updateField("experience", r.experience.filter((_, k) => k !== i))}
                    >
                      Delete experience
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                kind="primary"
                onClick={() =>
                  updateField("experience", [...r.experience, { id: crypto.randomUUID?.() ?? Math.random(), role: "", company: "", start: "", end: "", bullets: [""] }])
                }
              >
                Add Experience
              </Button>
            </div>
          )}

          {/* Education */}
          {tab === "education" && (
            <div className="grid gap-3 mt-4">
              {r.education.map((ed, i) => (
                <Card key={ed.id} className="bg-gray-50 grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                  <Input label="School" value={ed.school} onChange={(v) => updateArray("education", r.education, i, { ...ed, school: v })} />
                  <Input label="Degree" value={ed.degree} onChange={(v) => updateArray("education", r.education, i, { ...ed, degree: v })} />
                  <Input label="Start" value={ed.start} onChange={(v) => updateArray("education", r.education, i, { ...ed, start: v })} />
                  <Input label="End" value={ed.end} onChange={(v) => updateArray("education", r.education, i, { ...ed, end: v })} />
                  <Button kind="secondary" onClick={() => updateField("education", r.education.filter((_, k) => k !== i))}>Delete</Button>
                </Card>
              ))}
              <Button kind="primary" onClick={() => updateField("education", [...r.education, { id: crypto.randomUUID?.() ?? Math.random(), school: "", degree: "", start: "", end: "" }])}>
                Add Education
              </Button>
            </div>
          )}

          {/* Skills */}
          {tab === "skills" && (
            <div className="mt-4">
              <TagEditor value={r.skills} onChange={(arr) => updateField("skills", arr)} />
            </div>
          )}

          {/* Projects */}
          {tab === "projects" && (
            <div className="grid gap-4 mt-4">
              {r.projects.map((pr, i) => (
                <Card key={pr.id} className="bg-gray-50 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Project name" value={pr.name} onChange={(v) => updateArray("projects", r.projects, i, { ...pr, name: v })} />
                    <Input label="Link" value={pr.link} onChange={(v) => updateArray("projects", r.projects, i, { ...pr, link: v })} />
                  </div>
                  <TextArea label="Description" value={pr.description} onChange={(v) => updateArray("projects", r.projects, i, { ...pr, description: v })} />
                  <div className="text-right">
                    <Button kind="secondary" onClick={() => updateField("projects", r.projects.filter((_, k) => k !== i))}>
                      Delete project
                    </Button>
                  </div>
                </Card>
              ))}
              <Button kind="primary" onClick={() => updateField("projects", [...r.projects, { id: crypto.randomUUID?.() ?? Math.random(), name: "", link: "", description: "" }])}>
                Add Project
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Right live preview */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
          <span className="text-sm text-gray-500">Template: {r.template}</span>
        </div>
        <Card className="preview-card">
          {r.template === "classic" ? <ClassicResume r={r} /> : <ModernResume r={r} />}
        </Card>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Resume Preview"
      >
        <div ref={resumeRef} className="p-4 bg-gray-50 rounded-xl">
          {r.template === "classic" ? <ClassicResume r={r} /> : <ModernResume r={r} />}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button kind="primary" onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button kind="secondary" onClick={() => setIsPreviewOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

/* ------- Helpers ------- */
function Section({ title, children }) {
  return (
    <section className="mb-4">
      <h4 className="uppercase tracking-wider text-xs text-gray-500 mb-1">{title}</h4>
      <div>{children}</div>
    </section>
  );
}

function ClassicResume({ r }) {
  return (
    <div className="text-gray-800">
      <h2 className="text-2xl font-bold">{r.basics.fullName || "Your Name"}</h2>
      <div className="text-blue-600 font-medium">{r.basics.headline}</div>
      <div className="text-sm text-gray-500">
        {r.basics.email} • {r.basics.phone} • {r.basics.location} • {r.basics.website}
      </div>

      {r.basics.summary && (
        <Section title="Summary">
          <p>{r.basics.summary}</p>
        </Section>
      )}
      <Section title="Experience">
        {r.experience.map((x) => (
          <div key={x.id} className="mb-2">
            <b>{x.role || "Role"}</b> — {x.company || "Company"} <span className="text-gray-500">({x.start} – {x.end})</span>
            <ul className="list-disc list-inside text-sm">
              {x.bullets.filter(Boolean).map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
      <Section title="Projects">
        {r.projects.map((p) => (
          <div key={p.id} className="mb-1">
            <b>{p.name || "Project"}</b> —{" "}
            <a className="link" href={p.link} target="_blank" rel="noreferrer">
              {p.link}
            </a>
            <div>{p.description}</div>
          </div>
        ))}
      </Section>
      <Section title="Skills">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {r.skills.map((s, i) => (
            <span key={i} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>{s}</span>
          ))}
        </div>
      </Section>
      <Section title="Education">
        {r.education.map((e) => (
          <div key={e.id}>
            {e.degree} — {e.school} <span className="text-gray-500">({e.start} – {e.end})</span>
          </div>
        ))}
      </Section>
    </div>
  );
}

function ModernResume({ r }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
      <div>
        <h2 className="text-2xl font-bold">{r.basics.fullName || "Your Name"}</h2>
        <div className="text-blue-600 font-medium">{r.basics.headline}</div>
        <Section title="Summary"><p>{r.basics.summary}</p></Section>
        <Section title="Experience">
          {r.experience.map((x) => (
            <Card key={x.id} className="bg-gray-50 mb-2">
              <b>{x.role || "Role"}</b> @ {x.company || "Company"}
              <div className="text-sm text-gray-500">{x.start} – {x.end}</div>
              <ul className="list-disc list-inside text-sm">
                {x.bullets.filter(Boolean).map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </Card>
          ))}
        </Section>
      </div>
      <div>
        <Section title="Contact">
          <div className="space-y-1 text-sm">
            <div>{r.basics.email}</div>
            <div>{r.basics.phone}</div>
            <div>{r.basics.location}</div>
            {r.basics.website && (
              <a className="link" href={r.basics.website} target="_blank" rel="noreferrer">
                {r.basics.website}
              </a>
            )}
          </div>
        </Section>
        <Section title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {r.skills.map((s, i) => (
              <span key={i} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>{s}</span>
            ))}
          </div>
        </Section>
        <Section title="Projects">
          {r.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <b>{p.name}</b> —{" "}
              <a className="link" href={p.link} target="_blank" rel="noreferrer">{p.link}</a>
              <div>{p.description}</div>
            </div>
          ))}
        </Section>
        <Section title="Education">
          {r.education.map((e) => (
            <div key={e.id}>
              {e.degree} — {e.school} <span className="text-gray-500">({e.start} – {e.end})</span>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}