"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/api/auth";
import styles from "./signup.module.css";

export default function SignupPage() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { response, result } = await registerUser({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email,
        password,
        role: "client",
      });

      if (!response.ok) {
        setError(response.status === 409
          ? "Cette adresse e-mail est déjà utilisée."
          : result.error === "password must be at least 6 characters"
            ? "Le mot de passe doit contenir au moins 6 caractères."
            : result.error || "La création du compte a échoué. Veuillez réessayer.");
        return;
      }

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
    <main className={styles.signupPage}>
      <section className={styles.signupCard} aria-labelledby="signup-title">
        <h1 id="signup-title">Rejoignez la <br className={styles.mobileTitleBreak} />communauté Kasa</h1>
        <p className={styles.intro}>
          Créez votre compte et commencez à voyager autrement : réservez des<br className={styles.desktopBreak} />
          logements uniques, découvrez de nouvelles destinations et partagez vos<br className={styles.desktopBreak} />
          propres lieux avec d&apos;autres voyageurs.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="lastName">Nom</label>
            <input id="lastName" name="lastName" type="text" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="firstName">Prénom</label>
            <input id="firstName" name="firstName" type="text" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">Adresse email</label>
            <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div className={styles.terms}>
            <input
              id="acceptedTerms"
              name="acceptedTerms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              required
            />
            <label htmlFor="acceptedTerms">
              J&apos;accepte les <u>conditions générales d&apos;utilisation</u>
            </label>
          </div>
          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Inscription…" : "S'inscrire"}
          </button>
        </form>

        {error && <p className={styles.error} role="alert">{error}</p>}
        <p className={styles.login}>Déjà membre ? <Link href="/login">Se connecter</Link></p>
      </section>
    </main>
  );
}
