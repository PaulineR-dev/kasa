"use client";

import { useEffect, useReducer, useRef } from "react";
import Image from "next/image";
import { carouselReducer, getCarouselDirectionFromKey, getSelectableThumbnails, hasCarouselNavigation, initialCarouselState, normalizeCarouselImages } from "./carouselUtils.mjs";
import styles from "./PropertyCarousel.module.css";

/**
 * Affiche la galerie d'un logement avec navigation, miniatures et visionneuse modale.
 * @param {{pictures?: Array<string>, cover?: string, title: string}} props Photos et titre du logement.
 */
export default function PropertyCarousel({ pictures = [], cover, title }) {
  const images = normalizeCarouselImages(pictures, cover);
  const [carouselState, dispatch] = useReducer(carouselReducer, initialCarouselState);
  const { activeIndex, lightboxOpen } = carouselState;
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const mainImageButtonRef = useRef(null);
  const thumbnails = getSelectableThumbnails(images, activeIndex);
  const hasNavigation = hasCarouselNavigation(images.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Synchroniser l'état React avec l'API native du dialogue modal et déplacer le focus à son ouverture.
    if (lightboxOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!lightboxOpen && dialog.open) {
      dialog.close();
    }
  }, [lightboxOpen]);

  useEffect(() => {
    if (!hasNavigation) return undefined;

    const handlePageKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;

      const target = event.target;
      // Les flèches restent disponibles pour saisir du texte dans les champs et éditeurs.
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select, [role='textbox']"))) {
        return;
      }

      const direction = getCarouselDirectionFromKey(event.key);
      if (!direction) return;

      event.preventDefault();
      dispatch({ type: "move-photo", direction, imageCount: images.length });
    };

    window.addEventListener("keydown", handlePageKeyDown);
    return () => window.removeEventListener("keydown", handlePageKeyDown);
  }, [dispatch, hasNavigation, images.length]);

  if (images.length === 0) {
    return <div className={styles.empty} aria-label="Aucune photo disponible" />;
  }

  const selectImage = (index) => dispatch({ type: "select-photo", photoIndex: index, imageCount: images.length });
  const move = (direction) => dispatch({ type: "move-photo", direction, imageCount: images.length });

  const handleDialogClose = () => {
    dispatch({ type: "close-lightbox" });
    mainImageButtonRef.current?.focus();
  };

  return (
    <>
      <section
        className={styles.carousel}
        role="region"
        aria-roledescription="carrousel"
        aria-label={`Photos de ${title}`}
        aria-keyshortcuts="ArrowLeft ArrowRight"
        tabIndex={0}
      >
        <div className={styles.mosaic}>
          <div className={styles.mainPhoto}>
            <button
              ref={mainImageButtonRef}
              className={styles.mainImageButton}
              type="button"
              aria-label={`Agrandir la photo ${activeIndex + 1}`}
              onClick={() => dispatch({ type: "open-lightbox" })}
            >
              <Image
                key={activeIndex}
                className={styles.image}
                src={images[activeIndex]}
                alt={`${title} — photo ${activeIndex + 1}`}
                fill
                quality={90}
                priority
                sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 980px) calc(50vw - 30px), 303px"
              />
            </button>
            {hasNavigation && (
              <>
                <button className={`${styles.arrow} ${styles.previous}`} type="button" aria-label="Photo précédente" onClick={() => move(-1)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button className={`${styles.arrow} ${styles.next}`} type="button" aria-label="Photo suivante" onClick={() => move(1)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </>
            )}
          </div>
          {thumbnails.length > 0 && (
            <div className={styles.thumbnailArea}>
              <div
                className={styles.thumbnails}
                style={{
                  "--thumbnail-rows": Math.ceil(thumbnails.length / 2),
                }}
                role="group"
                aria-label="Choisir une photo principale"
              >
                {thumbnails.map(({ src, index }) => (
                  <button
                    className={styles.thumbnail}
                    key={`${src}-${index}`}
                    type="button"
                    aria-label={`Afficher la photo ${index + 1}`}
                    onClick={() => selectImage(index)}
                  >
                    <Image className={styles.image} src={src} alt="" fill quality={90} sizes="(max-width: 600px) calc((100vw - 56px) / 4), (max-width: 980px) calc(25vw - 19px), 146px" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className={styles.lightboxDialog}
        aria-label={`Galerie photos de ${title}`}
        onCancel={(event) => {
          event.preventDefault();
          dispatch({ type: "close-lightbox" });
        }}
        onClose={handleDialogClose}
      >
        <div className={styles.lightboxContent}>
          <button
            ref={closeButtonRef}
            className={styles.lightboxClose}
            type="button"
            aria-label="Fermer la galerie"
            onClick={() => dispatch({ type: "close-lightbox" })}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
          <div className={styles.lightboxFigure}>
            {hasNavigation && (
              <button className={`${styles.lightboxArrow} ${styles.lightboxPrevious}`} type="button" aria-label="Photo précédente" onClick={() => move(-1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              </button>
            )}
            <div className={styles.lightboxFrame}>
              <Image
                key={`lightbox-${activeIndex}`}
                className={styles.lightboxImage}
                src={images[activeIndex]}
                alt={`${title} — photo ${activeIndex + 1}`}
                fill
                quality={90}
                sizes="90vw"
              />
            </div>
            {hasNavigation && (
              <button className={`${styles.lightboxArrow} ${styles.lightboxNext}`} type="button" aria-label="Photo suivante" onClick={() => move(1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.lightboxThumbnails} role="group" aria-label="Choisir une photo">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  className={`${styles.lightboxThumbnail} ${activeIndex === index ? styles.lightboxThumbnailActive : ""}`}
                  type="button"
                  aria-label={`Afficher la photo ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  onClick={() => selectImage(index)}
                >
                  <Image src={src} alt="" fill quality={90} sizes="88px" />
                </button>
              ))}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
