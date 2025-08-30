// src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "../components/UI.jsx";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { doc, getDoc } from "firebase/firestore";
import { FaChevronDown } from "react-icons/fa";
import Footer from "../components/Footer.jsx";

export default function Landing() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [content, setContent] = useState(null);

  // Track expanded state per article
  const [expandedArticles, setExpandedArticles] = useState({});

  // ✅ Fetch landing content from Firestore
  useEffect(() => {
    async function fetchContent() {
      try {
        const ref = doc(db, "landingContent", "main");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setContent(snap.data());
        }
      } catch (err) {
        console.error("Error fetching landing content:", err);
      }
    }
    fetchContent();
  }, []);

  // ✅ Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking session...
      </div>
    );
  }

  // ================= Defaults =================
  const defaultStats = [
    { label: "Resumes Built", value: 5000 },
    { label: "Portfolios Published", value: 2000 },
    { label: "Success Stories", value: 1200 },
  ];

  const defaultPreviews = [
    {
      title: "Resume Preview",
      img: "/images/resume.jpg",
      desc: "Clean and ATS-friendly resume layouts designed to impress recruiters. Self-customizable, either start from scratch or use AI suggestions."
    },
    {
      title: "Portfolio Preview",
      img: "/images/portfolio.jpg",
      desc: "Showcase your work in an elegant online portfolio with a unique link."
    },
    {
      title: "CV Preview",
      img: "/images/cv.jpg",
      desc: "Comprehensive CV templates perfect for academic and professional use."
    },
  ];

  const defaultArticles = [
    {
      title: "How to Write a Winning CV",
      img: "/images/winning.jpg",
      desc: "A Curriculum Vitae (CV) isn’t just a summary of your career, it’s your professional story. Carefully crafted to capture the attention of recruiters and hiring managers. In today’s fast-paced job market, where employers receive hundreds of applications for a single role, a well-structured CV can be the difference between landing an interview or being overlooked. This article dives deep into what makes a CV stand out. You’ll learn how to structure your CV so that the most important information is impossible to miss, starting with a compelling profile statement that communicates who you are and what you bring to the table. We’ll discuss how to highlight your work experience with quantifiable results, the power of strong action verbs, and why tailoring your CV for each application dramatically improves your chances of success. Beyond content, presentation matters. We’ll explore formatting strategies that ensure your CV looks professional and is easy to scan, while also passing through Applicant Tracking Systems (ATS) that many employers use. You’ll also gain insight into which sections matter most in 2025; from showcasing relevant digital skills to adding certifications and projects that prove your adaptability. Whether you’re a fresh graduate trying to break into your industry or a seasoned professional aiming for your next step up, this guide gives you the practical tools and examples you need to write a winning CV that gets noticed.",
      link: "/articles"
    },
    {
      title: "Top Resume Mistakes to Avoid",
      img: "/images/mistakes.jpg",
      desc: "A resume should be your golden ticket into the job market but far too often, candidates sabotage themselves with avoidable errors. Recruiters spend only a few seconds scanning a resume, and small mistakes can lead to instant rejection. This article uncovers the most common resume mistakes that applicants make and provides actionable solutions to correct them. We’ll start with the basics: typos, spelling errors, and poor grammar mistakes that instantly signal carelessness. But beyond the obvious, we’ll dive into deeper issues such as generic job descriptions that don’t highlight achievements, overloading the resume with irrelevant details, and choosing flashy designs that sacrifice readability. You’ll also learn why keyword optimization matters more than ever in 2025, as automated systems often filter out resumes that lack role-specific terms. The article further highlights mistakes that might not seem obvious: using outdated formats, listing personal details that are no longer necessary, or even making the resume too long. We’ll also show how failing to align your resume with your LinkedIn profile or portfolio can create red flags for recruiters. Each mistake will be paired with tips on how to avoid it, ensuring that your resume communicates clarity, professionalism, and impact. By the end, you’ll understand not just what to cut out, but how to craft a resume that truly reflects your value and potential.",
      link: "/articles"
    },
    {
      title: "Why Portfolios Matter in 2025",
      img: "/images/important.jpg",
      desc: "In the past, a resume and cover letter might have been enough to secure a job but in 2025, portfolios have become a critical part of the hiring process. Employers, clients, and recruiters want to see not just what you say you can do, but tangible proof of your skills, creativity, and problem-solving ability. This article explains why having a strong portfolio is no longer optional, no matter your profession. We’ll explore how portfolios go beyond static resumes by providing real-world evidence of your abilities. For creative professional designers, writers, photographers portfolios showcase originality and style. For tech specialist developers, data analysts, engineers-portfolios. Highlight projects, code samples, and problem-solving approaches. Even in industries like business, healthcare, or education, portfolios can demonstrate case studies, research, and tangible results from your work. This article also breaks down the essential components of a modern portfolio: a clean and user-friendly design, carefully selected projects that align with the roles you’re pursuing, and clear explanations of your contributions and outcomes. We’ll discuss why an online portfolio or personal website is a game-changer in 2025, allowing recruiters and clients to find you 24/7, and how integrating testimonials or endorsements adds credibility. By the end, you’ll see how a strong portfolio doesn’t just complement your CV and resume, it elevates them. It turns your application into a living showcase of your potential, helping you stand out in an increasingly competitive market. Whether you’re entering the workforce, freelancing, or aiming for a career shift, your portfolio will be your strongest ally in proving you’re the right choice.",
      link: "/articles"
    },
  ];

  const defaultTestimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      quote: "This platform helped me craft a professional resume in minutes. I landed my dream job!"
    },
    {
      name: "David Kim",
      role: "Software Engineer",
      quote: "The AI suggestions were spot on. My resume looks clean and polished now."
    },
    {
      name: "Emily Carter",
      role: "Graduate Student",
      quote: "I love the portfolio feature. It made showcasing my projects so easy!"
    },
  ];

  const defaultFeatures = [
    "✓ AI phrasing suggestions for experience bullets",
    "✓ 2+ resume templates & 2+ portfolio themes",
    "✓ Print to PDF",
    "✓ Public portfolio link with custom slug",
  ];

  // ================= Merge Firestore + Defaults =================
  const stats = [...defaultStats, ...(content?.stats || [])];
  const previews = [...defaultPreviews, ...(content?.previews || [])];
  const articles = [...defaultArticles, ...(content?.articles || [])];
  const testimonials = [...defaultTestimonials, ...(content?.testimonials || [])];
  const features = [...defaultFeatures, ...(content?.features || [])];

  return (
    <div className="flex flex-col">
      {/* ================= Hero Section ================= */}
      <div className="container mx-auto max-w-7xl p-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center animate-fade-in">
        {/* Left Section */}
        <div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            {content?.heroTitle || "Craft a Standout Resume & Portfolio in Minutes"}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {content?.heroSubtitle ||
              "AI-assisted bullet points, beautiful templates, one-click PDF, and a shareable portfolio link."}
          </p>
          <div className="flex gap-4 mb-10">
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="button-primary"
            >
              {content?.ctaPrimary || "Build Your Resume"}
            </Link>
            <Button kind="default" onClick={() => (window.location.hash = "features")}>
              {content?.ctaSecondary || "See Features"}
            </Button>
          </div>

          {/* Features */}
          <ul id="features" className="space-y-2 text-gray-700 font-medium">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        {/* Right Section - Mock Preview Card */}
        <Card className="preview-card">
          <div className="grid gap-4">
            <div className="h-3 w-32 bg-primary-dark rounded"></div>
            <div className="h-6 w-60 bg-gray-300 rounded"></div>
            <div className="h-40 border border-gray-200 rounded-xl"></div>
            <div className="flex gap-3">
              <div className="h-20 flex-1 border border-gray-200 rounded-xl"></div>
              <div className="h-20 flex-1 border border-gray-200 rounded-xl"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* ================= Stats ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow">
              <p className="text-4xl font-bold text-blue-600">
                <CountUp end={stat.value} duration={3} separator="," />+
              </p>
              <p className="mt-2 text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Previews ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Preview What You’ll Get</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {previews.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <img src={item.img} alt={item.title} className="w-full h-50 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= Articles ================= */}
      <section className="bg-gray-100 py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Articles</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {articles.map((a, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition">
              <img
                src={a.img}
                alt="Article"
                className="rounded-xl mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{a.title}</h3>

              <AnimatePresence initial={false}>
                <motion.p
                  key={expandedArticles[i] ? "expanded" : "collapsed"}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-gray-600 text-sm mb-3 overflow-hidden"
                >
                  {expandedArticles[i]
                    ? a.desc
                    : a.desc.slice(0, 100) + (a.desc.length > 100 ? "..." : "")}
                </motion.p>
              </AnimatePresence>

              {a.desc.length > 100 && (
                <button
                  onClick={() =>
                    setExpandedArticles((prev) => ({
                      ...prev,
                      [i]: !prev[i], // toggle only clicked article
                    }))
                  }
                  className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
                >
                  {expandedArticles[i] ? "Show Less" : "Read More"}
                  <FaChevronDown
                    className={`transition-transform duration-300 ${
                      expandedArticles[i] ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* ================= Testimonials ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-gray-600 italic mb-4">“{t.quote}”</p>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
