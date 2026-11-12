/**
 * Produit la liste d'images du carrousel, avec la couverture en solution de repli.
 * @param {Array<string>} pictures Images secondaires fournies par le logement.
 * @param {string} [cover] Image de couverture utilisée si aucune photo n'est disponible.
 * @returns {Array<string>} URLs d'images valides.
 */
export function normalizeCarouselImages(pictures, cover) {
  const images = Array.isArray(pictures) ? pictures.filter(Boolean) : [];
  return images.length ? images : cover ? [cover] : [];
}

/**
 * Retourne les miniatures autres que l'image actuellement sélectionnée.
 * @param {Array<string>} images Images du carrousel.
 * @param {number} activeIndex Index de l'image active.
 * @returns {Array<{src: string, index: number}>} Miniatures sélectionnables.
 */
export function getSelectableThumbnails(images, activeIndex) {
  return images
    .map((src, index) => ({ src, index }))
    .filter((image) => image.index !== activeIndex);
}

/** Calcule un index de carrousel circulaire, ou zéro si la liste est vide. */
export function wrapCarouselIndex(index, count) {
  return count > 0 ? ((index % count) + count) % count : 0;
}

/** Indique si un carrousel a assez d'images pour afficher la navigation. */
export function hasCarouselNavigation(count) {
  return count > 1;
}

/** Convertit une touche fléchée en direction de déplacement du carrousel. */
export function getCarouselDirectionFromKey(key) {
  if (key === "ArrowLeft") return -1;
  if (key === "ArrowRight") return 1;
  return 0;
}

/** État initial du carrousel : première image sélectionnée et galerie fermée. */
export const initialCarouselState = {
  activeIndex: 0,
  lightboxOpen: false,
};

/**
 * Réduit une action du carrousel en son nouvel état (navigation ou galerie).
 * @param {{activeIndex: number, lightboxOpen: boolean}} state État courant.
 * @param {Object} action Action à appliquer.
 * @returns {{activeIndex: number, lightboxOpen: boolean}} Nouvel état.
 */
export function carouselReducer(state, action) {
  switch (action.type) {
    case "open-lightbox":
      return { ...state, lightboxOpen: true };
    case "close-lightbox":
      return { ...state, lightboxOpen: false };
    case "select-photo":
      if (action.photoIndex < 0 || action.photoIndex >= action.imageCount) return state;
      return { ...state, activeIndex: action.photoIndex };
    case "move-photo":
      return {
        ...state,
        activeIndex: wrapCarouselIndex(state.activeIndex + action.direction, action.imageCount),
      };
    default:
      return state;
  }
}
