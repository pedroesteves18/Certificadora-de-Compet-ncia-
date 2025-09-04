export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          © {new Date().getFullYear()} TaxSim — Todos os direitos reservados.
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">
            Termos
          </a>
          <a href="#" className="hover:text-white transition">
            Privacidade
          </a>
          <a href="#" className="hover:text-white transition">
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
}
