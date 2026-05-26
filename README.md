# 💰 Minha Carteira Minha Vida - Fullstack (Fase Final)

**Nicolas Abrantes Bicalho - RM567161 - Grupo 81**

Este é o projeto final do ano letivo da FIAP, consistindo em uma aplicação Fullstack (Backend em Java/Spring Boot e Frontend em ReactJS) conectada ao banco de dados Oracle. O objetivo é um sistema de controle financeiro pessoal, focado em UX/UI premium, simplicidade e performance.

## 🏗️ Arquitetura do Sistema e Tecnologias

O projeto foi construído seguindo as melhores práticas de Clean Code e componentização.

### Backend (API REST)
* **Linguagem:** Java 17
* **Framework:** Spring Boot 3
* **Persistência:** Spring Data JPA + Hibernate
* **Banco de Dados:** Oracle DB (Instância hospedada da FIAP)
* **Padrões:** MVC (Model, View/Controller, Service, Repository), Injeção de Dependências.

### Frontend (SPA)
* **Framework:** ReactJS (com Vite)
* **Roteamento:** React Router DOM v6
* **Estilização:** CSS Modules (Vanilla CSS com Design System próprio, Cores HSL, Glassmorphism, Micro-interações)
* **Integração:** Axios HTTP Client
* **Qualidade:** ESLint configurado (Zero Warnings), Design Responsivo (Mobile-First adaptativo).

## 🔌 Entidades e Endpoints (API REST)
O sistema gerencia 3 entidades principais (Regras CRUD completas validadas). 
Todos os endpoints respondem aos verbos HTTP (GET, POST, PUT e DELETE) e gerenciam as constraints de FK em cascata (Ex: Deletar usuário apaga despesas).

1.  **Usuário:** `/usuarios`
2.  **Categoria:** `/categorias` (Vinculado a um Usuário, tipado como DESPESA ou RECEITA)
3.  **Despesa (Transação):** `/despesas` (Vinculado a um Usuário e a uma Categoria)

## 🚀 Como Rodar o Projeto (Passo a Passo)

### 1. Inicializando o Backend (Spring Boot)
1. Certifique-se de ter o JDK 17+ instalado na máquina.
2. Navegue até a pasta `backend/`.
3. Preencha suas credenciais (Usuário e Senha) do Oracle no arquivo `src/main/resources/application.properties`.
4. Compile e inicie o projeto via Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
5. O servidor iniciará na porta `8080`.

### 2. Inicializando o Frontend (ReactJS)
1. Certifique-se de ter o **Node.js** (v18+) instalado.
2. Abra um **novo terminal** e navegue até a pasta `frontend/`.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a aplicação no navegador através do link `http://localhost:5173`.

## 🔐 Dados de Autenticação para Teste
A autenticação inicial salva o estado no `sessionStorage`. Para acessar todas as telas protegidas do Dashboard, utilize:

* **Email de Teste:** `nicolas@fiap.com.br`
* **Senha:** `123456`

*(Nota: O banco de dados pode estar vazio caso as tabelas tenham sido dropadas. Se o login falhar, basta ir na tela de **"Criar Conta"** e registrar este mesmo e-mail antes de logar).*

## 🎨 Design System e Features de Destaque
- Componentização de Modais, Inputs e Botões com variantes (Outlined, Text, Filled).
- Tonal Segmented Controls para filtrar entre Despesas e Receitas.
- Tabela de Transações com *Sorting* clicável nas colunas.
- Cards Analíticos (Diagnostic Card) com barras de progresso baseadas na % de gastos do mês.
- Tooltips nativos e *Hover effects* polidos.

---
**FIAP - Faculdade de Informática e Administração Paulista - 2026**
