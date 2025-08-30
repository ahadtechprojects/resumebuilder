// src/components/CVBuilder.jsx
import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CVBuilder() {
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    summary: "",
    photo: "",
    work: [{ jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" }],
    education: [{ degree: "", school: "", location: "", year: "", extra: "" }],
  });

  const [user, setUser] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    if (section) {
      const updated = [...formData[section]];
      updated[index][name] = value;
      setFormData({ ...formData, [section]: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addField = (section) => {
    const emptyField =
      section === "work"
        ? { jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" }
        : { degree: "", school: "", location: "", year: "", extra: "" };
    setFormData({ ...formData, [section]: [...formData[section], emptyField] });
  };

  const saveCV = async () => {
    if (!user) return alert("Please log in first.");
    const docRef = doc(db, "cvs", user.uid);
    await setDoc(docRef, { ...formData, userId: user.uid });
    alert("CV Saved Successfully!");
  };

  const downloadPDF = async () => {
    const element = previewRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.fullName || "my-cv"}.pdf`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-xl shadow-sm items-start">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <h2 className="md:col-span-2 font-bold text-lg">Personal Information</h2>
              <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="p-2 border rounded w-full" />
              <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} className="p-2 border rounded w-full" />
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="p-2 border rounded w-full md:col-span-2" />
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="p-2 border rounded w-full" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border rounded w-full" />
              <input type="text" name="website" placeholder="Website / LinkedIn" value={formData.website} onChange={handleChange} className="p-2 border rounded w-full md:col-span-2" />
            </div>

            {/* Photo Upload */}
            <div className="flex flex-col items-center justify-center space-y-2 mt-2 md:mt-0">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-24 h-24 object-cover rounded-full border" />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 border rounded-full">
                  <span className="text-xs text-gray-500">No Photo</span>
                </div>
              )}
              <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded flex items-center text-sm">
                Upload
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 border rounded-xl shadow-sm">
            <h2 className="font-bold text-lg mb-2">Professional Summary</h2>
            <textarea name="summary" placeholder="Write a short summary..." value={formData.summary} onChange={handleChange} className="w-full p-2 border rounded" rows="4" />
          </div>

          {/* Work Experience */}
          <div className="p-4 border rounded-xl shadow-sm">
            <h2 className="font-bold text-lg mb-2">Work Experience</h2>
            {formData.work.map((w, idx) => (
              <div key={idx} className="space-y-2 border-b pb-2 mb-2">
                <input type="text" name="jobTitle" placeholder="Job Title" value={w.jobTitle} onChange={(e) => handleChange(e, "work", idx)} className="w-full p-2 border rounded" />
                <input type="text" name="company" placeholder="Company" value={w.company} onChange={(e) => handleChange(e, "work", idx)} className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="location" placeholder="Location" value={w.location} onChange={(e) => handleChange(e, "work", idx)} className="p-2 border rounded w-full" />
                  <input type="text" name="startDate" placeholder="Start Date" value={w.startDate} onChange={(e) => handleChange(e, "work", idx)} className="p-2 border rounded w-full" />
                  <input type="text" name="endDate" placeholder="End Date" value={w.endDate} onChange={(e) => handleChange(e, "work", idx)} className="p-2 border rounded w-full" />
                </div>
                <textarea name="description" placeholder="Key responsibilities..." value={w.description} onChange={(e) => handleChange(e, "work", idx)} className="w-full p-2 border rounded" rows="3" />
              </div>
            ))}
            <button onClick={() => addField("work")} className="px-3 py-1 bg-blue-600 text-white rounded mt-2">
              + Add Work Experience
            </button>
          </div>

          {/* Education */}
          <div className="p-4 border rounded-xl shadow-sm">
            <h2 className="font-bold text-lg mb-2">Education</h2>
            {formData.education.map((ed, idx) => (
              <div key={idx} className="space-y-2 border-b pb-2 mb-2">
                <input type="text" name="degree" placeholder="Degree" value={ed.degree} onChange={(e) => handleChange(e, "education", idx)} className="w-full p-2 border rounded" />
                <input type="text" name="school" placeholder="School / University" value={ed.school} onChange={(e) => handleChange(e, "education", idx)} className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="location" placeholder="Location" value={ed.location} onChange={(e) => handleChange(e, "education", idx)} className="p-2 border rounded w-full" />
                  <input type="text" name="year" placeholder="Year" value={ed.year} onChange={(e) => handleChange(e, "education", idx)} className="p-2 border rounded w-full" />
                </div>
                <input type="text" name="extra" placeholder="Extra notes (e.g., Dissertation)" value={ed.extra} onChange={(e) => handleChange(e, "education", idx)} className="w-full p-2 border rounded" />
              </div>
            ))}
            <button onClick={() => addField("education")} className="px-3 py-1 bg-blue-600 text-white rounded mt-2">
              + Add Education
            </button>
          </div>

          <button onClick={saveCV} className="mt-4 w-full bg-green-600 text-white p-2 rounded-lg">
            Save CV
          </button>
          <button onClick={downloadPDF} className="mt-2 w-full bg-blue-600 text-white p-2 rounded-lg">
            Download as PDF
          </button>
        </div>

        {/* Right Side - Preview */}
        <div
          ref={previewRef}
          className="bg-yellow-900 text-white p-6 rounded-xl shadow-md overflow-y-auto max-h-screen"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{formData.fullName || "Your Name"}</h1>
              <p className="text-lg italic">{formData.jobTitle}</p>
              <p className="text-sm">{formData.location}</p>
              <p className="text-sm">
                {formData.phone} | {formData.email}
              </p>
              <p className="text-sm mb-4">{formData.website}</p>
            </div>

            {formData.photo && (
              <div className="mt-4 md:mt-0 md:ml-4 flex justify-center">
                <img src={formData.photo} alt="Profile" className="w-24 h-24 object-cover rounded-full border-2 border-white" />
              </div>
            )}
          </div>

          <h2 className="font-semibold border-b mt-4">Professional Summary</h2>
          <p className="text-sm mt-2 mb-4">{formData.summary}</p>

          <h2 className="font-semibold border-b mt-4">Work History</h2>
          {formData.work.map((w, idx) => (
            <div key={idx} className="mt-2">
              <p className="font-bold">{w.jobTitle} - {w.company}</p>
              <p className="text-sm italic">{w.location} ({w.startDate} - {w.endDate})</p>
              <p className="text-sm mb-4">{w.description}</p>
            </div>
          ))}

          <h2 className="font-semibold border-b mt-4">Education</h2>
          {formData.education.map((ed, idx) => (
            <div key={idx} className="mt-2">
              <p className="font-bold">{ed.degree}</p>
              <p className="text-sm italic">{ed.school}, {ed.location} ({ed.year})</p>
              <p className="text-sm">{ed.extra}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
