import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Campaign, Stats } from "../types/campaign";

import {
  getCampaign,
  getCampaignStats,
  pauseCampaign,
  resumeCampaign,
  cancelCampaign,
} from "../services/campaign.service";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const [campaignResponse, statsResponse] = await Promise.all([
        getCampaign(id),
        getCampaignStats(id),
      ]);

      setCampaign(campaignResponse.campaign);
      setStats(statsResponse.stats);
    } catch (error) {
      console.error(error);
      setError("Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handlePause = async () => {
    if (!id) return;

    try {
      setActionLoading(true);

      await pauseCampaign(id);

      await loadData();
    } catch (error) {
      console.error(error);
      setError("Failed to pause campaign");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!id) return;

    try {
      setActionLoading(true);

      await resumeCampaign(id);

      await loadData();
    } catch (error) {
      console.error(error);
      setError("Failed to resume campaign");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this campaign?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await cancelCampaign(id);

      await loadData();
    } catch (error) {
      console.error(error);
      setError("Failed to cancel campaign");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500">Campaign not found</p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-green-600 text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="h-[70px] border-b border-gray-200 flex items-center justify-between px-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Dashboard
        </button>

        <div className="flex gap-2">
          {campaign.status === "ACTIVE" && (
            <button
              onClick={handlePause}
              disabled={actionLoading}
              className="px-4 py-2 rounded-full border border-yellow-400 text-yellow-600 text-sm disabled:opacity-50"
            >
              Pause
            </button>
          )}

          {campaign.status === "PAUSED" && (
            <button
              onClick={handleResume}
              disabled={actionLoading}
              className="px-4 py-2 rounded-full border border-green-500 text-green-600 text-sm disabled:opacity-50"
            >
              Resume
            </button>
          )}

          {campaign.status !== "CANCELLED" && (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="px-4 py-2 rounded-full border border-red-400 text-red-500 text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </header>
      <main className="max-w-[1000px] mx-auto px-8 py-8">
        {error && (
          <div className="mb-5 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="border border-gray-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{campaign.subject}</h1>

              <p className="text-sm text-gray-400 mt-2">
                From: {campaign.sender?.name} ({campaign.sender?.email})
              </p>
            </div>

            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
              {campaign.status}
            </span>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {campaign.body}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-xs text-gray-400">Start Time</p>

              <p className="text-sm mt-1">
                {new Date(campaign.startAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Delay</p>

              <p className="text-sm mt-1">{campaign.delaySeconds} seconds</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Hourly Limit</p>

              <p className="text-sm mt-1">{campaign.hourlyLimit} emails</p>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-medium mt-8 mb-4">Campaign Statistics</h2>
        <div className="grid grid-cols-5 gap-4">
          <StatCard title="Total" value={stats?.total ?? 0} />

          <StatCard title="Scheduled" value={stats?.scheduled ?? 0} />

          <StatCard title="Processing" value={stats?.processing ?? 0} />

          <StatCard title="Sent" value={stats?.sent ?? 0} />

          <StatCard title="Failed" value={stats?.failed ?? 0} />
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="border border-gray-100 rounded-lg p-5">
      <p className="text-xs text-gray-400">{title}</p>

      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
};

export default CampaignDetail;
