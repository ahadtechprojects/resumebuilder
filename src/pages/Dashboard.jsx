import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import useResumes from "../modules/data/useResume.js";
import usePortfolios from "../modules/data/usePortfolios.js";
import useCVs from "../modules/data/useCVs.js";
import { Card, Button } from "../components/UI.jsx";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const resumes = useResumes(user?.id);
  const portfolios = usePortfolios(user?.id);
  const cvs = useCVs(user?.id);

  if (!user) return <div className="text-center text-gray-500 mt-20 animate-fade-in">Loading...</div>;

  const handleDeleteCV = async (id) => {
    toast(
      <div>
        <p>Are you sure you want to delete this CV?</p>
        <div className="flex gap-2">
          <Button
            kind="secondary"
            onClick={async () => {
              console.log("Confirmed deletion for CV ID:", id);
              try {
                await cvs.remove(id);
                toast.success("CV deleted successfully!");
              } catch (err) {
                console.error("Error deleting CV:", err);
                toast.error("Error deleting CV: " + err.message);
              }
              toast.dismiss();
            }}
          >
            Yes
          </Button>
          <Button kind="default" onClick={() => toast.dismiss()}>
            No
          </Button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleDeleteResume = async (id) => {
    toast(
      <div>
        <p>Are you sure you want to delete this resume?</p>
        <div className="flex gap-2">
          <Button
            kind="secondary"
            onClick={async () => {
              console.log("Confirmed deletion for Resume ID:", id);
              try {
                await resumes.remove(id);
                toast.success("Resume deleted successfully!");
              } catch (err) {
                console.error("Error deleting resume:", err);
                toast.error("Error deleting resume: " + err.message);
              }
              toast.dismiss();
            }}
          >
            Yes
          </Button>
          <Button kind="default" onClick={() => toast.dismiss()}>
            No
          </Button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleDeletePortfolio = async (id) => {
    toast(
      <div>
        <p>Are you sure you want to delete this portfolio?</p>
        <div className="flex gap-2">
          <Button
            kind="secondary"
            onClick={async () => {
              console.log("Confirmed deletion for Portfolio ID:", id);
              try {
                await portfolios.remove(id);
                toast.success("Portfolio deleted successfully!");
              } catch (err) {
                console.error("Error deleting portfolio:", err);
                toast.error("Error deleting portfolio: " + err.message);
              }
              toast.dismiss();
            }}
          >
            Yes
          </Button>
          <Button kind="default" onClick={() => toast.dismiss()}>
            No
          </Button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header Section */}
      <section className="flex flex-col sm:flex-row justify-between items-center mb-10 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800">Your AI-Powered Workspace</h2>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
          <Button
            kind="primary"
            onClick={async () => {
              try {
                const id = await resumes.create();
                nav(`/builder/resume/${id}`);
              } catch (err) {
                toast.error("Error creating resume: " + err.message);
              }
            }}
          >
            New Resume
          </Button>
          <Button
            kind="primary"
            onClick={async () => {
              try {
                const id = await portfolios.create();
                nav(`/builder/portfolio/${id}`);
                toast.success("New portfolio created!");
              } catch (err) {
                toast.error("Error creating portfolio: " + err.message);
              }
            }}
          >
            New Portfolio
          </Button>
          <Button
            kind="primary"
            onClick={async () => {
              try {
                const id = await cvs.create();
                nav(`/builder/cv/${id}`);
                toast.success("New CV created!");
              } catch (err) {
                toast.error("Error creating CV: " + err.message);
              }
            }}
          >
            New CV
          </Button>
        </div>
      </section>

      {/* Resumes Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Resumes</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.list.length === 0 && (
            <Card className="text-gray-500">No resumes yet</Card>
          )}
          {resumes.list.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="font-semibold text-lg text-gray-800">{r.title}</div>
                  <div className="text-gray-500 text-sm mt-1">Template: {r.template}</div>
                </div>
                <span className="text-gray-400 text-xs mt-4">
                  {new Date(r.updatedAt?.toDate?.() || r.updatedAt).toLocaleString()}
                </span>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button kind="primary" onClick={() => nav(`/builder/resume/${r.id}`)}>Edit</Button>
                  <Button kind="default" onClick={() => window.print()}>PDF</Button>
                  <Button
                    kind="secondary"
                    onClick={() => {
                      console.log("Delete button clicked for Resume ID:", r.id);
                      handleDeleteResume(r.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Portfolios Section */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Portfolios</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolios.list.length === 0 && (
            <Card className="text-gray-500">No portfolios yet</Card>
          )}
          {portfolios.list.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="font-semibold text-lg text-gray-800">{p.title}</div>
                  <div className="text-gray-500 text-sm mt-1">/{p.slug || "(no-slug)"}</div>
                </div>
                <span className="text-gray-400 text-xs mt-4">
                  {new Date(p.updatedAt?.toDate?.() || p.updatedAt).toLocaleString()}
                </span>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button kind="primary" onClick={() => nav(`/builder/portfolio/${p.id}`)}>Edit</Button>
                  <Button
                    kind="default"
                    onClick={() => p.slug && window.open(`/p/${p.slug}`, "_blank")}
                  >
                    View
                  </Button>
                  <Button
                    kind="secondary"
                    onClick={() => {
                      console.log("Delete button clicked for Portfolio ID:", p.id);
                      handleDeletePortfolio(p.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CVs Section */}
      <section>
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">CVs</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cvs.list.length === 0 && (
            <Card className="text-gray-500">No CVs yet</Card>
          )}
          {cvs.list.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="font-semibold text-lg text-gray-800">{c.title}</div>
                  <div className="text-gray-500 text-sm mt-1">Format: {c.format || "default"}</div>
                </div>
                <span className="text-gray-400 text-xs mt-4">
                  {new Date(c.updatedAt?.toDate?.() || c.updatedAt).toLocaleString()}
                </span>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button kind="primary" onClick={() => nav(`/builder/cv/${c.id}`)}>Edit</Button>
                  <Button kind="default" onClick={() => window.print()}>PDF</Button>
                  <Button
                    kind="secondary"
                    onClick={() => {
                      console.log("Delete button clicked for CV ID:", c.id);
                      handleDeleteCV(c.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}