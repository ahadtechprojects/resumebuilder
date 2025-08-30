import { React, useMemo, useState, useEffect } from "react";
import { load, save, uid, STORAGE_KEYS } from "../core/storage.js";

const emptyResume = () => ({
  id: uid(), ownerId: "", title: "New Resume", template: "classic",
  basics: { fullName:"", headline:"", email:"", phone:"", location:"", website:"", summary:"" },
  experience: [ { id: uid(), role:"", company:"", start:"", end:"", bullets:[""] } ],
  education: [ { id: uid(), school:"", degree:"", start:"", end:"" } ],
  skills: ["React","Node.js","CSS"],
  projects: [ { id: uid(), name:"", link:"", description:"" } ],
  updatedAt: Date.now()
});

export default function useResumes(userId){
  const [resumes, setResumes] = useState(()=> load(STORAGE_KEYS.resumes, []));
  useEffect(()=> save(STORAGE_KEYS.resumes, resumes),[resumes]);

  const list = useMemo(()=> resumes.filter(r=>r.ownerId===userId),[resumes,userId]);
  const create = ()=>{ const r = { ...emptyResume(), ownerId:userId, title:`Resume ${list.length+1}` }; setResumes(p=>[r,...p]); return r.id; };
  const update = (id, patch)=> setResumes(p=> p.map(r=> r.id===id? { ...r, ...patch, updatedAt: Date.now()}: r));
  const remove = (id)=> setResumes(p=> p.filter(r=> r.id!==id));
  const get = (id)=> resumes.find(r=> r.id===id);

  return { list, create, update, remove, get, all: resumes };
}