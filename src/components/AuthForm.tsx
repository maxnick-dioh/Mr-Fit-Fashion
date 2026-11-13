"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      phone: formData.get("phone")?.toString().trim() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };

    try {
      const endpoint = `/api/auth/${mode.toLowerCase()}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", response.status, text);
        setError(`Server error (${response.status}). Check console for details.`);
        return;
      }

      let result: { message?: string };
      try {
        result = await response.json();
      } catch {
        setError("The server returned an invalid response.");
        return;
      }

      if (!response.ok) {
        setError(result.message || "Unable to continue. Please try again.");
        return;
      }

      if (isRegister) {
        setNotice(result.message || "Continue to sign in.");
        return;
      }

      router.replace("/account");
      router.refresh();
    } catch (submitError) {
      console.error("Authentication request failed:", submitError);
      setError("Unable to connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {isRegister && (
        <>
          <label className="auth-field">
            Full name
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
            />
          </label>
          <label className="auth-field">
            Phone number <span>(optional)</span>
            <input name="phone" type="tel" autoComplete="tel" maxLength={30} />
          </label>
        </>
      )}

      <label className="auth-field">
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
        />
      </label>

      <label className="auth-field">
        Password
        <input
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          minLength={isRegister ? 12 : undefined}
          maxLength={128}
          required
        />
        {isRegister && <span>Use at least 12 characters.</span>}
      </label>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="auth-notice" role="status">
          {notice}
        </p>
      )}

      <button className="button button-gold auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
      </button>

      <p className="auth-switch">
        {isRegister ? "Already have an account?" : "New to Louiso Couture?"}{" "}
        <Link href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
