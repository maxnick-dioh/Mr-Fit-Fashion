## Authentication

Set `AUTH_SECRET` to a cryptographically random value of at least 32 bytes in
the application environment. For example, generate one with
`node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
The app also requires `DATABASE_URL` for PostgreSQL.

Customers can register at `/register` and sign in at `/login`. Passwords are
stored as salted scrypt hashes. Authentication uses a signed, HTTP-only,
SameSite=Lax cookie that expires after seven days; `/API/auth/session` returns
the current user and role, while `/API/auth/logout` revokes the user's current
session version and clears the browser cookie. Logging out revokes all of that
user's active sessions.
Public registration always assigns the `CUSTOMER` role. Assign administrator
roles only through a trusted, out-of-band database or administrative process.
Apply the Prisma migration with `npx prisma migrate deploy` before deploying
the session-version change. Registration responses do not disclose whether an
email address already has an account; users sign in after registering.