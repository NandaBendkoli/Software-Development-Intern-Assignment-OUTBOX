import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import type { EmailJob } from "../types/emailJob";

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [emailJob, setEmailJob] = useState<EmailJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEmail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/emailJob/getOne/${id}`);

        setEmailJob(response.data.emailJob);
      } catch (error) {
        console.error("Email detail error:", error);
        setError("Failed to load email details");
      } finally {
        setLoading(false);
      }
    };

    loadEmail();
  }, [id]);
  const formatDate = (date: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-green-100 text-green-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "PROCESSING":
        return "bg-yellow-100 text-yellow-700";

      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading email...</p>
      </div>
    );
  }
  if (error || !emailJob) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-sm text-red-500">{error || "Email not found"}</p>

        <Link
          to="/dashboard"
          className="mt-4 text-sm text-green-600 hover:text-green-700"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <header className="h-[70px] border-b border-gray-200 flex items-center px-8">
        <Link
          to="/dashboard"
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          ← Back
        </Link>
      </header>
      <main className="max-w-[900px] mx-auto px-8 py-8">
       <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold">
              {emailJob.campaign?.subject || "Email Details"}
            </h1>

            <p className="text-xs text-gray-400 mt-1">
              Email ID: {emailJob.id}
            </p>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(
              emailJob.status,
            )}`}
          >
            {emailJob.status}
          </span>
        </div>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs text-gray-400 mb-2">To</p>

            <p className="text-sm text-gray-700">{emailJob.recipient}</p>
          </div>
          <div className="px-6 py-5 border-b border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Subject</p>

            <p className="text-sm font-medium text-gray-800">
              {emailJob.campaign?.subject || "-"}
            </p>
          </div>
          <div className="px-6 py-6 border-b border-gray-100">
            <p className="text-xs text-gray-400 mb-3">Message</p>

            <div className="bg-gray-50 rounded-lg p-5">
              <p className="text-sm leading-7 text-gray-700 whitespace-pre-wrap">
                {emailJob.campaign?.body || "-"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-6 py-5 border-r border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Scheduled Time</p>

              <p className="text-sm text-gray-700">
                {formatDate(emailJob.scheduledAt)}
              </p>
            </div>

            <div className="px-6 py-5">
              <p className="text-xs text-gray-400 mb-2">Sent Time</p>

              <p className="text-sm text-gray-700">
                {formatDate(emailJob.sentAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (emailJob.campaignId) {
                navigate(`/campaign/${emailJob.campaignId}`);
              }
            }}
            className="px-5 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700"
          >
            View Campaign →
          </button>
        </div>
      </main>
    </div>
  );
};

export default EmailDetail;
