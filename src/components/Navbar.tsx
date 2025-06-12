"use client";

import { useEffect, useState } from "react";
import { Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "./context/Appcontext";
import AuthModal from "./AuthModal";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify'
import { validateUser } from "@/utils/validateAdmin";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);


  const { userData } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = (menu: string) =>
    setExpandedMenu(expandedMenu === menu ? null : menu);

  useEffect(() => {
    const adminCheck = async () => {
      const data = await validateUser();
      // console.log('data', data);
      if (data) {
        setParsedData(data);
      } else {
        setParsedData(null);
        localStorage.removeItem("userData");
        router.refresh();
      }
    }

    adminCheck();
  }, []);

  useEffect(() => {
    if (dropdownOpen) toggleDropdown();
  }, [pathname]);

  const handleUserClick = () => {
    if (parsedData) {
      toggleDropdown();
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    location.reload();
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <button
            className={`${parsedData ? "" : "hidden"}`}
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <h1
            onClick={() => router.push("/")}
            className="text-xl font-bold cursor-pointer"
          >
            MOON FF Admin
          </h1>
        </div>

        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleUserClick}
          >
            <User className="w-6 h-6" />
            <span>{userData ? userData.name : "Login"}</span>
            <ChevronDown className="w-4 h-4" />
          </div>

          {dropdownOpen && userData && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-10">
              <div
                onClick={() => {
                  toggleDropdown()
                  router.push("/game/settings")
                }}
                className="px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4" /> Settings
              </div>
              <div
                onClick={handleLogout}
                className="px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Logout
              </div>
            </div>
          )}
        </div>
      </nav>

      {parsedData && (
        <AdminSidebar
          expandedMenu={expandedMenu}
          toggleMenu={toggleMenu}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}

      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
    </>
  );
};

export default Navbar;