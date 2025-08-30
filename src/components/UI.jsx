import React from "react";

// Card Component
export const Card = React.memo(({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-2xl border border-gray-200 p-4 ${className}`}
    >
      {children}
    </div>
  );
});

// Button Component
export const Button = React.memo(({ children, onClick, kind = "default", className = "" }) => {
  const base =
    "px-4 py-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    default:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[kind]} ${className}`}>
      {children}
    </button>
  );
});

// Input Component
export const Input = React.memo(({ label, value, onChange, type = "text", className = "" }) => {
  return (
    <label className="grid gap-2 w-full">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${className}`}
      />
    </label>
  );
});

// TextArea Component
export const TextArea = React.memo(({ label, value, onChange, rows = 4, className = "" }) => {
  return (
    <label className="grid gap-2 w-full">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${className}`}
      />
    </label>
  );
});

// Tabs Component
export const Tabs = React.memo(({ value, onChange, items }) => {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              value === it.id
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
});

// TagEditor Component
export const TagEditor = React.memo(({ value, onChange }) => {
  const [text, setText] = React.useState("");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
          >
            {t}
            <button
              onClick={() => onChange(value.filter((_, k) => k !== i))}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Add a skill"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          onClick={() => {
            if (text.trim()) {
              onChange([...value, text.trim()]);
              setText("");
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
});

// Modal Component
export const Modal = React.memo(({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
});