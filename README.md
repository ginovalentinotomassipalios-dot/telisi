# Telisi 0.12 Base

Base estable de Telisi preparada para comenzar el desarrollo de integraciones,
comandos de voz, importación inteligente y Telisi Core.

## Desarrollo

```bash
npm install
npm run dev
```

## Compilación web

```bash
npm run build
```

## Android

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

En Windows PowerShell, el último comando es:

```powershell
.\gradlew assembleDebug
```

## Estructura nueva

- `src/core/`: acciones centrales de Telisi.
- `src/integrations/`: estado y adaptadores de integraciones.
- `src/pages/IntegrationsPage.jsx`: centro visual de conexiones.
- `ROADMAP.md`: próximos módulos y objetivos.
