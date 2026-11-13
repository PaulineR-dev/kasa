"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./messages.module.css";

/** Écran de démonstration de la messagerie, sans envoi ni stockage de messages. */
export default function MessagesPage() {
  const router = useRouter();
  const closeOverlay = useCallback(() => router.back(), [router]);

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeOverlay();
    }}>
      <main className={styles.overlay} role="dialog" aria-modal="true" aria-label="Messagerie">
        <aside className={styles.sidebar}>
          <button className={styles.backButton} type="button" onClick={closeOverlay}>
            <Image className={styles.backArrow} src="/images/arrow.png" alt="" width={8} height={6} />
            <span>Retour</span>
          </button>
          <h1 className={styles.title}>Messages</h1>
        </aside>

        <section className={styles.chatColumn} aria-label="Aperçu de la conversation">
          <div className={styles.chatPanel} aria-hidden="true" />
          <form className={styles.composerWrap} onSubmit={(event) => event.preventDefault()}>
            <div className={styles.composer}>
              <label className={styles.visuallyHidden} htmlFor="message-draft">Envoyer un message</label>
              <textarea id="message-draft" placeholder="Envoyer un message" />
              <button className={styles.sendButton} type="button" aria-label="Envoyer un message">
                <Image src="/images/arrow.png" alt="" width={8} height={6} />
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
