import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "../services/auth.service";
import { getAllSenders } from "../services/sender.service";
import { createCampaign } from "../services/campaign.service";
import { createBulkEmailJobs } from "../services/email.service";

import type { User } from "../types/auth";
import type { Sender } from "../types/sender";

const ComposeEmail = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [senders, setSenders] = useState<Sender[]>([]);

  const [senderId, setSenderId] = useState("");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [recipients, setRecipients] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [singleRecipient, setSingleRecipient] = useState("");

  const [startAt, setStartAt] = useState("");

  const [delaySeconds, setDelaySeconds] = useState(2);
  const [hourlyLimit, setHourlyLimit] = useState(50);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [userResponse, senderResponse] = await Promise.all([
        getCurrentUser(),
        getAllSenders(),
      ]);

      setUser(userResponse.user);

      const senderList = senderResponse.senders || [];

      setSenders(senderList);

      if (senderList.length > 0) {
        setSenderId(senderList[0].id);
      }
    } catch (error) {
      console.error("Load compose data error:", error);
      setError("Failed to load sender information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addSingleRecipient = () => {
    const email = singleRecipient.trim();

    if (!email) {
      setError("Please enter a recipient email.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (recipients.includes(email)) {
      setError("This email is already added.");
      return;
    }

    setRecipients((prev) => [...prev, email]);

    setSingleRecipient("");
    setError("");
  };

  // single recipent
  const handleRecipientKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSingleRecipient();
    }
  };

  // and add bulk recipient

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setCsvFile(file);
    setError("");

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = String(e.target?.result || "");

      const emails = text
        .split(/[\n,\r]+/)
        .map((item) => item.trim())
        .filter((item) => isValidEmail(item));

      if (emails.length === 0) {
        setError("No valid email addresses found in the file.");
        return;
      }

      setRecipients((prev) => {
        return [...new Set([...prev, ...emails])];
      });

      setError("");
    };

    reader.readAsText(file);
    event.target.value = "";
  };
  const removeRecipient = (email: string) => {
    setRecipients((prev) => prev.filter((item) => item !== email));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!user?.id) {
        setError("User not found. Please login again.");
        return;
      }

      if (!senderId) {
        setError("Please select a sender.");
        return;
      }

      if (!subject.trim()) {
        setError("Please enter a subject.");
        return;
      }

      if (!body.trim()) {
        setError("Please enter email body.");
        return;
      }

      if (recipients.length === 0) {
        setError("Please add at least one recipient.");
        return;
      }

      if (!startAt) {
        setError("Please select a start time.");
        return;
      }
      const campaignResponse = await createCampaign({
        userId: user.id,
        senderId,
        subject: subject.trim(),
        body: body.trim(),
        startAt: new Date(startAt).toISOString(),
        delaySeconds: Number(delaySeconds),
        hourlyLimit: Number(hourlyLimit),
      });

      const campaign = campaignResponse.campaign;

      if (!campaign?.id) {
        throw new Error("Campaign was not created.");
      }
      await createBulkEmailJobs({
        campaignId: campaign.id,
        recipients,
      });
      alert(`${recipients.length} emails scheduled successfully!`);

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Schedule email error:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to schedule emails",
      );
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <header className="h-[70px] border-b border-gray-200 flex items-center justify-between px-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Dashboard
        </button>

        <h1 className="text-lg font-medium">Compose New Email</h1>

        <div className="w-[100px]" />
      </header>
      <main className="max-w-[900px] mx-auto px-8 py-8">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="border border-gray-100 rounded-xl p-8"
        >
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">Sender</label>

            {senders.length === 0 ? (
              <div className="border border-yellow-200 bg-yellow-50 rounded-md p-4">
                <p className="text-sm text-yellow-700">
                  No sender account found.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/senders")}
                  className="mt-2 text-sm text-green-600"
                >
                  Add Sender →
                </button>
              </div>
            ) : (
              <select
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-md px-3 text-sm outline-none focus:border-green-500"
              >
                {senders.map((sender) => (
                  <option key={sender.id} value={sender.id}>
                    {sender.name} — {sender.email}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">Subject</label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              required
              className="w-full h-11 border border-gray-200 rounded-md px-3 text-sm outline-none focus:border-green-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">
              Email Body
            </label>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email..."
              required
              rows={8}
              className="w-full border border-gray-200 rounded-md px-3 py-3 text-sm outline-none resize-none focus:border-green-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">
              Recipients
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={singleRecipient}
                onChange={(e) => setSingleRecipient(e.target.value)}
                onKeyDown={handleRecipientKeyDown}
                placeholder="Enter recipient email"
                className="flex-1 h-11 border border-gray-200 rounded-md px-3 text-sm outline-none focus:border-green-500"
              />

              <button
                type="button"
                onClick={addSingleRecipient}
                className="px-6 h-11 border border-green-500 text-green-600 rounded-md text-sm hover:bg-green-50"
              >
                Add
              </button>
            </div>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-100" />

              <span className="text-xs text-gray-400">OR</span>

              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* CSV */}

            <label className="block text-xs text-gray-400 mb-2">
              Upload CSV / TXT
            </label>

            <label className="flex items-center justify-center w-full h-[100px] border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-500">Click to upload CSV</p>

                <p className="text-xs text-gray-400 mt-1">
                  CSV / TXT containing email addresses
                </p>
              </div>

              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {csvFile && (
              <p className="mt-2 text-xs text-gray-400">File: {csvFile.name}</p>
            )}
            {recipients.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 max-h-[150px] overflow-y-auto">
                {recipients.map((email) => (
                  <span
                    key={email}
                    className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs"
                  >
                    {email}

                    <button
                      type="button"
                      onClick={() => removeRecipient(email)}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {recipients.length > 0 && (
              <p className="mt-2 text-xs text-gray-400">
                {recipients.length} email
                {recipients.length !== 1 ? "s" : ""} detected
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-5 mb-8">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Start Time
              </label>

              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                required
                className="w-full h-11 border border-gray-200 rounded-md px-3 text-sm outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Delay (seconds)
              </label>

              <input
                type="number"
                min="1"
                value={delaySeconds}
                onChange={(e) => setDelaySeconds(Number(e.target.value))}
                required
                className="w-full h-11 border border-gray-200 rounded-md px-3 text-sm outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Hourly Limit
              </label>

              <input
                type="number"
                min="1"
                value={hourlyLimit}
                onChange={(e) => setHourlyLimit(Number(e.target.value))}
                required
                className="w-full h-11 border border-gray-200 rounded-md px-3 text-sm outline-none focus:border-green-500"
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-400 mb-2">Scheduling Summary</p>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-lg font-semibold">{recipients.length}</p>

                <p className="text-xs text-gray-400">Recipients</p>
              </div>

              <div>
                <p className="text-lg font-semibold">{delaySeconds}s</p>

                <p className="text-xs text-gray-400">Delay</p>
              </div>

              <div>
                <p className="text-lg font-semibold">{hourlyLimit}</p>

                <p className="text-xs text-gray-400">Emails / hour</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={saving}
              className="px-6 py-2 border border-gray-200 text-gray-500 rounded-full text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving || senders.length === 0 || recipients.length === 0
              }
              className="px-7 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Scheduling..." : "Schedule Emails"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ComposeEmail;
