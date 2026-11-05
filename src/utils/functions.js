import {
    createMessage,
    createSectorCard,
    renderCountryOptions,
    updateFavoriteButton
} from "../ui/renderer.js";
import Paginator from "../ui/paginator.js";
import { isInFavorites, toggleFavorite } from "../../localStorage.js";
import { fetchJson, loadSectorPhoto, showSectorWeather } from "./sectorServices.js";

const sectoresContent = document.getElementById("sectionSectores");
const selectPaises = document.getElementById("listaPaises");
const mainZonas = document.getElementById("mainZonas");
const tituloPais = document.getElementById("tituloPais");
const paginacionSectores = document.getElementById("paginacionSectores");
const paginaAnterior = document.getElementById("paginaAnterior");
const paginaSiguiente = document.getElementById("paginaSiguiente");

let listaSectores = [];

const paginator = new Paginator({
    containerId: "sectionSectores",
    items: [],
    renderItem: renderSectorCard,
    pageSize: 4,
    onChange: updatePagination
});

selectPaises.addEventListener("change", handleCountryChange);
paginaAnterior.addEventListener("click", () => paginator.previousPage());
paginaSiguiente.addEventListener("click", () => paginator.nextPage());
loadSectors();

async function loadSectors() {
    try {
        listaSectores = await fetchJson("/src/data/sectores.json");
        renderCountryOptions(selectPaises, getCountries(listaSectores));
    } catch (error) {
        console.error("Error al cargar la lista de zonas.", error);
        showMessage("Error al cargar la lista de zonas.");
    }
}

function getCountries(sectors) {
    return [...new Set(sectors.map(sector => getCountry(sector.region)))];
}

function getCountry(region) {
    return region.split(",").slice(-1)[0].trim();
}

function handleCountryChange(event) {
    const country = event.currentTarget.value;
    if (!country) {
        mainZonas.classList.add("main-zonas--inicial");
        tituloPais.hidden = true;
        paginacionSectores.hidden = true;
        paginator.setItems([]);
        return;
    }

    mainZonas.classList.remove("main-zonas--inicial");
    tituloPais.textContent = country;
    tituloPais.hidden = false;
    paginator.setItems(listaSectores.filter(sector => getCountry(sector.region) === country));
}

function updatePagination(pagination) {
    paginaAnterior.disabled = !pagination.hasPrevious();
    paginaSiguiente.disabled = !pagination.hasNext();
    document.getElementById("informacionPagina").textContent =
        `${pagination.currentPage} / ${pagination.totalPages}`;
    paginacionSectores.hidden =
        !pagination.hasPrevious() && !pagination.hasNext();
}

function renderSectorCard(sector) {
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
}

function showMessage(message) {
    sectoresContent.replaceChildren(createMessage(message));
}
