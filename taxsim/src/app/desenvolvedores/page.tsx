import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Desenvolvedores() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
            <Navbar />

            <div className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="py-20 px-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <h1 className="text-5xl font-extrabold mb-4">Para Desenvolvedores</h1>
                    <p className="text-lg max-w-3xl mx-auto text-white/90">
                        Construa em cima do <span className="font-semibold">TaxSim</span>, explore as
                        APIs e contribua para melhorar a forma como os investidores entendem taxas e impostos.
                    </p>
                </section>

                {/* Documentação */}
                <section className="py-20 px-6 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">📖 Documentação</h2>
                    <p className="text-gray-700 leading-relaxed mb-8">
                        O <span className="font-semibold text-blue-600">TaxSim</span> está sendo
                        desenvolvido com tecnologias modernas no stack <strong>Next.js + Node.js</strong>. Nosso objetivo é fornecer uma base sólida para simulações de
                        investimentos, cálculos de taxas e impostos, além de uma API flexível para
                        integrações externas.
                    </p>
                </section>

                {/* Equipe de Desenvolvimento */}
                <section className="py-20 px-6 bg-gradient-to-br from-white to-gray-50">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-12">
                            👩‍💻👨‍💻 Equipe de Desenvolvimento
                        </h2>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
                            O projeto <span className="font-bold text-blue-600">TaxSim</span> é fruto do
                            trabalho de estudantes da{" "}
                            <span className="font-semibold text-green-600">
                                Universidade Tecnológica Federal do Paraná (UTFPR)
                            </span>, unindo tecnologia, inovação e finanças.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition">
                                <h3 className="text-lg font-bold text-gray-800">Murillo Tadeu Amadeu</h3>
                                <p className="text-gray-600 text-sm mt-2">Desenvolvedor Full-Stack</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition">
                                <h3 className="text-lg font-bold text-gray-800">João Pedro Koguishi</h3>
                                <p className="text-gray-600 text-sm mt-2">Desenvolvedor FullStack Mobile</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition">
                                <h3 className="text-lg font-bold text-gray-800">[Nome do Dev 3]</h3>
                                <p className="text-gray-600 text-sm mt-2">Especialista em Backend</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Guia Rápido */}
                <section className="py-20 px-6 bg-gradient-to-r from-white to-gray-50 shadow-inner">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">⚡ Guia Rápido</h2>
                        <pre className="bg-gray-900 text-green-400 p-6 rounded-xl text-sm shadow-lg overflow-x-auto">
                            {`# Exemplo de requisição (futuro endpoint)
POST /api/calculadora

{
  "tipo": "renda_fixa",
  "valor_investido": 10000,
  "dias": 365,
  "taxa_corretora": 0.5
}

# Resposta esperada
{
  "valor_bruto": 11000,
  "impostos": {
    "ir": 150,
    "iof": 0
  },
  "valor_liquido": 10850
}`}
                        </pre>
                    </div>
                </section>

                {/* Contribuição */}
                <section className="py-20 px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">
                        🤝 Contribua com o TaxSim
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        Interessado em ajudar no desenvolvimento? O projeto busca colaboradores para
                        melhorar cálculos, adicionar novos ativos e expandir a API.
                    </p>
                    <a
                        href="https://github.com/seu-repo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg font-semibold hover:opacity-90 transition"
                    >
                        Ver no GitHub
                    </a>
                </section>
            </div>

            <Footer />
        </main>
    );
}
