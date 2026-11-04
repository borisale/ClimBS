import {
    createMessage,
    createSectorCard,
    removeSectorPhoto,
    renderCountryOptions,
    renderSectorPhoto,
    renderWeather
} from "../ui/renderer.js";

import Paginator from "../ui/paginator.js";

const sectoresContent = document.getElementById("sectionSectores");
const selectPaises = document.getElementById("listaPaises");
const mainZonas = document.getElementById("mainZonas");
const tituloPais = document.getElementById("tituloPais");
const paginacionSectores = document.getElementById("paginacionSectores");
const paginaAnterior = document.getElementById("paginaAnterior");
const paginaSiguiente = document.getElementById("paginaSiguiente");
const informacionPagina = document.getElementById("informacionPagina");
const SECTORES_URL = "/src/data/sectores.json";
const WIKIMEDIA_API_URL = "https://commons.wikimedia.org/w/api.php";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

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
        listaSectores = await fetchJson(SECTORES_URL);
        renderCountryOptions(selectPaises, getCountries(listaSectores));
    } catch (error) {
        console.error("Error al cargar la lista de zonas", error);
        showMessage("Error al cargar la lista de zonas.");
    }
}

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    return response.json();
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
    paginator.setItems(getSectorsInCountry(country));
}

function getSectorsInCountry(country) {
    return listaSectores.filter(sector => getCountry(sector.region) === country);
}

function updatePagination(pagination) {
    paginaAnterior.disabled = !pagination.hasPrevious();
    paginaSiguiente.disabled = !pagination.hasNext();
    informacionPagina.textContent =
        `${pagination.currentPage} / ${pagination.totalPages}`;
    paginacionSectores.hidden =
        !pagination.hasPrevious() && !pagination.hasNext();
}

function renderSectorCard(sector) {
    const card = createSectorCard(sector, showSectorWeather);
    const image = card.querySelector(".sector-photo");
    const photoCredit = card.querySelector(".sector-photo-credit");
    loadSectorPhoto(sector, image, photoCredit);
    return card;
}

async function showSectorWeather(sector, card, button) {
    try {
        const weather = await fetchSectorWeather(sector);
        renderWeather(card, weather);
        button.remove();
    } catch (error) {
        console.error(`No se pudo mostrar el tiempo de ${sector.nombre}`, error);
    }
}

async function fetchSectorWeather(sector) {
    const url = new URL(WEATHER_API_URL);
    url.search = new URLSearchParams({
        latitude: sector.latitud,
        longitude: sector.longitud,
        current_weather: "true"
    });

    const data = await fetchJson(url);
    if (!data.current_weather) {
        throw new Error("La respuesta no contiene el tiempo actual");
    }

    return data.current_weather;
}

async function loadSectorPhoto(sector, image, photoCredit) {
    try {
        const photo = await fetchSectorPhoto(sector);
        image.addEventListener("error", () => {
            console.error(`No se pudo cargar la fotografía de ${sector.nombre}`);
            removeSectorPhoto(image, photoCredit);
        }, { once: true });
        renderSectorPhoto(image, photoCredit, photo);
    } catch (error) {
        console.error(`Error al buscar una fotografía de ${sector.nombre}`, error);
        removeSectorPhoto(image, photoCredit);
    }
}

async function fetchSectorPhoto(sector) {
    const response = await fetch(createPhotoSearchUrl(sector));
    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    const page = Object.values(data.query?.pages ?? {})[0];
    return getPhotoDetails(page?.imageinfo?.[0]);
}

function createPhotoSearchUrl(sector) {
    const parameters = new URLSearchParams({
        action: "query",
        generator: "search",
        gsrsearch: `filetype:bitmap "${sector.nombre}" climbing`,
        gsrnamespace: "6",
        gsrlimit: "1",
        prop: "imageinfo",
        iiprop: "url|extmetadata",
        iiurlwidth: "800",
        format: "json",
        origin: "*"
    });

    return `${WIKIMEDIA_API_URL}?${parameters}`;
}

function getPhotoDetails(imageInfo) {
    if (!imageInfo?.thumburl || !imageInfo.descriptionurl) {
        return null;
    }

    const metadata = imageInfo.extmetadata ?? {};
    const authorMarkup = metadata.Artist?.value ?? "";
    const author = new DOMParser()
        .parseFromString(authorMarkup, "text/html")
        .body.textContent.trim();

    return {
        url: imageInfo.thumburl,
        descriptionurl: imageInfo.descriptionurl,
        author,
        license: metadata.LicenseShortName?.value,
        requiresAttribution: metadata.AttributionRequired?.value === "true"
    };
}

function showMessage(message) {
    sectoresContent.replaceChildren(createMessage(message));
}