import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Sobre() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center bg-gradient-to-r from-blue-600 to-green-500 text-white">
          <h1 className="text-5xl font-extrabold mb-4">Sobre o TaxSim</h1>
          <p className="text-lg max-w-3xl mx-auto text-white/90">
            Uma plataforma criada para ajudar investidores a entender com clareza o impacto
            de taxas e impostos sobre seus investimentos.
          </p>
        </section>

        {/* Explicação do Projeto */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            🎯 Nosso Objetivo
          </h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            O <span className="font-semibold text-blue-600">TaxSim</span> nasceu da
            necessidade de simplificar cálculos tributários e de taxas, que muitas vezes
            confundem investidores e prejudicam decisões financeiras. Com uma interface
            simples e intuitiva, o sistema permite simulações realistas e ajuda você a tomar
            decisões mais informadas.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            📊 Bases de Cálculo Utilizadas
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                💰 Imposto de Renda (IR)
              </h3>
              <p className="text-gray-600 text-sm">
                Baseado na tabela regressiva para renda variável e renda fixa:
                <br />• Até 180 dias → 22,5%  
                • 181 a 360 dias → 20%  
                • 361 a 720 dias → 17,5%  
                • Acima de 720 dias → 15%
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                🏦 IOF (Imposto sobre Operações Financeiras)
              </h3>
              <p className="text-gray-600 text-sm">
                Aplicável em resgates realizados em menos de 30 dias. A alíquota inicia em
                96% e decresce 3% ao dia até zerar no 30º dia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                📉 Taxas de Corretoras
              </h3>
              <p className="text-gray-600 text-sm">
                Inclui corretagem, taxa de custódia e taxa da B3. Esses custos variam
                conforme a instituição financeira.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-105 transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                📈 Outros Custos
              </h3>
              <p className="text-gray-600 text-sm">
                Também consideramos taxas de performance em fundos, spread em renda fixa e
                outros encargos operacionais que afetam diretamente a rentabilidade final.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
