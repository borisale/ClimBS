# ClimBS

Sitio web de un centro de escalada con información sobre sus servicios, equipo y zonas de escalada.

## Uso

En **Zonas**, selecciona un país para ver sus sectores. Pulsa **Ver más** para consultar la temperatura y el viento del sector; pulsa **Ver menos** para ocultarlos. Usa el icono de corazón para añadirlo o quitarlo de favoritos.

En **Favoritos** se muestran los sectores guardados en el LocalStorage. Puedes buscarlos por nombre y quitarlos con el icono de corazón. Los favoritos se guardan automáticamente en el almacenamiento local del navegador.

## Estructura del proyecto

```text
ClimBS/
├── index.html                 Página principal
├── index.js                   Navegación del sitio
├── localStorage.js            Gestión de favoritos en el navegador
├── src/
│   ├── css/                   Estilos de cada página y estilos compartidos
│   ├── data/
│   │   └── sectores.json      Datos de los sectores de escalada
│   ├── html/                  Páginas de zonas, favoritos, servicios y contacto
│   ├── images/                Fotografías, iconos e ilustraciones
│   ├── ui/
│   │   ├── favoritos.js       Búsqueda y visualización de favoritos
│   │   ├── paginator.js       Paginación de sectores
│   │   └── renderer.js        Creación de tarjetas y elementos visuales
│   └── utils/
│       ├── functions.js       Funcionamiento de la página Zonas
│       └── sectorServices.js  Servicios de fotos y meteorología
└── README.md                  Información y uso del proyecto
```
