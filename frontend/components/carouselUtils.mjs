export function normalizeCarouselImages(pictures, cover) {
  const images = Array.isArray(pictures) ? pictures.filter(Boolean) : [];
  return images.length ? images : cover ? [cover] : [];
}

export function getSelectableThumbnails(images, activeIndex) {
  return images
    .map((src, index) => ({ src, index }))
    .filter((image) => image.index !== activeIndex);
}

export function wrapCarouselIndex(index, count) {
  return count > 0 ? ((index % count) + count) % count : 0;
}

export function hasCarouselNavigation(count) {
  return count > 1;
}

export function getCarouselDirectionFromKey(key) {
  if (key === "ArrowLeft") return -1;
  if (key === "ArrowRight") return 1;
  return 0;
}

export const initialCarouselState = {
  activeIndex: 0,
  lightboxOpen: false,
};

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
