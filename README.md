# 📊 Plataforma de Cálculo de Taxas e Impostos em Investimentos

## O Problema
Muitos investidores iniciantes e até experientes enfrentam dificuldades ao tentar entender e calcular o impacto de taxas e impostos sobre seus investimentos.  
A falta de uma ferramenta simplificada para esses cálculos leva a decisões equivocadas, como a venda ou manutenção incorreta de ativos.

---

## 🚀 Solução Proposta
Desenvolver uma **plataforma web**  que permita:

- Inserir manualmente informações dos seus ativos (valor investido, tipo de ativo, tempo de aplicação, taxas, impostos)
- Calcular automaticamente o rendimento bruto e líquido, já considerando taxas e impostos
- Visualizar relatórios e gráficos detalhados do impacto das taxas e impostos sobre o retorno final
- Simular diferentes cenários, como venda em prazos distintos ou alteração de taxas

### 📊 Exemplos de Cenários de Simulação

### 1. Venda antecipada em renda fixa
- **Entrada:** Investimento de R$ 10.000 em CDB com prazo de 24 meses, IR regressivo:  
  - 22,5% até 180 dias  
  - 20% até 360 dias  
  - 17,5% até 720 dias  
  - 15% acima de 720 dias
- **Simulação:**  
  - Venda no 6º mês → alíquota de 22,5%  
  - Venda no 18º mês → alíquota de 20%  
  - Venda no prazo final (24 meses) → alíquota de 15%
- **Resultado:** gráfico comparando quanto o investidor perde de rentabilidade ao vender antes do vencimento.

---

### 2. Comparação de fundos com taxas diferentes
- **Entrada:** R$ 50.000 investidos em dois fundos multimercado:  
  - Fundo A: taxa de administração 1% + taxa de performance 20% sobre rendimento que superar o CDI  
  - Fundo B: taxa de administração 2% e sem taxa de performance
- **Simulação:** comparar rendimento líquido ao longo de 5 anos.  
- **Resultado:** tabela e gráfico mostrando qual fundo gera maior retorno líquido considerando as taxas.

---

### 3. Impacto do “come-cotas” em fundos de investimento
- **Entrada:** R$ 20.000 em fundo de renda fixa, com come-cotas semestral (alíquota mínima de 15%).  
- **Simulação:** evolução do patrimônio em 2 anos, considerando o desconto do come-cotas a cada semestre.  
- **Resultado:** gráfico em linha mostrando as quedas semestrais causadas pelo imposto.

---

### 4. Compra e venda de ações
- **Entrada:** Compra de 1.000 ações a R$ 10,00 (R$ 10.000 no total).  
- **Simulação:** venda após 6 meses por R$ 15,00 (R$ 15.000).  
  - Lucro: R$ 5.000  
  - Tributação: IR de 15% sobre o ganho de capital (R$ 750)  
- **Resultado:** rendimento líquido exibido e gráfico mostrando impacto do imposto sobre o lucro.

---

### 5. Efeito do tempo no Tesouro Direto
- **Entrada:** Tesouro Selic aplicado por R$ 5.000.  
- **Simulação:** venda em diferentes prazos:  
  - 1 ano  
  - 3 anos  
  - 5 anos  
- **Resultado:** mostrar diferença de rentabilidade líquida por causa do IR regressivo.
---

## 📝 Fluxo do Usuário
1. Usuário acessa a plataforma → login 
2. Insere os dados do investimento (formulário ou arquivo)
3. Sistema realiza os cálculos (rendimento bruto x líquido)
4. Usuário visualiza gráficos, tabelas e comparações
5. Possibilidade de salvar simulações

---

## 💻 Linguagem e Arquitetura

- **Frontend:** Vue.js + TailwindCSS
- **Backend:** Node.js (Express)
- **Banco de Dados:** PostgreSQL
- **Arquitetura:** API REST
- **Ambiente:** Docker

---


## 🤝 Ambientes Colaborativos

- **Github:** versionamento de código
- **Discord e Whatsapp:** comunicação
- **Figma:** prototipagem

---


## 📌 Próximos Passos

- Definição das fórmulas financeiras que serão implementadas. (Guilherme Oliveira)

- Criação do protótipo inicial no Figma. (João Pedro)

- Configuração do repositório no Github e Ambiente (Pedro Esteves)

- Início do desenvolvimento Frontend (Murillo)

- Início do desenvolvimento Backend (Pedro Esteves)

- Criação da lógica de importação/exportação de arquivos (João Guilherme)
