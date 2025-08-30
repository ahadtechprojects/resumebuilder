export const STORAGE_KEYS = {
  user: "airpb_user",
  resumes: "airpb_resumes",
  portfolios: "airpb_portfolios",
  users: "airpb_users"
};

export const uid = () => Math.random().toString(36).slice(2,10);

export function load(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw? JSON.parse(raw): fallback; }catch(e){ return fallback; }
}
export function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

export function mockAiSuggest(text, context=""){
  if (!text || !text.trim()) return "Delivered a measurable result using modern tools.";
  const verbs = ["Led","Built","Optimized","Implemented","Developed","Architected","Automated"];
  const outcomes = [
    "improving performance by 30%",
    "reducing load times by 1.5s",
    "boosting conversion by 12%",
    "reducing defects by 40%",
    "enhancing accessibility (WCAG 2.1)"
  ];
  const v = verbs[Math.floor(Math.random()*verbs.length)];
  const o = outcomes[Math.floor(Math.random()*outcomes.length)];
  return `${v} ${context || "a feature"} following best practices, ${o}.`;
}