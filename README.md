# Mini Baccarat API

Fast and typed backend API for **Mini Baccarat API**, built with **Fastify**, **TypeScript**, and **Drizzle ORM (MySQL/MariaDB)**. Implements a layered architecture for maintainability and scalability.

---

## 🧩 Tech Stack

| **Category**   | **Technology**                                                                               |
| -------------- | -------------------------------------------------------------------------------------------- |
| Runtime        | [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)               |
| Framework      | [Fastify](https://fastify.dev/)                                                              |
| ORM            | [Drizzle ORM](https://orm.drizzle.team/) + [MySQL2](https://www.npmjs.com/package/mysql2)    |
| Database       | [MariaDB](https://mariadb.org/) / [MySQL](https://www.mysql.com/)                            |
| Validation     | [Zod](https://zod.dev/)                                                                      |
| Authentication | [JOSE](https://github.com/panva/jose) (JWT)                                                  |
| Logging        | [Pino](https://getpino.io/)                                                                  |
| Date Utils     | [Day.js](https://day.js.org/)                                                                |

---

## 🏗️ Architecture (Layered)
```
Routes → Controllers → Services → Repositories → Database
```
Each layer has a single responsibility:
- **Routes**: define API endpoints.
- **Controllers**: thin handler of HTTP requests and responses.
- **Services**: contain business logic.
- **Repositories**: abstract database access using Drizzle ORM.
- **Database Layer**: schema definitions.

---

## 📂 Project Structure
```
src/
├─ constants/             # Reusable constants
├─ db/
│  ├─ schema/             # Drizzle table definitions
│  └─ index.ts            # Database connection
├─ modules/
│  └─ [subfolder]/            # Each subfolder is a module containing its own layers 
│   ├─ [module].route.ts      # (route, controller, service, repository)
│   ├─ [module].controller.ts
│   ├─ [module].service.ts
│   ├─ [module].repository.ts
│   └─ [module].schema.ts           
├─ plugins/               # Fastify plugins (CORS, Zod, File Upload)
├─ routes/                # Re-exported route layers
├─ types/                 # Type definitions and interfaces
├─ utils/                 # Helpers (date, jwt, string, hash, etc.)
├─ app.ts                 # Fastify instance
└─ server.ts              # App bootstrap
```

---

## ⚙️ Environment Variables
Sensitive configuration such as database credentials, JWT secrets, and mail credentials are required.  
👉 **Please contact Jejo to obtain `.env` configuration details.**

> 🛑 Never commit real `.env` values to GitHub.

---

## Project Setup

### Clone this Repository

```sh
git clone https://github.com/jjmrbldz/mini-baccarat-api.git
cd mini-baccarat-api
```

## 🚀 How to Run
### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

### 3. Build and run production server
```bash
npm run build && npm run start
```

---

## 👨‍💻 Contact

For inquiries, environment setup, or backend access, please contact the project developer:

**Jejomar Baldoza**
📧 [jejomar.baldoza@gmail.com](mailto:jejomar.baldoza@gmail.com)