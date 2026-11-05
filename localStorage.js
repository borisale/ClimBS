function getFavoriteKey(element) {
    return typeof element === "string" ? element : element.id;
}

function getFavoritesFromLocalStorage() {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!Array.isArray(favorites)) {
        throw new TypeError("La lista de favoritos guardada no es válida.");
    }

    return favorites;
}

function saveFavoritesToLocalStorage(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function clearFavorites() {
    saveFavoritesToLocalStorage([]);
}

function addToFavorites(element) {
    const favorites = getFavoritesFromLocalStorage();
    const key = getFavoriteKey(element);
    if (!favorites.includes(key)) {
        favorites.push(key);
        saveFavoritesToLocalStorage(favorites);
    }
}

function removeFavorite(element) {
    const favorites = getFavoritesFromLocalStorage();
    const key = getFavoriteKey(element);
    const oldFavoriteIndex = favorites.indexOf(key);
    if (oldFavoriteIndex !== -1) {
        favorites.splice(oldFavoriteIndex, 1);
        saveFavoritesToLocalStorage(favorites);
    }
}

function toggleFavorite(element) {
    const favorites = getFavoritesFromLocalStorage();
    const key = getFavoriteKey(element);
    const oldFavoriteIndex = favorites.indexOf(key);
    if (oldFavoriteIndex === -1) {
        favorites.push(key);
    } else {
        favorites.splice(oldFavoriteIndex, 1);
    }

    saveFavoritesToLocalStorage(favorites);
    return oldFavoriteIndex === -1;
}

function isInFavorites(element) {
    const favorites = getFavoritesFromLocalStorage();
    return favorites.includes(getFavoriteKey(element));
}

export {
    saveFavoritesToLocalStorage,
    getFavoritesFromLocalStorage,
    addToFavorites,
    removeFavorite,
    clearFavorites,
    toggleFavorite,
    isInFavorites
};