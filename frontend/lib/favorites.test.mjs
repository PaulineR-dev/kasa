import assert from "node:assert/strict";
import test from "node:test";
import { FAVORITES_STORAGE_KEY, getFavoritesStorageKey, normalizeFavorites, readFavorites, toggleFavorite, writeFavorites } from "./favorites.mjs";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
  };
}

test("un logement est ajouté en favori puis retiré lors du clic suivant", () => {
  const property = { id: "apt-1", title: "Appartement" };
  const added = toggleFavorite([], property);
  assert.deepEqual(added, [property]);
  assert.deepEqual(toggleFavorite(added, property), []);
});

test("un second clic sur un favori le retire de la liste", () => {
  const property = { id: "apt-1", title: "Appartement" };
  assert.deepEqual(toggleFavorite([property], property), []);
});

test("les favoris persistent dans le stockage pour la session du navigateur", () => {
  const storage = memoryStorage();
  const favorites = [{ id: "apt-1", title: "Appartement" }];
  const key = getFavoritesStorageKey(10);
  writeFavorites(storage, favorites, key);
  assert.equal(storage.getItem(key), JSON.stringify(favorites));
  assert.deepEqual(readFavorites(storage, key), favorites);
});

test("chaque utilisateur a une clé de favoris distincte et la conserve après déconnexion", () => {
  const storage = memoryStorage();
  const firstUserKey = getFavoritesStorageKey(10);
  const secondUserKey = getFavoritesStorageKey(11);
  const favorites = [{ id: "apt-1", title: "Appartement" }];

  writeFavorites(storage, favorites, firstUserKey);

  assert.notEqual(firstUserKey, secondUserKey);
  assert.deepEqual(readFavorites(storage, secondUserKey), []);
  assert.deepEqual(readFavorites(storage, firstUserKey), favorites);
  assert.equal(getFavoritesStorageKey(null), `${FAVORITES_STORAGE_KEY}_guest`);
});

test("un stockage invalide ou des favoris mal formés sont récupérés sans erreur", () => {
  assert.deepEqual(readFavorites(memoryStorage({ [FAVORITES_STORAGE_KEY]: "not-json" })), []);
  assert.deepEqual(normalizeFavorites([null, {}, { id: "apt-1" }]), [{ id: "apt-1" }]);
});
