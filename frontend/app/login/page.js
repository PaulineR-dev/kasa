"use client";

import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/lib/api/auth";
import styles from "./login.module.css";

/** Affiche le formulaire de connexion et gère son envoi à l'API. */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { response, result } = await loginUser({ email, password });

      // Distinguer les identifiants invalides des autres erreurs renvoyées par l'API.
      if (!response.ok) {
        setError(response.status === 401 ? "Adresse email ou mot de passe incorrect." : result.error || "La connexion a échoué. Veuillez réessayer.");
        return;
      }

      // La session locale permet à l'en-tête et aux favoris de reconnaître l'utilisateur.
      if (result.token) window.localStorage.setItem("kasa_token", result.token);
      if (result.user) window.localStorage.setItem("kasa_user", JSON.stringify(result.user));
      window.dispatchEvent(new Event("kasa-auth-changed"));
      window.location.assign("/");
    } catch {
      setError("Le service est indisponible. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard} aria-labelledby="login-title">
        <h1 id="login-title">Heureux de vous revoir</h1>
        <p className={styles.intro}>
          Connectez-vous pour retrouver vos réservations,<br className={styles.mobileBreak} /> vos<br className={styles.desktopBreak} /> annonces et tout ce qui rend vos séjours<br className={styles.mobileBreak} /> uniques.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {error && <p className={styles.error} role="alert">{error}</p>}
        <Link className={styles.forgot} href="/forgot-password">Mot de passe oublié</Link>
        <p className={styles.signup}>Pas encore de compte ? <Link href="/signup">Inscrivez-vous</Link></p>
      </section>
    </main>
  );
}
