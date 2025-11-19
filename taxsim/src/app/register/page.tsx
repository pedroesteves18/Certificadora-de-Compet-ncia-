"use client";

import { useState, FormEvent, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "../services/apiClient";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Verificar se já está logado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!name || !email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      // Primeiro, criar a conta
      await apiClient.post("/api/users", { name, email, password });
      
      // Depois fazer login automaticamente
      const loginResponse = await apiClient.post<{ 
        msg: string; 
        user: { id: number; name: string; email: string; role: string }; 
        token: string 
      }>("/api/users/login", { email, password });

      // Salvar token e dados do usuário no localStorage
      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.user));

      // Redirecionar para dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro no registro:", error);
      setError(error.message || "Erro ao registrar. O email já pode estar em uso.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 py-10">
        <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md border border-gray-100">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
            Criar Conta
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-black"
                required
              />
            </div>
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
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 rounded-xl shadow-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-400"
            >
              {isLoading ? "Criando..." : "Criar Conta"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}