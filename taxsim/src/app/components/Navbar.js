"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/favicon.ico"
            alt="TaxSim Logo"
            width={32}
            height={32}
            priority
          />
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
          >
            TaxSim
          </Link>
        </div>

        {/* Links Desktop */}
        <div className="hidden md:flex gap-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Home
          </Link>
          <Link
            href="/calculadora"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Calculadora
          </Link>
          <Link
            href="/sobre"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Sobre
          </Link>
          <Link
            href="/desenvolvedores"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Desenvolvedores
          </Link>
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t animate-slide-down">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Home
            </Link>
            <Link
              href="/calculadora"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Calculadora
            </Link>
            <Link
              href="#sobre"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Sobre
            </Link>
            <Link
              href="#contato"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Contato
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
