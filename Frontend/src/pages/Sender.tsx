import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSender, getAllSenders } from "../services/sender.service";
import { getCurrentUser } from "../services/auth.service";

import type { User } from "../types/auth";
import type { Sender } from "../types/sender";

const SenderPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const [senders, setSenders] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadSenders = async () => {
    try {
      setLoading(true);
      setError("");

      const [userResponse, senderResponse] = await Promise.all([
        getCurrentUser(),
        getAllSenders(),
      ]);

      setUser(userResponse.user);
      setSenders(senderResponse.senders || []);
    } catch (error) {
      console.error(error);
      setError("Failed to load senders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSenders();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createSender({
        name,
        email,
        smtpUser,
        smtpPassword,
      });

      setName("");
      setEmail("");
      setSmtpUser("");
      setSmtpPassword("");

      setShowForm(false);

      await loadSenders();
    } catch (error) {
      console.error(error);
      setError("Failed to create sender");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="h-[70px] border-b border-gray-200 flex items-center justify-between px-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Dashboard
        </button>

        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700"
        >
          Add Sender
        </button>
      </header>
      <main className="max-w-[1000px] mx-auto px-8 py-8">
        <h1 className="text-2xl font-semibold">Senders</h1>

        <p className="text-sm text-gray-400 mt-1">
          Manage your email sending accounts
        </p>
        {error && (
          <div className="mt-5 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">
            Loading senders...
          </div>
        ) : senders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500">No senders added yet.</p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-5 px-5 py-2 bg-green-600 text-white rounded-full text-sm"
            >
              Add Your First Sender
            </button>
          </div>
        ) : (
          <div className="mt-8 border border-gray-100 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 px-5 py-3 bg-gray-50 text-xs text-gray-400">
              <span>Name</span>
              <span>Email</span>
              <span>SMTP User</span>
            </div>

            {senders.map((sender) => (
              <div
                key={sender.id}
                className="grid grid-cols-3 px-5 py-4 border-t border-gray-100"
              >
                <span className="text-sm text-gray-700">{sender.name}</span>

                <span className="text-sm text-gray-600">{sender.email}</span>

                <span className="text-sm text-gray-500">{sender.smtpUser}</span>
              </div>
            ))}
          </div>
        )}
      </main>
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-[450px] bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Add Sender</h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sender name"
                required
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm outline-none"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm outline-none"
              />

              <input
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="SMTP username"
                required
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm outline-none"
              />

              <input
                type="password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                placeholder="SMTP password"
                required
                className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm outline-none"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full h-10 bg-green-600 text-white rounded-full text-sm disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Sender"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SenderPage;
