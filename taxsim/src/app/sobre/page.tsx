import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// SVG Icons as components
const TargetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
);

const PercentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
);

const LandmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22"></line>
      <line x1="6" y1="18" x2="6" y2="11"></line>
      <line x1="10" y1="18" x2="10" y2="11"></line>
      <line x1="14" y1="18" x2="14" y2="11"></line>
      <line x1="18" y1="18" x2="18" y2="11"></line>
      <polygon points="12 2 20 7 4 7"></polygon>
    </svg>
);

const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center mb-3">
        <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>
      </div>
      <p className="text-gray-600 text-sm">
        {children}
      </p>
    </div>
);


export default function Sobre() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-28 px-6 text-center bg-gradient-to-r from-blue-600 to-green-500 text-white overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,white,transparent_40%)]"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Sobre o TaxSim</h1>
            <p className="text-lg max-w-3xl mx-auto text-white/90">
              Uma plataforma criada para ajudar investidores a entender com clareza o impacto
              de taxas e impostos sobre seus investimentos.
            </p>
          </div>
        </section>

        {/* Explicação do Projeto */}
        <section className="py-28 px-6 max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">
              <TargetIcon className="inline-block w-10 h-10 mr-3 text-blue-600" /> 
              Nosso Objetivo
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              O <span className="font-semibold text-blue-600">TaxSim</span> nasceu da
              necessidade de simplificar cálculos tributários e de taxas, que muitas vezes
              confundem investidores e prejudicam decisões financeiras. Com uma interface
              simples e intuitiva, o sistema permite simulações realistas e ajuda você a tomar
              decisões mais informadas.
            </p>
          </div>
        </section>

        {/* Bases de Cálculo */}
        <section className="py-28 px-6 bg-gradient-to-r from-blue-50 via-white to-green-50">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-12 text-center tracking-tight">
                    📊 Bases de Cálculo Utilizadas
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <InfoCard icon={<PercentIcon />} title="Imposto de Renda (IR)">
                        Baseado na tabela regressiva para renda variável e renda fixa:
                        <br />• Até 180 dias → 22,5%  
                        <br />• 181 a 360 dias → 20%  
                        <br />• 361 a 720 dias → 17,5%  
                        <br />• Acima de 720 dias → 15%
                    </InfoCard>

                    <InfoCard icon={<LandmarkIcon />} title="IOF (Imposto sobre Operações Financeiras)">
                        Aplicável em resgates realizados em menos de 30 dias. A alíquota inicia em 96% e decresce 3% ao dia até zerar no 30º dia.
                    </InfoCard>

                    <InfoCard icon={<BriefcaseIcon />} title="Taxas de Corretoras">
                        Inclui corretagem, taxa de custódia e taxa da B3. Esses custos variam conforme a instituição financeira.
                    </InfoCard>

                    <InfoCard icon={<PlusCircleIcon />} title="Outros Custos">
                        Também consideramos taxas de performance em fundos, spread em renda fixa e outros encargos operacionais que afetam diretamente a rentabilidade final.
                    </InfoCard>
                </div>
            </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
