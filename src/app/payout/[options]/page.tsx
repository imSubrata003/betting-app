"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { DataTable } from "@/components/DataTable"; // Update path if different
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Check, Loader2, X } from "lucide-react";
import { validateUser } from "@/utils/validateAdmin";

type Payout = {
  id: string;
  user: { name: string };
  amount: number;
  transactionNumber: string;
  status: string;
  method: string; // Added method property
  createdAt?: string; // Optionally add createdAt if used elsewhere
};

const PayoutPage = () => {
  const { options } = useParams();
  const [fetchedUser, setFetchedUser] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
    const router = useRouter();
    useEffect(() => {
        const adminCheck = async () => {
            const data = await validateUser();
            // console.log('data', data);
            if (data) {
                return data
            } else {
                localStorage.removeItem("userData");
                router.push('/');
            }
        }

        adminCheck();
    }, []);

  const getWithdrawlReq = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/getWithdrawReq');
      setFetchedUser(res.data || []);
    } catch (error) {
      console.error("Failed to fetch payout requests", error);
      toast.error("Failed to fetch payout requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWithdrawlReq();
  }, []);

  const updateWithdrawStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      await axios.post('/api/admin/updateWithdrawlReq', { withdrawId: id, status });
      setFetchedUser(prev => prev.map(user =>
        user.id === id ? { ...user, status } : user
      ));
      toast.success(`Payout ${status}`);
    } catch (err) {
      console.error("Error updating withdrawal:", err);
      toast.error("Error updating withdrawal request.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filterBySearch = (user: Payout) => {
    const query = searchQuery.toLowerCase();
    return (
      user.user?.name?.toLowerCase().includes(query) ||
      user.transactionNumber?.toLowerCase().includes(query) ||
      user.amount?.toString().includes(query)
    );
  };

  const filteredUsers = {
    approved: fetchedUser.filter((u) => u.status === "approved" && filterBySearch(u)),
    failed: fetchedUser.filter((u) => u.status === "failed" && filterBySearch(u)),
    pending: fetchedUser.filter((u) => u.status === "pending" && filterBySearch(u)),
  };

  const getTitle = () => {
    switch (options) {
      case "view-payouts":
        return "Pending Payout Requests";
      case "approved-payouts":
        return "Approved Payouts";
      case "failed-payouts":
        return "Failed Payouts";
      case "all-payouts":
        return "All Payout Requests";
      default:
        return "Payouts";
    }
  };

  const getUsers = () => {
    switch (options) {
      case "view-payouts":
        return filteredUsers.pending;
      case "approved-payouts":
        return filteredUsers.approved;
      case "failed-payouts":
        return filteredUsers.failed;
      case "all-payouts":
        return fetchedUser.filter(filterBySearch);
      default:
        return [];
    }
  };

  const getColumns = (includeActions = false) => [
    {
      header: "Name",
      accessor: (row: Payout) => row.user.name,
    },
    {
      header: "Amount",
      accessor: (row: Payout) => `₹${row.amount}`,
    },
    {
      header: "Transaction No.",
      accessor: (row: Payout) => row.transactionNumber,
    },
    {
      header: "Date",
      accessor: (row: Payout) => row?.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A",
    },
    {
      header: "Method",
      accessor: (row: Payout) => row?.method,
    },
    {
      header: "Status",
      accessor: (row: Payout) => (
        <span
          className={`font-medium ${row.status === "approved"
            ? "text-green-600"
            : row.status === "failed"
              ? "text-red-600"
              : "text-yellow-600"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    ...(includeActions
      ? [
        {
          header: "Actions",
          accessor: (row: Payout) => (
            <div className="flex gap-2 items-center">
              {updatingId === row.id ? (
                <div>
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => updateWithdrawStatus(row.id, "approved")}
                    disabled={updatingId === row.id}
                    className="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateWithdrawStatus(row.id, "failed")}
                    disabled={updatingId === row.id}
                    className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ),
        }
      ]
      : []),
  ];

  const showActions = options === "view-payouts";

  return (
    <div className="p-6 text-black">
      <h1 className="text-xl font-semibold mb-4">{getTitle()}</h1>

      {/* Search Input */}
      <div className="mb-6 flex justify-end items-center">
        <input
          type="text"
          placeholder="Search by name or transaction number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-64"
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <DataTable
          data={getUsers()}
          columns={getColumns(showActions)}
          emptyMessage="No payouts found"
          loading={loading}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default PayoutPage;
