import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <Link href="/" className="auth-back">← Back to home</Link>
      <section className="auth-card">
        <p className="eyebrow">JOIN LOUISO COUTURE</p>
        <h1>Create your account.</h1>
        <p className="auth-intro">Register to make your personal style experience yours.</p>
        <AuthForm mode="register" />
      </section>
    </main>
  );
}
