import {
    removeSectorPhoto,
    renderSectorPhoto,
    renderWeather
} from "../ui/renderer.js";

const WIKIMEDIA_API_URL = "https://commons.wikimedia.org/w/api.php";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    return response.json();
}

async function showSectorWeather(sector, card, button) {
    const weatherDetails = card.querySelector(".sector-weather");
    if (button.getAttribute("aria-expanded") === "true") {
        weatherDetails.replaceChildren();
        button.textContent = "Ver más";
        button.setAttribute("aria-expanded", "false");
        return;
    }

    button.disabled = true;
    try {
        const weather = await fetchSectorWeather(sector);
        renderWeather(card, weather);
        button.textContent = "Ver menos";
        button.setAttribute("aria-expanded", "true");
    } catch (error) {
        console.error(`No se pudo mostrar el tiempo de ${sector.nombre}`, error);
    } finally {
        button.disabled = false;
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
        if (!photo) {
            throw new Error("La respuesta no contiene una fotografía válida.");
        }

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

export { fetchJson, loadSectorPhoto, showSectorWeather };
