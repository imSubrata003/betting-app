// components/Breadcrumb.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const Breadcrumb = () => {
  const pathname = usePathname();

  if (pathname === "/") return null;

  if (pathname === "/dashboard") {
    return (
      <nav
        className="text-sm text-gray-500 my-4 ml-5 bg-transparent"
        style={{ backgroundColor: "transparent" }}
      >
        <ol className="flex space-x-2">
          <li>
            <Link href="/dashboard" className="hover:underline text-blue-600">
              Home
            </Link>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav
      className="text-sm text-gray-500 my-4 ml-5 bg-transparent"
      style={{ backgroundColor: "transparent" }}
    >
      <ol className="flex space-x-2">
        <li>
          <Link href="/dashboard" className="hover:underline text-blue-600">
            Home
          </Link>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
