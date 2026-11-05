function createMessage(text) {
    const message = document.createElement("p");
    message.textContent = text;
    return message;
}

function renderCountryOptions(select, countries) {
    const options = countries.map(country => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        return option;
    });

    select.replaceChildren(select.options[0], ...options);
}

function createSectorCard(sector, onWeatherClick, onFavoriteClick, isFavorite) {
    const card = document.createElement("article");
    const image = createSectorImage(sector);
    const photoCredit = createPhotoCredit();
    const heading = document.createElement("h3");
    const region = document.createElement("p");
    const weatherDetails = document.createElement("div");
    const weatherButton = createWeatherButton();
    const favoriteButton = createFavoriteButton(isFavorite);
    const actions = document.createElement("div");
    weatherDetails.className = "sector-weather";
    actions.className = "sector-actions";

    heading.textContent = sector.nombre;
    region.textContent = `Región: ${sector.region}`;
    weatherButton.addEventListener("click", () => {
        onWeatherClick(sector, card, weatherButton);
    });
    favoriteButton.addEventListener("click", () => {
        onFavoriteClick(sector, favoriteButton);
    });

    actions.append(weatherButton, favoriteButton);
    card.append(image, photoCredit, heading, region, weatherDetails, actions);
    return card;
}

function renderSectorPhoto(image, photoCredit, photo) {
    photoCredit.href = photo.descriptionurl;
    photoCredit.textContent = [
        photo.author && `Foto: ${photo.author}`,
        photo.license && `Licencia: ${photo.license}`
    ].filter(Boolean).join(" · ") || "Fuente de la fotografía";
    photoCredit.hidden = false;
    image.src = photo.url;
}

function renderWeather(card, weather) {
    const temperature = createMessage(`Temperatura: ${weather.temperature} ºC`);
    const wind = createMessage(`Viento: ${weather.windspeed} km/h`);
    card.querySelector(".sector-weather").replaceChildren(temperature, wind);
}

function removeSectorPhoto(image, photoCredit) {
    image.remove();
    photoCredit.remove();
}

function createSectorImage(sector) {
    const image = document.createElement("img");
    image.className = "sector-photo";
    image.alt = `Fotografía del sector de escalada ${sector.nombre}`;
    image.loading = "lazy";
    return image;
}

function createPhotoCredit() {
    const credit = document.createElement("a");
    credit.className = "sector-photo-credit";
    credit.target = "_blank";
    credit.rel = "noopener noreferrer";
    credit.hidden = true;
    return credit;
}

function createWeatherButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Ver más";
    button.setAttribute("aria-expanded", "false");
    return button;
}

function createFavoriteButton(isFavorite) {
    const button = document.createElement("button");
    button.className = "favorite-button";
    button.type = "button";
    const icon = document.createElement("img");
    icon.alt = "";
    icon.width = 28;
    icon.height = 28;
    button.append(icon);
    updateFavoriteButton(button, isFavorite);
    return button;
}

function updateFavoriteButton(button, isFavorite) {
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute(
        "aria-label",
        isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
    );
    button.querySelector("img").src = isFavorite
        ? "/src/images/corazon.png"
        : "/src/images/favorito.png";
}

export {
    createMessage,
    renderCountryOptions,
    createSectorCard,
    renderSectorPhoto,
    renderWeather,
    removeSectorPhoto,
    updateFavoriteButton
};