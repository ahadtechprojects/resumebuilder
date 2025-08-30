import React from "react";
import { load, save, STORAGE_KEYS } from "../modules/core/storage.js";
import { useAuth } from "../modules/auth/AuthContext.jsx";

export default function Admin() {
  const { user, updateRole } = useAuth();
  const [users, setUsers] = React.useState(() =>
    load(STORAGE_KEYS.users, [])
  );

  React.useEffect(() => {
    save(STORAGE_KEYS.users, users);
  }, [users]);

  if (user.role !== "admin")
    return (
      <div className="max-w-xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold text-red-600">Admins Only</h2>
        <p className="text-gray-500 mt-2">
          Login with <b>admin@demo.com</b> to access.
        </p>
      </div>
    );

  function setRole(id, role) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
    updateRole(id, role);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2">Admin Panel</h2>
      <p className="text-gray-600 mb-6">
        Manage user roles (mock data).
      </p>

      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Role</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr
                key={u.id}
                className={`border-b hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 font-medium text-gray-800">{u.name}</td>
                <td className="py-3 px-4 text-gray-600">{u.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                    value={u.role}
                    onChange={(e) => setRole(u.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
