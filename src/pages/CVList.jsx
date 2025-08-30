// src/pages/CVList.jsx
import React from "react";
import { useAuth } from "../modules/auth/AuthContext";
import useCVs from "../modules/data/useCVs";
import { Button, Card } from "../components/UI";
import { useNavigate } from "react-router-dom";

export default function CVList() {
  const { user } = useAuth();
  const cvs = useCVs(user.id);
  const nav = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your CVs</h2>
        <Button
          kind="primary"
          onClick={() => cvs.create({ title: "Untitled CV", sections: [] })}
        >
          + New CV
        </Button>
      </div>

      <div className="grid gap-4">
        {cvs.list.map((cv) => (
          <Card
            key={cv.id}
            className="cursor-pointer hover:shadow"
            onClick={() => nav(`/dashboard/cvs/${cv.id}`)}
          >
            <h3 className="text-lg font-semibold">{cv.title}</h3>
            <p className="text-sm text-gray-600">
              {cv.sections.length} sections
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
