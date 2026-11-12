export const FAVORITES_STORAGE_KEY = "kasa_favorites";
export const GUEST_FAVORITES_STORAGE_KEY = `${FAVORITES_STORAGE_KEY}_guest`;

/**
 * Choisit la clé de stockage des favoris d'un visiteur ou d'un utilisateur.
 * @param {string|number|null|undefined} userId Identifiant de l'utilisateur connecté.
 * @returns {string} Clé correspondante dans le stockage local.
 */
export function getFavoritesStorageKey(userId) {
  return userId == null || userId === ""
    ? GUEST_FAVORITES_STORAGE_KEY
    : `${FAVORITES_STORAGE_KEY}_user_${userId}`;
}

/**
 * Filtre une valeur pour ne garder que les favoris ayant un identifiant.
 * @param {*} value Valeur lue ou reçue comme liste de favoris.
 * @returns {Array<Object>} Liste normalisée de logements favoris.
 */
export function normalizeFavorites(value) {
  return Array.isArray(value) ? value.filter((item) => item && item.id != null) : [];
}

/**
 * Ajoute un logement aux favoris ou le retire s'il y figure déjà.
 * @param {Array<Object>} favorites Favoris actuels.
 * @param {Object} property Logement à basculer dans les favoris.
 * @returns {Array<Object>} Nouvelle liste de favoris.
 */
export function toggleFavorite(favorites, property) {
  const current = normalizeFavorites(favorites);
  const exists = current.some((favorite) => String(favorite.id) === String(property.id));
  return exists
    ? current.filter((favorite) => String(favorite.id) !== String(property.id))
    : [...current, property];
}

/**
 * Lit et normalise une liste de favoris depuis un stockage de type Storage.
 * @param {Storage} storage Source de stockage.
 * @param {string} [storageKey=FAVORITES_STORAGE_KEY] Clé à lire.
 * @returns {Array<Object>} Favoris enregistrés, ou liste vide si la lecture échoue.
 */
export function readFavorites(storage, storageKey = FAVORITES_STORAGE_KEY) {
  try {
    return normalizeFavorites(JSON.parse(storage.getItem(storageKey) || "[]"));
  } catch {
    return [];
  }
}

/**
 * Normalise et enregistre les favoris dans un stockage de type Storage.
 * @param {Storage} storage Destination de stockage.
 * @param {Array<Object>} favorites Favoris à enregistrer.
 * @param {string} [storageKey=FAVORITES_STORAGE_KEY] Clé à écrire.
 * @returns {Array<Object>} Liste normalisée enregistrée.
 */
export function writeFavorites(storage, favorites, storageKey = FAVORITES_STORAGE_KEY) {
  const normalized = normalizeFavorites(favorites);
  storage.setItem(storageKey, JSON.stringify(normalized));
  return normalized;
}
