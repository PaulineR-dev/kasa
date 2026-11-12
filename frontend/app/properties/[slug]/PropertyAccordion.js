"use client";

import { useId, useState } from "react";
import styles from "./PropertyAccordion.module.css";
import propertyStyles from "./property.module.css";

/** Affiche une liste repliable d'équipements ou de catégories d'un logement. */
export default function PropertyAccordion({ title, items = [] }) {
  const [isOpen, setIsOpen] = useState(true);
  const panelId = useId();

  if (!items.length) return null;

  return (
    <section className={propertyStyles.group}>
      <button
        className={styles.trigger}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{title}</span>
        <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
          <path d="m3 6 5 5 5-5" />
        </svg>
      </button>
      <div
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
        id={panelId}
        aria-hidden={!isOpen}
      >
        <div className={styles.panelInner}>
          <ul className={propertyStyles.chips}>
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
