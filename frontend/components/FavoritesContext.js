"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { getFavoritesStorageKey, readFavorites, toggleFavorite, writeFavorites } from "@/lib/favorites.mjs";

const FavoritesContext = createContext(null);
const emptyFavorites = [];
let favoritesSnapshot = emptyFavorites;
let isReadySnapshot = false;
let activeStorageKey = null;
const listeners = new Set();

/** Notifie les abonnés que l'état partagé des favoris a changé. */
function notifyListeners() {
  listeners.forEach((listener) => listener());
}

/** Recharge l'identité et les favoris actifs depuis localStorage. */
function syncFromStorage() {
  let userId = null;
  try {
    // Les favoris sont isolés par utilisateur; sans session valide, on utilise la clé invité.
    userId = JSON.parse(window.localStorage.getItem("kasa_user") || "null")?.id ?? null;
  } catch {
    userId = null;
  }
  activeStorageKey = getFavoritesStorageKey(userId);
  const nextFavorites = readFavorites(window.localStorage, activeStorageKey);
  // Conserver la référence du snapshot quand son contenu n'a pas changé évite des rendus inutiles.
  if (JSON.stringify(nextFavorites) !== JSON.stringify(favoritesSnapshot)) {
    favoritesSnapshot = nextFavorites;
  }
  isReadySnapshot = true;
  notifyListeners();
}

/** Réagit aux modifications d'authentification ou de stockage des favoris. */
function handleStorage(event) {
  // Ignorer les changements sans rapport avec l'authentification ou les favoris actifs.
  if (event.type === "kasa-auth-changed" || event.key === null || event.key === "kasa_user" || event.key === "kasa_token" || event.key === activeStorageKey) {
    syncFromStorage();
  }
}

/**
 * Enregistre un composant React pour qu'il soit prévenu des changements de favoris.
 * Installe aussi les écouteurs navigateur pour détecter les mises à jour du stockage
 * local ou de l'état de connexion, puis les retire quand plus aucun composant n'est abonné.
 * @param {() => void} listener Fonction appelée pour prévenir React d'une mise à jour.
 * @returns {() => void} Fonction qui désabonne l'écouteur.
 */
function subscribe(listener) {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
    window.addEventListener("kasa-auth-changed", handleStorage);
  }

  if (typeof window !== "undefined") syncFromStorage();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("kasa-auth-changed", handleStorage);
    }
  };
}

function getFavoritesSnapshot() {
  return favoritesSnapshot;
}

function getReadySnapshot() {
  return isReadySnapshot;
}

function getServerFavoritesSnapshot() {
  return emptyFavorites;
}

function getServerReadySnapshot() {
  return false;
}

/** Fournit l'état des favoris et l'action de bascule à l'arbre React. */
export function FavoritesProvider({ children }) {
  const favorites = useSyncExternalStore(subscribe, getFavoritesSnapshot, getServerFavoritesSnapshot);
  const isReady = useSyncExternalStore(subscribe, getReadySnapshot, getServerReadySnapshot);

  const toggle = useCallback((property) => {
    if (!activeStorageKey) syncFromStorage();
    const nextFavorites = toggleFavorite(favoritesSnapshot, property);
    favoritesSnapshot = writeFavorites(window.localStorage, nextFavorites, activeStorageKey);
    isReadySnapshot = true;
    notifyListeners();
  }, []);

  const value = useMemo(() => ({
    favorites,
    isReady,
    isFavorite: (id) => favorites.some((favorite) => String(favorite.id) === String(id)),
    toggleFavorite: toggle,
  }), [favorites, isReady, toggle]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

/**
 * Accède aux favoris dans un composant descendant de FavoritesProvider.
 * @returns {{favorites: Array<Object>, isReady: boolean, isFavorite: (id: string|number) => boolean, toggleFavorite: (property: Object) => void}}
 * @throws {Error} Si le hook est utilisé hors de FavoritesProvider.
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
