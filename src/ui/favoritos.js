import { getFavoritesFromLocalStorage, isInFavorites, toggleFavorite } from "../../localStorage.js";
import Paginator from "./paginator.js";
import { createMessage, createSectorCard, updateFavoriteButton } from "./renderer.js";
import { fetchJson, loadSectorPhoto, showSectorWeather } from "../utils/sectorServices.js";

const sectoresContent = document.getElementById("sectionSectores");
const buscadorSectores = document.getElementById("buscadorSectores");
const tituloFavoritos = document.getElementById("tituloPais");
const paginacionSectores = document.getElementById("paginacionSectores");
const paginaAnterior = document.getElementById("paginaAnterior");
const paginaSiguiente = document.getElementById("paginaSiguiente");
const informacionPagina = document.getElementById("informacionPagina");

let listaSectores = [];

const paginator = new Paginator({
    containerId: "sectionSectores",
    items: [],
    renderItem: renderFavoriteCard,
    pageSize: 4,
    onChange: updatePagination
});

buscadorSectores.addEventListener("input", updateFavoriteResults);
paginaAnterior.addEventListener("click", () => paginator.previousPage());
paginaSiguiente.addEventListener("click", () => paginator.nextPage());
loadFavorites();

async function loadFavorites() {
    try {
        listaSectores = await fetchJson("/src/data/sectores.json");
        tituloFavoritos.textContent = "Mis favoritos";
        tituloFavoritos.hidden = false;
        updateFavoriteResults();
    } catch (error) {
        console.error("Error al cargar los favoritos.", error);
        showMessage("Error al cargar los favoritos.");
    }
}

function updateFavoriteResults() {
    const favoriteIds = new Set(getFavoritesFromLocalStorage());
    const searchTerm = normalizeText(buscadorSectores.value.trim());
    const favorites = listaSectores.filter(sector =>
        favoriteIds.has(sector.id) &&
        normalizeText(sector.nombre).includes(searchTerm)
    );

    paginator.setItems(favorites);
    if (favorites.length === 0) {
        showMessage(searchTerm
            ? "No hay sectores favoritos que coincidan con la búsqueda."
            : "Aún no tienes sectores favoritos.");
    }
}

function normalizeText(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();
}

function updatePagination(pagination) {
    paginaAnterior.disabled = !pagination.hasPrevious();
    paginaSiguiente.disabled = !pagination.hasNext();
    informacionPagina.textContent =
        `${pagination.currentPage} / ${pagination.totalPages}`;
    paginacionSectores.hidden =
        !pagination.hasPrevious() && !pagination.hasNext();
}

function renderFavoriteCard(sector) {
    const card = createSectorCard(
        sector,
        showSectorWeather,
        handleFavoriteClick,
        isInFavorites(sector.id)
    );
    loadSectorPhoto(sector, card.querySelector(".sector-photo"), card.querySelector(".sector-photo-credit"));
    return card;
}

function handleFavoriteClick(sector, button) {
    const isFavorite = toggleFavorite(sector.id);
    updateFavoriteButton(button, isFavorite);

    if (!isFavorite) {
        updateFavoriteResults();
    }
}

function showMessage(message) {
    sectoresContent.replaceChildren(createMessage(message));
}