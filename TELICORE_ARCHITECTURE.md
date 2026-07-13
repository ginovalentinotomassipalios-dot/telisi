# Telicore — base de arquitectura v0.12

Telicore concentra la lógica de dominio de Telisi sin modificar la apariencia de la aplicación.

## Flujo de inicio

`main.jsx` → `Bootstrap.jsx` → `initializeTelicore()` → `TelicoreProvider` → `App.jsx`

## Responsabilidades

- `telicore/storage`: acceso seguro al almacenamiento local.
- `telicore/calendars`: calendarios y calendario activo.
- `telicore/events`: eventos locales, Firebase y emisión hacia integraciones.
- `telicore/settings`: preferencias persistentes, como el tema.
- `telicore/integrations`: registro y distribución de acciones.
- `telicore/kernel`: puente único entre Telicore y React.
- `hooks/useAppUi.js`: estado puramente visual de la interfaz.

## Compatibilidad

Se mantienen las claves históricas de almacenamiento (`telisi_calendars`, `telisi_events`, `telisi_active` y `telisi_app_theme`) para no perder datos existentes.
