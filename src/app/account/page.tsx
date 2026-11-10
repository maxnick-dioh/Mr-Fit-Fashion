import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export default function AccountPage() {
  return (
    <main className="auth-page">
      <Link href="/" className="auth-back">← Back to home</Link>
      <Suspense fallback={<AccountLoading />}>
        <AccountDetails />
      </Suspense>
    </main>
  );
}

async function AccountDetails() {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <section className="auth-card account-card">
      <p className="eyebrow">YOUR ACCOUNT</p>
      <h1>Welcome, {user.fullName}.</h1>
      <dl className="account-details">
        <div>
          <dt>Email address</dt>
          <dd>{user.email}</dd>
        </div>
        {user.phone && (
          <div>
            <dt>Phone number</dt>
            <dd>{user.phone}</dd>
          </div>
        )}
        <div>
          <dt>Account role</dt>
          <dd>{user.role === "ADMIN" ? "Administrator" : "Customer"}</dd>
        </div>
      </dl>
      <LogoutButton />
    </section>
  );
}

function AccountLoading() {
  return (
    <section className="auth-card account-card" aria-busy="true">
      <p className="eyebrow">YOUR ACCOUNT</p>
      <h1>Loading your account...</h1>
    </section>
  );
}
