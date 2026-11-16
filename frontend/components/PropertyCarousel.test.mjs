import assert from "node:assert/strict";
import test from "node:test";
import { carouselReducer, getCarouselDirectionFromKey, getSelectableThumbnails, hasCarouselNavigation, initialCarouselState, normalizeCarouselImages } from "./carouselUtils.mjs";

// Petit outil de vérification : expect(résultat).toBe(valeur) compare deux valeurs simples,
// et expect(résultat).toEqual(valeur) compare aussi le contenu des tableaux et objets.
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

// On donne six photos au carrousel et on vérifie que les six sont conservées dans le même ordre.
test("Carrousel de la page logement : conserve toutes les photos fournies", () => {
  const pictures = ["photo-1.jpg", "photo-2.jpg", "photo-3.jpg", "photo-4.jpg", "photo-5.jpg", "photo-6.jpg"];
  // Résultat attendu : la liste préparée est exactement la liste fournie.
  expect(normalizeCarouselImages(pictures)).toEqual(pictures);
});

// Sans photo secondaire, la couverture devient l'unique image du carrousel.
test("Carrousel de la page logement : affiche la photo principale du logement si aucune autre photo n'est fournie", () => {
  // Résultat attendu : la couverture devient l'unique photo à afficher.
  expect(normalizeCarouselImages([], "cover.jpg")).toEqual(["cover.jpg"]);
});

// Avec une seule image, aucune miniature supplémentaire ne doit être affichée.
test("Carrousel de la page logement : ne propose pas de petites photos à sélectionner quand le logement n'a qu'une photo", () => {
  const images = normalizeCarouselImages(["only.jpg"]);
  // Résultat attendu : aucune miniature, puisqu'il n'y a pas d'autre photo que la grande.
  expect(getSelectableThumbnails(images, 0)).toEqual([]);
});

// Avec six images et la première affichée en grand, les cinq autres restent sélectionnables.
test("Carrousel de la page logement : garde les cinq autres photos disponibles quand le logement en a six", () => {
  const images = normalizeCarouselImages(["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"]);
  // Résultat attendu : les photos 2 à 6 (indices 1 à 5) sont proposées en miniatures.
  expect(getSelectableThumbnails(images, 0).map(({ index }) => index)).toEqual([1, 2, 3, 4, 5]);
});

// La miniature de l'image active est masquée, les autres restent disponibles.
test("Carrousel de la page logement : ne répète pas la grande photo parmi les petites photos et garde toutes les autres disponibles", () => {
  const images = normalizeCarouselImages(["1.jpg", "2.jpg", "3.jpg"]);
  // Résultat attendu : l'image active (indice 1) est exclue, les indices 0 et 2 restent.
  expect(getSelectableThumbnails(images, 1).map(({ index }) => index)).toEqual([0, 2]);
});

// La navigation est circulaire : Suivante depuis la dernière image revient au début.
test("Carrousel de la page logement : la flèche Suivante revient à la première photo après la dernière", () => {
  const lastPhoto = { ...initialCarouselState, activeIndex: 5 };
  const nextPhoto = carouselReducer(lastPhoto, { type: "move-photo", direction: 1, imageCount: 6 });
  // Résultat attendu : après l'indice 5, Suivante revient à l'indice 0, donc à la première photo.
  expect(nextPhoto.activeIndex).toBe(0);
});

// La navigation est circulaire dans l'autre sens : Précédente depuis le début va à la fin.
test("Carrousel de la page logement : la flèche Précédente revient à la dernière photo depuis la première", () => {
  const previousPhoto = carouselReducer(initialCarouselState, { type: "move-photo", direction: -1, imageCount: 6 });
  // Résultat attendu : avant l'indice 0, Précédente boucle vers l'indice 5, la dernière photo.
  expect(previousPhoto.activeIndex).toBe(5);
});

// Les flèches sont inutiles pour une image; avec plusieurs images, elles sont activées.
test("Carrousel de la page logement : n'affiche les flèches que s'il y a plusieurs photos", () => {
  // Une image : pas de flèches. Deux images : les flèches sont nécessaires.
  expect(hasCarouselNavigation(1)).toBe(false);
  expect(hasCarouselNavigation(2)).toBe(true);
  const onlyPhoto = carouselReducer(initialCarouselState, { type: "move-photo", direction: 1, imageCount: 1 });
  // Même si on demande Suivante avec une image unique, l'index reste à 0.
  expect(onlyPhoto.activeIndex).toBe(0);
});

