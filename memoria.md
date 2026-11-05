# Memoria del proyecto ClimBS

## 1. Datos del proyecto

- **Autor/a:** [Borisale]
- **Fecha:** [06/11/2026]

## 2. Descripción

ClimBS es un sitio web informativo para un centro de escalada. Presenta sus instalaciones, servicios, equipo y zonas de escalada de las que se puede ver el tiempo.

## 3. Objetivos

- Dar a conocer el centro y sus servicios.
- Facilitar la consulta de sectores de escalada por país.
- Ofrecer una web clara y adaptable a móviles.

## 4. Tecnologías

HTML, CSS y JavaScript. Los sectores se cargan desde un archivo JSON; las fotografías se consultan en Wikimedia Commons y los datos meteorológicos en Open-Meteo.

## 5. Estructura y funcionalidades

- **Inicio:** presentación, instalaciones y ubicación.
- **Servicios:** rocódromo, maquinaria, cursos y excursiones.
- **Zonas:** selección de país, tarjetas con cada sector del páis y con un botón para ver el tiempo y otro para añadir favoritos.
- **Favoritos:** visualización de sectores favs con búsqueda por texto.
- **Contacto:** presentación del equipo y formulario.

## 6. Desarrollo y pruebas

En principio iba a trabajar con una API de sectores, pero se necesitaba trabajar en conjunto con GraphQL y no entendía nada asi que cambié a una API de tiempo. La idea era sacar todo el tiempo de todos los sectores de un país, los cuales los tengo metidos a mano en un JSON, pero al ver que la API no aceptada muchas llamadas decidí añadir un botón en cada tarjeta de sector que mostrase el tiempo actual se esa zona. Actualización, se ha añadido otra página para la visualización de favoritos, en un principio pensaba que no iba a hacer falta pero luego he caído en que a la gente le gusta tener guardados los sitios a los que van a menudo.

## 7. Conclusión

Página sencilla y el próximo proyecto será un juego.