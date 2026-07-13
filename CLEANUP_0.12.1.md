# Telisi 0.12.1 — limpieza conservadora

## Cambios realizados

- Se dividió el antiguo `src/styles/base/styles.css` de 1.838 líneas en hojas más pequeñas por componente y responsabilidad.
- Se preservó exactamente el orden original de las reglas CSS para no alterar el aspecto actual.
- Se agregó `src/styles/README.md` con la estructura y las reglas de mantenimiento.
- Se regeneró `dist` mediante `npm run build`.
- Se sincronizaron los recursos web con Android mediante `npx cap sync android`.
- Se eliminaron dependencias instaladas, metadatos Git, cachés, compilaciones temporales y configuraciones locales regenerables.
- Se actualizó la versión del paquete a `0.12.1`.

## Verificación

La compilación de producción finalizó correctamente. Vite solo informa una advertencia no bloqueante por el tamaño del bundle principal; no se modificó todavía para evitar una refactorización funcional innecesaria.

## Para continuar

1. Ejecutar `npm install` en la carpeta raíz.
2. Para desarrollo: `npm run dev`.
3. Para Android después de cambios web: `npm run build` y luego `npx cap sync android`.
