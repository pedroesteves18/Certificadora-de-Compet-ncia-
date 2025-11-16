import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// SVG Icons as components to replace lucide-react
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

const BookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="8.5" cy="7" r="4"></circle>
      <path d="M20 8v6"></path>
      <path d="M23 11h-6"></path>
    </svg>
);

const GitMergeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3"></circle>
      <circle cx="6" cy="6" r="3"></circle>
      <path d="M6 21V9a9 9 0 0 1 9 9"></path>
    </svg>
);


const DeveloperCard = ({ name, role, github, linkedin }: { name: string, role: string, github: string, linkedin: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
            <UsersIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-blue-600 text-sm mt-1">{role}</p>
        <div className="flex gap-4 mt-4">
            <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-800 transition">
                <GithubIcon height={20} width={20}/>
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition">
                <LinkedinIcon height={20} width={20} />
            </a>
        </div>
    </div>
);


export default function Desenvolvedores() {
    const developers = [
        { name: "Murillo Tadeu Amadeu", role: "Desenvolvedor Front-end", github: "#", linkedin: "#" },
        { name: "João Pedro Koguishi", role: "Desenvolvedor Full-Stack", github: "#", linkedin: "#" },
        { name: "Pedro Esteves", role: "Desenvolvedor Back-end & Infra", github: "#", linkedin: "#" },
        { name: "Guilherme Oliveira", role: "Analista de Requisitos", github: "#", linkedin: "#" },
        { name: "João Guilherme", role: "Analista de Dados", github: "#", linkedin: "#" },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
            <Navbar />

            <div className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="relative py-28 px-6 text-center bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white overflow-hidden">
                     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white,transparent_40%)]"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Para Desenvolvedores</h1>
                        <p className="text-lg max-w-3xl mx-auto text-white/80">
                            Construa em cima do <span className="font-semibold text-blue-400">TaxSim</span>, explore as
                            APIs e contribua para melhorar a forma como os investidores entendem taxas e impostos.
                        </p>
                    </div>
                </section>

                {/* Equipe de Desenvolvimento */}
                <section className="py-28 px-6 bg-gradient-to-br from-white to-gray-50">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">
                            <UsersIcon className="inline-block w-10 h-10 mr-3 text-blue-600" />
                            Nossa Equipe
                        </h2>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-16">
                            O projeto <span className="font-bold text-blue-600">TaxSim</span> é fruto do
                            trabalho de estudantes da{" "}
                            <span className="font-semibold text-green-600">
                                Universidade Tecnológica Federal do Paraná (UTFPR)
                            </span>, unindo tecnologia, inovação e finanças.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                           {developers.map(dev => <DeveloperCard key={dev.name} {...dev} />)}
                        </div>
                    </div>
                </section>


                {/* Documentação */}
                <section className="py-28 px-6 max-w-5xl mx-auto">
                     <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 text-center tracking-tight">
                        <BookIcon className="inline-block w-10 h-10 mr-3 text-blue-600" /> 
                        Documentação e Stack
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                        O <span className="font-semibold text-blue-600">TaxSim</span> foi
                        desenvolvido com tecnologias modernas no stack <strong>Next.js (React) + Node.js (Express) e PostgreSQL</strong>. Nosso objetivo é fornecer uma base sólida para simulações de
                        investimentos e uma API flexível para
                        integrações externas.
                    </p>
                </section>

                {/* Guia Rápido */}
                <section className="py-28 px-6 bg-gray-900 text-white">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center">
                            <CodeIcon className="inline-block w-8 h-8 mr-2" />
                            Guia Rápido da API
                        </h2>
                        <p className="text-center text-gray-400 mb-10">Abaixo um exemplo de como nossa API RESTful irá funcionar.</p>
                        <pre className="bg-black/50 text-green-400 p-6 rounded-xl text-sm shadow-lg overflow-x-auto ring-1 ring-white/10">
                            <code>
{`// Exemplo de requisição (futuro endpoint)
POST /api/calculadora

{
  "tipo": "renda_fixa",
  "valor_investido": 10000,
  "dias": 365,
  "taxa_corretora": 0.5
}

// Resposta esperada
{
  "valor_bruto": 11000,
  "impostos": {
    "ir": 150,
    "iof": 0
  },
  "valor_liquido": 10850
}`}
                            </code>
                        </pre>
                    </div>
                </section>

                {/* Contribuição */}
                <section className="py-28 px-6 text-center">
                     <h2 className="text-3xl font-bold mb-4 text-gray-800 tracking-tight">
                        <GitMergeIcon className="inline-block w-8 h-8 mr-2" />
                        Contribua com o TaxSim
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                        Interessado em ajudar no desenvolvimento? O projeto busca colaboradores para
                        melhorar cálculos, adicionar novos ativos e expandir a API.
                    </p>
                    <a
                        href="https://github.com/pedroesteves18/certificadora-de-compet-ncia-"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl shadow-lg font-semibold hover:opacity-90 transition-transform hover:scale-105 active:scale-95"
                    >
                        <GithubIcon height={18} width={18} />
                        Ver no GitHub
                    </a>
                </section>
            </div>

            <Footer />
        </main>
    );
}

