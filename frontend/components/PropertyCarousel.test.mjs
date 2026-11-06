import assert from "node:assert/strict";
import test from "node:test";
import { carouselReducer, getCarouselDirectionFromKey, getSelectableThumbnails, hasCarouselNavigation, initialCarouselState, normalizeCarouselImages } from "./carouselUtils.mjs";

// Helper local pour vérifier les résultats sans installer Jest ou Vitest.
function expect(actual) {
  return {
    toBe(expected) {
      assert.equal(actual, expected);
    },
    toEqual(expected) {
      assert.deepEqual(actual, expected);
    },
  };
}

test("Carrousel de la page logement : conserve toutes les photos fournies", () => {
  const pictures = ["photo-1.jpg", "photo-2.jpg", "photo-3.jpg", "photo-4.jpg", "photo-5.jpg", "photo-6.jpg"];
  expect(normalizeCarouselImages(pictures)).toEqual(pictures);
});

test("Carrousel de la page logement : affiche la photo principale du logement si aucune autre photo n'est fournie", () => {
  expect(normalizeCarouselImages([], "cover.jpg")).toEqual(["cover.jpg"]);
});

test("Carrousel de la page logement : ne propose pas de petites photos à sélectionner quand le logement n'a qu'une photo", () => {
  const images = normalizeCarouselImages(["only.jpg"]);
  expect(getSelectableThumbnails(images, 0)).toEqual([]);
});

test("Carrousel de la page logement : garde les cinq autres photos disponibles quand le logement en a six", () => {
  const images = normalizeCarouselImages(["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"]);
  expect(getSelectableThumbnails(images, 0).map(({ index }) => index)).toEqual([1, 2, 3, 4, 5]);
});

test("Carrousel de la page logement : ne répète pas la grande photo parmi les petites photos et garde toutes les autres disponibles", () => {
  const images = normalizeCarouselImages(["1.jpg", "2.jpg", "3.jpg"]);
  expect(getSelectableThumbnails(images, 1).map(({ index }) => index)).toEqual([0, 2]);
});

test("Carrousel de la page logement : la flèche Suivante revient à la première photo après la dernière", () => {
  const lastPhoto = { ...initialCarouselState, activeIndex: 5 };
  const nextPhoto = carouselReducer(lastPhoto, { type: "move-photo", direction: 1, imageCount: 6 });
  expect(nextPhoto.activeIndex).toBe(0);
});

test("Carrousel de la page logement : la flèche Précédente revient à la dernière photo depuis la première", () => {
  const previousPhoto = carouselReducer(initialCarouselState, { type: "move-photo", direction: -1, imageCount: 6 });
  expect(previousPhoto.activeIndex).toBe(5);
});

test("Carrousel de la page logement : n'affiche les flèches que s'il y a plusieurs photos", () => {
  expect(hasCarouselNavigation(1)).toBe(false);
  expect(hasCarouselNavigation(2)).toBe(true);
  const onlyPhoto = carouselReducer(initialCarouselState, { type: "move-photo", direction: 1, imageCount: 1 });
  expect(onlyPhoto.activeIndex).toBe(0);
});

test("Carrousel de la page logement : la flèche droite du clavier avance d'une photo", () => {
  expect(getCarouselDirectionFromKey("ArrowRight")).toBe(1);
});

test("Carrousel de la page logement : la flèche gauche du clavier recule d'une photo", () => {
  expect(getCarouselDirectionFromKey("ArrowLeft")).toBe(-1);
});

test("Carrousel de la page logement : les autres touches ne déclenchent pas la navigation", () => {
  expect(getCarouselDirectionFromKey("Enter")).toBe(0);
  expect(getCarouselDirectionFromKey("Escape")).toBe(0);
});

test("Carrousel de la page logement : l'action utilisée au clic sur la grande photo ouvre la galerie agrandie", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  expect(openGallery.lightboxOpen).toBe(true);
});

test("Galerie agrandie du carrousel : l'action utilisée par la croix et Échap revient à l'affichage normal", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  const closedGallery = carouselReducer(openGallery, { type: "close-lightbox" });
  expect(closedGallery.lightboxOpen).toBe(false);
});

test("Galerie agrandie du carrousel : l'action de sélection affiche une petite photo en grand sans fermer la galerie", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  const selectedPhoto = carouselReducer(openGallery, { type: "select-photo", photoIndex: 2, imageCount: 3 });
  expect(selectedPhoto.activeIndex).toBe(2);
  expect(selectedPhoto.lightboxOpen).toBe(true);
});

test("Galerie agrandie du carrousel : la flèche droite du clavier affiche la photo suivante", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  const nextPhoto = carouselReducer(openGallery, {
    type: "move-photo",
    direction: getCarouselDirectionFromKey("ArrowRight"),
    imageCount: 3,
  });

  expect(nextPhoto.activeIndex).toBe(1);
  expect(nextPhoto.lightboxOpen).toBe(true);
});

test("Galerie agrandie du carrousel : la flèche gauche du clavier revient à la dernière photo depuis la première", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  const previousPhoto = carouselReducer(openGallery, {
    type: "move-photo",
    direction: getCarouselDirectionFromKey("ArrowLeft"),
    imageCount: 3,
  });

  expect(previousPhoto.activeIndex).toBe(2);
  expect(previousPhoto.lightboxOpen).toBe(true);
});
