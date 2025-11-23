"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    await login(email, password);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md border border-gray-100">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
            Login
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-black"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 rounded-xl shadow-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-400"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Registre-se
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}