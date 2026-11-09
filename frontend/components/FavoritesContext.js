"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { getFavoritesStorageKey, readFavorites, toggleFavorite, writeFavorites } from "@/lib/favorites.mjs";

const FavoritesContext = createContext(null);
const emptyFavorites = [];
let favoritesSnapshot = emptyFavorites;
let isReadySnapshot = false;
let activeStorageKey = null;
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function syncFromStorage() {
  let userId = null;
  try {
    userId = JSON.parse(window.localStorage.getItem("kasa_user") || "null")?.id ?? null;
  } catch {
    userId = null;
  }
  activeStorageKey = getFavoritesStorageKey(userId);
  const nextFavorites = readFavorites(window.localStorage, activeStorageKey);
  if (JSON.stringify(nextFavorites) !== JSON.stringify(favoritesSnapshot)) {
    favoritesSnapshot = nextFavorites;
  }
  isReadySnapshot = true;
  notifyListeners();
}

function handleStorage(event) {
  if (event.type === "kasa-auth-changed" || event.key === null || event.key === "kasa_user" || event.key === "kasa_token" || event.key === activeStorageKey) {
    syncFromStorage();
  }
}

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

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
