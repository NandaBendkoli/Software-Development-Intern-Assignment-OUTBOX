import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser, logoutUser } from "../services/auth.service";
import { getAllEmailJobs } from "../services/email.service";

import type { User } from "../types/auth";
import type { EmailJob } from "../types/emailJob";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [emailJobs, setEmailJobs] = useState<EmailJob[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<"scheduled" | "sent">("scheduled");

  //! loading the data
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const [userResponse, jobsResponse] = await Promise.all([
        getCurrentUser(),
        getAllEmailJobs(),
      ]);
      setUser(userResponse.user);
      setEmailJobs(jobsResponse.emailJobs || []);
    } catch (error) {
      console.error("error", error);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("error", error);
    }
  };

  //! filtering the emails
  const scheduledEmails = emailJobs.filter(
    (job) => job.status === "SCHEDULED" || job.status === "PROCESSING",
  );

  const sentEmails = emailJobs.filter(
    (job) => job.status === "SENT" || job.status === "FAILED",
  );

  const displayedEmails =
    activeTab === "scheduled" ? scheduledEmails : sentEmails;

  //! valid date format
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  // ! status stylings
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-green-50 text-green-600";

      case "FAILED":
        return "bg-red-50 text-red-600";

      case "PROCESSING":
        return "bg-yellow-50 text-yellow-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* 1.sidebar */}
      <aside className="w-[240px] min-h-screen border-r border-gray-200">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold">RichInBox</h1>
        </div>
        {/* user details */}
        <div className="px-5 pb-6">
          <div className="flex items-center gap-3">
            {user?.avtar ? (
              <img
                src={user.avtar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        {/*compose the emails */}
        <div className="px-5">
          <button
            onClick={() => navigate("/compose")}
            className="w-full py-2 border border-green-500 text-green-600 rounded-full text-sm hover:bg-green-50"
          >
            Compose
          </button>
        </div>
        <div className="px-5 mt-8">
          <p className="text-[10px] text-gray-400 uppercase mb-3">InBox</p>
          <button
            onClick={() => setActiveTab("scheduled")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm mb-1 ${
              activeTab === "scheduled"
                ? "bg-gray-100 text-gray-800"
                : "text-gray-500"
            }`}
          >
            Scheduled
            <span className="float-right text-xs">
              {scheduledEmails.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              activeTab === "sent"
                ? "bg-green-50 text-gray-800"
                : "text-gray-500"
            }`}
          >
            Sent
            <span className="float-right text-xs">{sentEmails.length}</span>
          </button>
        </div>
        <div className="px-5 mt-8">
          <button
            onClick={handleLogout}
            className="text-sm text-green-400 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </aside>
{/*2. dashbaord  */}
      <main className="flex-1">
        <header className="h-[70px] border-b border-gray-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-medium">
              {activeTab === "scheduled" ? "Scheduled Emails" : "Sent Emails"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {displayedEmails.length} emails
            </p>
          </div>
          <button
            onClick={() => navigate("/compose")}
            className="px-5 py-2 bg-green-600 text-white rounded-full text-sm hover:bg-green-700"
          >
            Compose New Email
          </button>
        </header>
        {error && (
          <div className="mx-8 mt-5 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}
{/* search emails mainley in the lowercase */}
        <div className="px-8 py-5">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-[500px] h-9 bg-gray-50 rounded-full px-4 text-xs outline-none"
          />
        </div>
        {/* all emaials */}
        <div className="px-8">
          {displayedEmails.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center">
              <p className="text-sm text-gray-500">No {activeTab} emails</p>

              <p className="text-xs text-gray-400 mt-2">
                {activeTab === "scheduled"
                  ? "Schedule your first email campaign."
                  : "Sent emails will appear here."}
              </p>

              {activeTab === "scheduled" && (
                <button
                  onClick={() => navigate("/compose")}
                  className="mt-5 px-5 py-2 bg-green-600 text-white rounded-full text-sm"
                >
                  Compose Email
                </button>
              )}
            </div>
          ) : (
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1.5fr_1.5fr_1.3fr_120px] gap-4 px-5 py-3 bg-gray-50 text-[11px] text-gray-400">
                <span>Email</span>
                <span>Subject</span>
                <span>
                  {activeTab === "scheduled" ? "Scheduled Time" : "Sent Time"}
                </span>
                <span>Status</span>
              </div>
              {displayedEmails.map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/email/${job.id}`)}
                  className="grid grid-cols-[1.5fr_1.5fr_1.3fr_120px] gap-4 px-5 py-4 border-t border-gray-100 items-center cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="text-sm text-gray-700 truncate">
                    {job.recipient}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {job.campaign?.subject || "-"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(
                      activeTab === "scheduled" ? job.scheduledAt : job.sentAt,
                    )}
                  </div>
                  <div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] ${getStatusStyle(
                        job.status,
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
