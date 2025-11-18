# Edutech Backend

Requirements:
- Node 18+ (or compatible)
- MongoDB running (local or remote). See `.env.example`.

Install & run:

```powershell
cd backend
npm install
copy .env.example .env
# edit .env and set MONGO_URI and JWT_SECRET
npm run dev
```

API summary:
- POST `/auth/signup` - create user (role: "student" or "teacher"). Students must include `teacherId`.
- POST `/auth/login` - returns `{ token }`
- GET `/tasks` - list tasks based on role
- POST `/tasks` - create a task (userId must equal logged-in user)
- PUT `/tasks/:id` - update only if owner
- DELETE `/tasks/:id` - delete only if owner
