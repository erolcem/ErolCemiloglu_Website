"use client"; // <--- Needed because we now use State (Interactivity)

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  // STATE: Tracks if the mobile menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-800 bg-black/80 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Erol.C</span>
        </Link>

        {/* --- MOBILE HAMBURGER BUTTON --- */}
        {/* This button only shows on small screens (md:hidden) */}
        <button 
            onClick={() => setIsOpen(!isOpen)} // Toggle state on click
            type="button" 
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>

        {/* --- NAVIGATION LINKS --- */}
        {/* Logic: If 'isOpen' is true, we show 'block'. If false, we show 'hidden'. 
            On desktop (md:), we ALWAYS show 'block' regardless of state. */}
        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-900 md:bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            <li>
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)} // Close menu when clicked
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-500 md:p-0"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/skills" 
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
              >
                Skillss
              </Link>
            </li>
            <li>
              <Link 
                href="/projects" 
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}