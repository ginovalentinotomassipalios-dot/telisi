# Limpieza Telisi v0.13.0

## Cambios realizados

- Se consolidaron 22 hojas de estilo en 5 archivos con responsabilidades claras.
- Se preservó el orden exacto de la cascada anterior para no modificar la estética actual.
- Se eliminaron de la carga principal los archivos históricos de parches (`clean`, `polish`, `fix`, `mobile-v07`).
- Se simplificó `src/main.jsx` y se documentó el orden obligatorio de estilos.
- Se actualizó la versión del proyecto a `0.13.0`.
- El ZIP final no incluye `node_modules`, `dist`, `.firebase` ni el historial `.git`.

## Nueva organización CSS

1. `app-foundation.css`: base y compatibilidad de la interfaz.
2. `app-components.css`: modales, formularios, notificaciones y componentes.
3. `app-layout.css`: Home, calendario, navegación e integraciones.
4. `app-theme.css`: acabado visual y tema unificado.
5. `app-mobile.css`: comportamiento responsive y calendario móvil.

## Verificación local

```powershell
npm install
npm run build
```
