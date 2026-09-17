# SkillSphere Enterprise

An enterprise-style employee skills & profile portal — authentication (signup, login,
forgot/reset password), an employee directory, self-service profiles, and a
skills-with-star-ratings system, backed by a Spring Boot REST API and a React
(Vite) frontend.

---

## 1. Project Structure

```
SkillSphere-Enterprise/
├── backend/           Spring Boot 3 REST API (Java 17, JWT auth, H2/MySQL)
└── frontend/          React + Vite single-page app
```

## 2. Requirements

- **Java 17+** and **Maven** (or just use the included `mvnw` wrapper — no Maven install needed)
- **Node.js 18+** and npm

## 3. Running the Backend

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API starts on **http://localhost:8080**.

No database setup is required — the app uses an embedded **H2** file database
(`backend/data/skillsphere.mv.db`) that is created automatically on first run.

On first startup, demo data is seeded automatically so you can log in immediately:

| Role     | Email                          | Password       |
|----------|---------------------------------|----------------|
| Admin    | admin@skillsphere.com          | Admin@123      |
| Employee | rahul.verma@skillsphere.com    | Employee@123   |
| Employee | priya.nair@skillsphere.com     | Employee@123   |

You can also just sign up a brand-new account from the app itself.

> Want MySQL instead? Create a database called `skillsphere`, edit the
> credentials in `backend/src/main/resources/application-mysql.properties`,
> then run: `./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql`

## 4. Running the Frontend

In a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and talks to the backend at
`http://localhost:8080/api` (configurable via `frontend/.env` — copy
`.env.example` if you need to change it).

Then open **http://localhost:5173** in your browser.

## 5. Features

**Authentication**
- Sign up (creates an `EMPLOYEE`-role account)
- Log in (JWT-based session)
- Forgot password → generates a reset link (no email server is wired up for
  this demo, so the link/token is returned directly in the UI instead of
  being emailed — see the note on the "Forgot Password" screen)
- Reset password with that token
- Change password from the profile page

**Employee Directory**
- Searchable, filterable list of all employees
- Click through to any colleague's profile to see their skills & ratings

**My Profile**
- Employees can view and edit their own profile (name, phone, bio, designation)
- Add skills from a shared catalog, or create brand-new ones on the fly
- Self-rate each skill 1–5 stars, plus years of experience
- Update or remove skills at any time

**Admin**
- A separate "Manage Employees" screen (visible only to `ADMIN` accounts)
  for full CRUD over employee records

## 6. Tech Stack

- **Backend:** Spring Boot 3.3, Spring Security (JWT via `jjwt`), Spring Data
  JPA/Hibernate, H2 (default) / MySQL (optional), Bean Validation, Lombok
- **Frontend:** React 18, React Router 6, Axios, plain CSS (no UI framework —
  hand-styled to look like an internal enterprise tool)

## 7. API Overview

| Method | Endpoint                             | Auth        | Description                     |
|--------|---------------------------------------|-------------|----------------------------------|
| POST   | `/api/auth/signup`                    | Public      | Create an account                |
| POST   | `/api/auth/login`                     | Public      | Log in, returns a JWT            |
| POST   | `/api/auth/forgot-password`           | Public      | Generate a reset token/link      |
| POST   | `/api/auth/reset-password`            | Public      | Reset password using the token   |
| GET    | `/api/employees`                      | Any user    | List all employees               |
| GET    | `/api/employees/{id}`                 | Any user    | View an employee's public profile|
| GET    | `/api/employees/me`                   | Any user    | Your own profile                 |
| PUT    | `/api/employees/me`                   | Any user    | Update your own profile          |
| POST   | `/api/employees/me/change-password`   | Any user    | Change your password             |
| POST   | `/api/employees`                      | Admin only  | Create an employee               |
| PUT    | `/api/employees/{id}`                 | Admin only  | Update an employee                |
| DELETE | `/api/employees/{id}`                 | Admin only  | Delete an employee                |
| GET    | `/api/skills`                         | Any user    | Global skill catalog             |
| GET    | `/api/employees/me/skills`            | Any user    | Your skills & ratings            |
| POST   | `/api/employees/me/skills`            | Any user    | Add/update a skill rating        |
| DELETE | `/api/employees/me/skills/{skillId}`  | Any user    | Remove a skill                   |

## 8. Notes for Reviewers / Grading

- The whole app runs from a cold clone with just the two commands above — no
  external services, API keys, or database installs required.
- `backend/src/main/resources/application.properties` documents every
  configurable value (JWT secret/expiry, CORS origin, seed toggle).
- To reset all data, stop the backend and delete the `backend/data/` folder,
  then start it again — the seed data will be recreated.
