import assert from "node:assert/strict";
import test from "node:test";
import { FAVORITES_STORAGE_KEY, getFavoritesStorageKey, normalizeFavorites, readFavorites, toggleFavorite, writeFavorites } from "./favorites.mjs";

// Petit outil de vérification : expect(résultat).toBe(valeur) compare des valeurs simples,
// expect(résultat).toEqual(valeur) compare le contenu des tableaux/objets,
// et notToBe vérifie que deux valeurs sont différentes.
function expect(actual) {
  return {
    toBe(expected) {
      assert.equal(actual, expected);
    },
    toEqual(expected) {
      assert.deepEqual(actual, expected);
    },
    notToBe(expected) {
      assert.notEqual(actual, expected);
    },
  };
}

// Imitation très simple de localStorage, gardée uniquement en mémoire pendant le test.
// Cela permet de tester lecture/écriture sans ouvrir un navigateur ni toucher aux données réelles.
function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    // Renvoie la valeur enregistrée sous cette clé, ou null si la clé n'existe pas.
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    // Enregistre une valeur sous la clé, comme le ferait localStorage.
    setItem(key, value) { values.set(key, String(value)); },
  };
}

// Premier appel : le logement entre dans la liste; second appel sur le même logement : il en sort.
test("Favoris : un logement est ajouté en favori puis retiré lors du clic suivant", () => {
  const property = { id: "apt-1", title: "Appartement" };
  const added = toggleFavorite([], property);
  // En partant d'une liste vide, ajouter l'appartement doit produire une liste avec cet appartement.
  expect(added).toEqual([property]);
  // Refaire la même action sur la liste obtenue le retire : la liste redevient vide.
  expect(toggleFavorite(added, property)).toEqual([]);
});

// Si le logement est déjà dans la liste, l'action de bascule le supprime.
test("Favoris : un second clic sur un favori le retire de la liste", () => {
  const property = { id: "apt-1", title: "Appartement" };
  // La liste contient déjà l'appartement : l'action de bascule doit le supprimer.
  expect(toggleFavorite([property], property)).toEqual([]);
});

// Enregistrer puis relire la clé confirme que le favori est conservé dans le stockage.
test("Favoris : les favoris persistent dans le stockage pour la session du navigateur", () => {
  const storage = memoryStorage();
  const favorites = [{ id: "apt-1", title: "Appartement" }];
  const key = getFavoritesStorageKey(10);
  writeFavorites(storage, favorites, key);
  // La valeur stockée sous la clé de l'utilisateur doit être le JSON du favori.
  expect(storage.getItem(key)).toBe(JSON.stringify(favorites));
  // Relire cette clé doit reconstruire le même tableau de favoris.
  expect(readFavorites(storage, key)).toEqual(favorites);
});

// Les clés isolent les listes par utilisateur; les favoris enregistrés restent lisibles après déconnexion.
test("Favoris : chaque utilisateur a une clé de favoris distincte et la conserve après déconnexion", () => {
  const storage = memoryStorage();
  const firstUserKey = getFavoritesStorageKey(10);
  const secondUserKey = getFavoritesStorageKey(11);
  const favorites = [{ id: "apt-1", title: "Appartement" }];

  writeFavorites(storage, favorites, firstUserKey);

  // Chaque utilisateur reçoit une clé différente pour séparer ses favoris.
  expect(firstUserKey).notToBe(secondUserKey);
  // Le deuxième utilisateur n'a rien enregistré sous sa propre clé.
  expect(readFavorites(storage, secondUserKey)).toEqual([]);
  // Le favori du premier utilisateur reste présent sous sa clé après déconnexion.
  expect(readFavorites(storage, firstUserKey)).toEqual(favorites);
  // Sans identifiant utilisateur, l'application utilise la clé réservée aux visiteurs.
  expect(getFavoritesStorageKey(null)).toBe(`${FAVORITES_STORAGE_KEY}_guest`);
});

// Un JSON invalide donne une liste vide et les entrées sans identifiant sont ignorées.
test("Favoris : un stockage invalide ou des favoris mal formés sont récupérés sans erreur", () => {
  // Un contenu qui n'est pas du JSON valide est traité comme une liste vide plutôt que de faire planter la lecture.
  expect(readFavorites(memoryStorage({ [FAVORITES_STORAGE_KEY]: "not-json" }))).toEqual([]);
  // Les entrées sans identifiant sont ignorées; seul l'appartement identifié est conservé.
  expect(normalizeFavorites([null, {}, { id: "apt-1" }])).toEqual([{ id: "apt-1" }]);
});

// Le clic sur le cœur ajoute le logement à l'état favori, ce qui active son apparence sélectionnée.
test("Favoris : le cœur devient actif après l'ajout d'un logement", () => {
  const property = { id: "apt-1", title: "Appartement" };
  const favorites = toggleFavorite([], property);
  const heartIsActive = favorites.some((favorite) => String(favorite.id) === String(property.id));

  expect(heartIsActive).toBe(true);
});

// La page favoris relit dans le même stockage de session le logement ajouté depuis la grille.
test("Favoris : un logement ajouté apparaît dans Vos favoris pendant la même session", () => {
  const storage = memoryStorage();
  const property = { id: "apt-1", title: "Appartement", location: "Paris" };
  const sessionKey = getFavoritesStorageKey(null);

  const favoritesAfterClick = toggleFavorite(readFavorites(storage, sessionKey), property);
  writeFavorites(storage, favoritesAfterClick, sessionKey);

  // La page Vos favoris relit la même clé utilisée après le clic sur le cœur.
  const favoritesPageItems = readFavorites(storage, sessionKey);
  expect(favoritesPageItems).toEqual([property]);
  expect(favoritesPageItems.map(({ id }) => id)).toEqual([property.id]);
});
