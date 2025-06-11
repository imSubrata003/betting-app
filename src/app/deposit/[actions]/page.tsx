"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataTable } from "@/components/DataTable";
import { Check, Loader2, X } from "lucide-react";

type Deposit = {
  id: string;
  user: { name: string };
  amount: number;
  transactionNumber: string;
  status: string;
};

const DepositPage = () => {
  const params = useParams();
  const action = params?.actions;

  const [fetchedUser, setFetchedUser] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getDepositReq = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/getDepositReq");
      if (res.status === 200) {
        setFetchedUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching deposit requests:", error);
      toast.error("Error fetching deposit requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDepositReq();
  }, []);

  const updateDepositReq = async (depositId: string, status: string) => {
    try {
      setUpdatingId(depositId);
      await axios.post("/api/admin/updateDepositReq", { depositId, status });

      setFetchedUser((prev) =>
        prev.map((item) =>
          item.id === depositId ? { ...item, status } : item
        )
      );
      toast.success(`Deposit request ${status} successfully!`);
    } catch (error: any) {
      console.error("Error updating deposit request:", error.message);
      toast.error("Error updating deposit request.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filterBySearch = (user: Deposit) => {
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

  const renderSearchInput = () => (
    <div className="mb-6 flex justify-end items-center">
      <input
        type="text"
        placeholder="Search by name, transaction, or amount"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg w-64"
      />
    </div>
  );

  const getColumns = (includeActions = false) => {
    return [
      {
        header: "Name",
        accessor: (row: Deposit) => row.user.name,
      },
      {
        header: "Amount",
        accessor: (row: Deposit) => `₹${row.amount}`,
      },
      {
        header: "Transaction No.",
        accessor: (row: Deposit) => row.transactionNumber,
      },
      {
        header: "Date",
        accessor: (row: Deposit) => row?.createdAt ? new Date(row.createdAt).toLocaleString() : "N/A",
      },
      {
        header: "Method",
        accessor: (row: Deposit) => row?.method,
      },
      {
        header: "Status",
        accessor: (row: Deposit) => (
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
            accessor: (row: Deposit) => (
              <div className="flex gap-2 items-center">
                {updatingId === row.id ? (
                  <div>
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => updateDepositReq(row.id, "approved")}
                      className="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
                    >

                      <Check className="h-6 w-6 font-bold" />
                    </button>
                    <button
                      onClick={() => updateDepositReq(row.id, "failed")}
                      className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      <X className="h-6 w-6 font-bold" />
                    </button>
                  </>
                )}
              </div>
            ),
          }

        ]
        : []),
    ];
  };

  const getTableContent = () => {
    if (action === "new-req") {
      return (
        <>
          <h1 className="text-xl font-semibold mb-4">Pending deposit requests</h1>
          {renderSearchInput()}
          <DataTable data={filteredUsers.pending} columns={getColumns(true)} emptyMessage="No pending requests" />
        </>
      );
    }

    if (action === "approve") {
      return (
        <>
          <h2 className="text-2xl font-semibold mb-4">Approved Deposits</h2>
          {renderSearchInput()}
          <DataTable data={filteredUsers.approved} columns={getColumns()} emptyMessage="No approved deposits" />
        </>
      );
    }

    if (action === "decline") {
      return (
        <>
          <h2 className="text-2xl font-semibold mb-4">failed Deposits</h2>
          {renderSearchInput()}
          <DataTable data={filteredUsers.failed} columns={getColumns()} emptyMessage="No failed deposits" />
        </>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-gray-800 text-lg font-medium animate-pulse">
          Loading deposit requests...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 max-w-6xl mx-auto">
      {getTableContent()}
      <ToastContainer />
    </div>
  );
};

export default DepositPage;
