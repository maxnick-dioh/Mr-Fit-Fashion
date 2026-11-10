import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Link href="/" className="auth-back">← Back to home</Link>
      <section className="auth-card">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in to your account.</h1>
        <p className="auth-intro">Access your account and continue your style journey.</p>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
