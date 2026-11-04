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

function createSectorCard(sector, onWeatherClick) {
    const card = document.createElement("article");
    const image = createSectorImage(sector);
    const photoCredit = createPhotoCredit();
    const heading = document.createElement("h3");
    const region = document.createElement("p");
    const weatherButton = createWeatherButton();

    heading.textContent = sector.nombre;
    region.textContent = `Región: ${sector.region}`;
    weatherButton.addEventListener("click", () => {
        onWeatherClick(sector, card, weatherButton);
    });

    card.append(image, photoCredit, heading, region, weatherButton);
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

    card.append(temperature, wind);
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
    button.textContent = "Ver tiempo";
    return button;
}

export { createMessage, renderCountryOptions, createSectorCard, renderSectorPhoto, renderWeather, removeSectorPhoto }