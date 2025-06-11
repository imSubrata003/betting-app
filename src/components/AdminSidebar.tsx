"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  X,
  ChevronDown,
  ChevronRight,
  Layers,
  Wallet,
  Users,
  FileText,
  Archive,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { useAppContext } from "./context/Appcontext";

interface AdminSidebarProps {
  expandedMenu: string | null;
  toggleMenu: (menu: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  expandedMenu,
  toggleMenu,
  sidebarOpen,
  toggleSidebar,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  // const { userData } = useAppContext();
  const storedData = localStorage.getItem("userData");

  useEffect(() => {
    if (sidebarOpen && storedData) {
      toggleSidebar();
    }
  }, [pathname]);

  const handleNavigation = (path: string) => {
    toggleSidebar(); // Close the sidebar
    setTimeout(() => {
      router.push(path); // Navigate after sidebar is closed
    }, 300); // Match your transition duration (300ms)
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 z-10 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-64"
      } shadow-lg `}
    >
      {/* Close Button */}
      <button className="absolute top-4 right-4" onClick={toggleSidebar}>
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
        <ul className="space-y-2">
          {/* Dashboard */}
          <li
            onClick={() => handleNavigation("/dashboard")}
            className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 select-none"
          >
            <Layers className="w-5 h-5" /> My Dashboard
          </li>

          <li
            onClick={() => handleNavigation("/game/running-games")}
            className="flex items-center gap-2 cursor-pointer hover:text-yellow-400 select-none"
          >
            <Layers className="w-5 h-5" /> Running Games
          </li>

          {/* <li onClick={() => router.push('/game/history')} className="flex items-center gap-2 cursor-pointer hover:text-yellow- select-none">
            <Layers className="w-5 h-5" /> Games History
          </li> */}

          <li
            onClick={() => handleNavigation("/bids")}
            className="flex items-center gap-2 cursor-pointer hover:text-yellow- select-none"
          >
            <Layers className="w-5 h-5" /> Bids History
          </li>

          {/* Manage Games */}
          <li
            onClick={() => toggleMenu("manageGames")}
            className="flex justify-between items-center cursor-pointer hover:text-yellow- select-none"
          >
            <span className="flex items-center gap-2">
              <Archive className="w-5 h-5" /> Manage Games
            </span>
            {expandedMenu === "manageGames" ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </li>
          {expandedMenu === "manageGames" && (
            <ul className="ml-6 space-y-1 text-sm">
              <li
                onClick={() => handleNavigation("/game")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Create new Games
              </li>
              {/* <li onClick={() => router.push('/game')} className="cursor-pointer hover:text-yellow- select-none">All games</li> */}
              <li
                onClick={() => handleNavigation("/game/edit")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Edit Games
              </li>
            </ul>
          )}

          {/* Manage Users */}
          <li
            onClick={() => toggleMenu("manageUsers")}
            className="flex justify-between items-center cursor-pointer hover:text-yellow- select-none"
          >
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" /> Manage Users
            </span>
            {expandedMenu === "manageUsers" ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </li>
          {expandedMenu === "manageUsers" && (
            <ul className="ml-6 space-y-1 text-sm">
              <li
                onClick={() => handleNavigation("/users/add")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Add new users
              </li>
              <li
                onClick={() => handleNavigation("/users/all")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                All Users
              </li>
              <li
                onClick={() => handleNavigation("/users/active")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Active Users
              </li>
              <li
                onClick={() => handleNavigation("/users/inactive")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Suspended Users
              </li>
            </ul>
          )}

          {/* Manage Deposits */}
          <li
            onClick={() => toggleMenu("manageDeposits")}
            className="flex justify-between items-center cursor-pointer hover:text-yellow- select-none"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Manage Deposits
            </span>
            {expandedMenu === "managePayouts" ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </li>
          {expandedMenu === "manageDeposits" && (
            <ul className="ml-6 space-y-1 text-sm">
              <li
                onClick={() => handleNavigation("/deposit/new-req")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                New deposit requests
              </li>
              <li
                onClick={() => handleNavigation("/deposit/approve")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Approve deposits
              </li>
              <li
                onClick={() => handleNavigation("/deposit/decline")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Rejected deposits
              </li>
              {/* <li onClick={() => router.push('/payout/all-payouts')} className="cursor-pointer hover:text-yellow- select-none">All deposits</li>
              <li onClick={() => router.push('/payout/export-payouts')} className="cursor-pointer hover:text-yellow- select-none">Export deposits</li> */}
            </ul>
          )}

          {/* Manage Payouts */}
          <li
            onClick={() => toggleMenu("managePayouts")}
            className="flex justify-between items-center cursor-pointer hover:text-yellow- select-none"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Manage Payouts
            </span>
            {expandedMenu === "managePayouts" ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </li>
          {expandedMenu === "managePayouts" && (
            <ul className="ml-6 space-y-1 text-sm">
              <li
                onClick={() => handleNavigation("/payout/view-payouts")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                New payout requests
              </li>
              <li
                onClick={() => handleNavigation("/payout/approved-payouts")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Approve Payouts
              </li>
              <li
                onClick={() => handleNavigation("/payout/failed-payouts")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Decline Payouts
              </li>
              {/* <li onClick={() => router.push('/payout/all-payouts')} className="cursor-pointer hover:text-yellow- select-none">All Payouts</li>
              <li onClick={() => router.push('/payout/export-payouts')} className="cursor-pointer hover:text-yellow- select-none">Export Payouts</li> */}
            </ul>
          )}

          {/* Manage Wallets */}
          <li
            onClick={() => toggleMenu("manageWallet")}
            className="flex justify-between items-center cursor-pointer hover:text-yellow- select-none"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Manage wallet
            </span>
            {expandedMenu === "managePayouts" ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </li>
          {expandedMenu === "manageWallet" && (
            <ul className="ml-6 space-y-1 text-sm">
              {/* <li onClick={() => router.push('/payout/view-payouts')} className="cursor-pointer hover:text-yellow- select-none">View Wallet</li> */}
              {/* <li onClick={() => router.push('/payout/approve-payouts')} className="cursor-pointer hover:text-yellow- select-none">Approvet</li> */}
              <li
                onClick={() => handleNavigation("/wallet/manage")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Credit / Debit Wallet
              </li>
              <li
                onClick={() => handleNavigation("/wallet/all-payouts")}
                className="cursor-pointer hover:text-yellow- select-none"
              >
                Wallets histry
              </li>
              {/* <li onClick={() => router.push('/payout/export-payouts')} className="cursor-pointer hover:text-yellow- select-none">Exportt</li> */}
            </ul>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
