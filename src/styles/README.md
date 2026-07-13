# Estilos de Telisi

Los estilos se cargan en un orden deliberado desde `src/main.jsx`. Las hojas posteriores pueden ajustar reglas anteriores, por lo que no deben reordenarse sin revisar visualmente la aplicación.

## Estructura

- `base/`: variables, reset y estilos históricos generales.
- `components/`: modales, selectores, recordatorios y formularios reutilizables.
- `layout/`: estructura del dashboard, navegación, calendario e integraciones.
- `mobile/`: ajustes exclusivos para teléfono y tablet.
- `pages/`: estilos ligados a una pantalla concreta.
- `themes/`: acabado visual y tema unificado.

La separación realizada en la versión 0.12.1 conserva el contenido y el orden original del antiguo `base/styles.css`; únicamente lo divide para facilitar el mantenimiento.
