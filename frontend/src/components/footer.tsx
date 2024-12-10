import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} GoTiny. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/prnvtripathi/go-tiny"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
              <FaGithub className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