// La touche flèche droite correspond au déplacement vers la photo suivante.
test("Carrousel de la page logement : la flèche droite du clavier avance d'une photo", () => {
  // Résultat attendu : la touche droite est convertie en direction +1 (photo suivante).
  expect(getCarouselDirectionFromKey("ArrowRight")).toBe(1);
});

// La touche flèche gauche correspond au déplacement vers la photo précédente.
test("Carrousel de la page logement : la flèche gauche du clavier recule d'une photo", () => {
  // Résultat attendu : la touche gauche est convertie en direction -1 (photo précédente).
  expect(getCarouselDirectionFromKey("ArrowLeft")).toBe(-1);
});

// Les touches sans direction reconnue ne doivent pas déplacer le carrousel.
test("Carrousel de la page logement : les autres touches ne déclenchent pas la navigation", () => {
  // Entrée et Échap ne correspondent pas à un déplacement : la direction vaut 0.
  expect(getCarouselDirectionFromKey("Enter")).toBe(0);
  expect(getCarouselDirectionFromKey("Escape")).toBe(0);
});

// L'action d'ouverture fait passer la galerie à son état agrandi.
test("Carrousel de la page logement : l'action utilisée au clic sur la grande photo ouvre la galerie agrandie", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  // Résultat attendu : l'action d'ouverture met la galerie en état ouvert.
  expect(openGallery.lightboxOpen).toBe(true);
});

// Fermer la galerie, avec la croix ou Échap, restaure l'affichage normal.
test("Galerie agrandie du carrousel : l'action utilisée par la croix et Échap revient à l'affichage normal", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  const closedGallery = carouselReducer(openGallery, { type: "close-lightbox" });
  // Résultat attendu : après fermeture, l'indicateur de galerie ouverte vaut false.
  expect(closedGallery.lightboxOpen).toBe(false);
});

// Choisir une miniature change l'image agrandie et laisse la galerie ouverte.
test("Galerie agrandie du carrousel : l'action de sélection affiche une petite photo en grand sans fermer la galerie", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  const selectedPhoto = carouselReducer(openGallery, { type: "select-photo", photoIndex: 2, imageCount: 3 });
  // L'image d'indice 2 est sélectionnée : c'est la troisième photo (les indices commencent à 0).
  expect(selectedPhoto.activeIndex).toBe(2);
  // La sélection change la photo affichée mais laisse la galerie agrandie ouverte.
  expect(selectedPhoto.lightboxOpen).toBe(true);
});

// Dans la galerie agrandie, la flèche droite avance sans fermer celle-ci.
test("Galerie agrandie du carrousel : la flèche droite du clavier affiche la photo suivante", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  const nextPhoto = carouselReducer(openGallery, {
    type: "move-photo",
    direction: getCarouselDirectionFromKey("ArrowRight"),
    imageCount: 3,
  });

  // Dans la galerie, la flèche droite sélectionne la deuxième photo.
  expect(nextPhoto.activeIndex).toBe(1);
  // La galerie reste ouverte pendant le changement de photo.
  expect(nextPhoto.lightboxOpen).toBe(true);
});

// Dans la galerie agrandie, la flèche gauche boucle de la première image à la dernière.
test("Galerie agrandie du carrousel : la flèche gauche du clavier revient à la dernière photo depuis la première", () => {
  const openGallery = carouselReducer(initialCarouselState, { type: "open-lightbox" });
  const previousPhoto = carouselReducer(openGallery, {
    type: "move-photo",
    direction: getCarouselDirectionFromKey("ArrowLeft"),
    imageCount: 3,
  });

  // Depuis la première photo, la flèche gauche boucle jusqu'à la troisième et dernière.
  expect(previousPhoto.activeIndex).toBe(2);
  // La galerie reste ouverte pendant cette navigation circulaire.
  expect(previousPhoto.lightboxOpen).toBe(true);
});
