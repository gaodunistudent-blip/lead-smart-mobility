# LEAD — Smart Mobility for Indonesia

LEAD is a responsive mobility-planning prototype for exploring Indonesian cities, finding nearby places, and planning journeys. It is built with Vite, vanilla JavaScript, and Leaflet, and can be deployed as a static site on Vercel.

**Live demo:** [lead-smart-mobility.vercel.app](https://lead-smart-mobility.vercel.app/)

## Features

- Interactive OpenStreetMap maps with browser geolocation, map markers, and city-scoped place results.
- City guides for 14 Indonesian cities, with 60+ searchable place categories and distance/opening-hours filters.
- Place search and road-route previews using public Nominatim and OSRM services; estimated routes are labeled when live routing is unavailable.
- Current local weather and approximate route forecasts from Open-Meteo. Route forecasts sample three points and are not road-sensor alerts.
- Vehicle profiles, saved places, and journey history stored in the browser.
- English and Bahasa Indonesia interface.
- A floating travel assistant with contextual route/place information, demo-generated text responses, and optional browser speech recognition.
- Responsive layouts with a red-and-white visual theme and mobile bottom navigation.

## Quick start

### Requirements

- Node.js `20.19+` or `22.12+`
- npm (included with Node.js)

### Install and run

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (by default, `http://127.0.0.1:5173/`).

On Windows PowerShell, use the `.cmd` npm entry point if script execution is restricted:

```powershell
npm.cmd ci
npm.cmd run dev
```

### Production build

```bash
npm run build
npm run preview
```

The optimized static site is generated in `dist/`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Use the project root as the **Root Directory**.
4. Confirm these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | Vite |
   | Install Command | `npm ci` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

5. Select **Deploy**. No environment variables are required for the current prototype.

Vercel can also detect these settings automatically from the `package.json` scripts.

## Project structure

```text
.
├── index.html                 # App shell and screens
├── public/
│   ├── i18n-global.js         # English/Indonesian translations
│   └── lead-app.js            # App state, navigation, map, and demo behavior
├── src/
│   ├── main.js                # Vite entry point and script bootstrap
│   └── style.css              # Responsive application styles
├── package.json
└── package-lock.json
```

## Data, privacy, and prototype limitations

- There is no backend. Demo profile data, vehicles, saved places, language preference, and journey history are stored in this browser's `localStorage`.
- Sign-in, registration, and premium features are demonstrations; do not enter real passwords or sensitive information. The assistant is not a live AI service.
- Place search, geocoding, routing, weather, and map tiles use public Photon, Nominatim, OSRM, Open-Meteo, and OpenStreetMap services. Availability, coverage, and freshness are not guaranteed; public endpoints may impose usage limits. Use properly provisioned services for production traffic.
- Map tiles require an internet connection and include OpenStreetMap attribution. Location and microphone features require browser permission; browser support varies.
- Route weather checks sample three forecast points and may miss local conditions; they are informational only, not safety warnings. Follow local road signs and verify forecasts independently.
- Curated city-guide entries are examples. OpenStreetMap opening hours can be missing or incomplete, and unknown hours are labeled rather than treated as open.

## Technology and attribution

- [Vite](https://vite.dev/) for development and production builds.
- [Leaflet](https://leafletjs.com/) for interactive maps.
- [OpenStreetMap](https://www.openstreetmap.org/copyright) for map data and public mapping services.
- [Font Awesome Free](https://fontawesome.com/) for icons.

## License

No license is currently specified. All rights are reserved unless the project owner adds a license.
