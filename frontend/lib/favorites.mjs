export const FAVORITES_STORAGE_KEY = "kasa_favorites";
export const GUEST_FAVORITES_STORAGE_KEY = `${FAVORITES_STORAGE_KEY}_guest`;

export function getFavoritesStorageKey(userId) {
  return userId == null || userId === ""
    ? GUEST_FAVORITES_STORAGE_KEY
    : `${FAVORITES_STORAGE_KEY}_user_${userId}`;
}

export function normalizeFavorites(value) {
  return Array.isArray(value) ? value.filter((item) => item && item.id != null) : [];
}

export function toggleFavorite(favorites, property) {
  const current = normalizeFavorites(favorites);
  const exists = current.some((favorite) => String(favorite.id) === String(property.id));
  return exists
    ? current.filter((favorite) => String(favorite.id) !== String(property.id))
    : [...current, property];
}

export function readFavorites(storage, storageKey = FAVORITES_STORAGE_KEY) {
  try {
    return normalizeFavorites(JSON.parse(storage.getItem(storageKey) || "[]"));
  } catch {
    return [];
  }
}

export function writeFavorites(storage, favorites, storageKey = FAVORITES_STORAGE_KEY) {
  const normalized = normalizeFavorites(favorites);
  storage.setItem(storageKey, JSON.stringify(normalized));
  return normalized;
}
