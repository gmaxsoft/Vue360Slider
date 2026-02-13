# Med – Aplikacja Sekcji Vue 2

Aplikacja Vue 2 z płynnym przewijaniem między sekcjami 360, nawigacją kółeczkami i dynamiczną zmianą zawartości. Zbudowana w oparciu o komponenty (komponent główny: **Banner360**).

## Funkcjonalności

- Płynne przewijanie między sekcjami (automatyczne i manualne)
- Nawigacja kółeczkami z dynamiczną zmianą kolorów
- Dynamiczna zmiana obrazka tła i zdjęcia eksperta
- Dynamiczna zmiana opisu w głównym kółeczku (lub logo w zależności od breakpointu)
- Automatyczne wykrywanie potrzeby scrollowania w opisie
- Responsywność (breakpointy: 479px, 768px, 999px, 1440px, 1920px)
- **Priorytetowe** API PHP; automatyczny fallback do lokalnego `data.json` gdy API nie działa
- Dane w formacie JSON
- Czcionka Roboto, dekoracyjny element (square.png) od 1440px

## Wymagania

- Node.js (npm)
- PHP

## Instalacja

```bash
npm install
```

## Skrypty npm

| Polecenie        | Opis |
|------------------|------|
| `npm run dev`    | Serwer deweloperski (Webpack Dev Server), domyślnie http://localhost:8080 (z hot reload i proxy do API PHP) |
| `npm run build`  | Build produkcyjny do katalogu `dist/` (bundle, HTML, obrazy, `data.json`) |
| `npm start`      | Serwer produkcyjny (Webpack Dev Server w trybie production), domyślnie http://localhost:8080 (z proxy do API PHP) |
| `npm run preview`| To samo co `npm start` – serwer produkcyjny bez automatycznego otwierania przeglądarki |
| `npm run lint`   | Sprawdza kod ESLintem (`.js`, `.vue` w `src/`) |
| `npm run lint:fix` | ESLint z automatycznymi poprawkami |

## Uruchomienie deweloperskie

```bash
npm run dev
```

Aplikacja: **http://localhost:8080**

**Ważne:** Aby używać API PHP, w osobnym terminalu uruchom:

```bash
php -S localhost:8000 -t .
```

Zapytania do `/api` są wtedy przekierowywane na `http://localhost:8000` (proxy w Webpack Dev Server).

**Uwaga:** Zarówno `npm run dev` jak i `npm start` mają skonfigurowane proxy do API PHP. Jeśli API PHP nie jest dostępne, aplikacja automatycznie użyje fallback do `data.json`.

## Build produkcyjny

```bash
npm run build
```

W katalogu `dist/` powstają: `index.html`, `bundle.js`, `images/`, `data.json`.

**Uwaga:** Aplikacji z buildu nie otwieraj przez `file://` – używaj serwera HTTP:

- **Lokalnie:** `npm start` lub `npm run preview` (oba mają proxy do API PHP)
- **Na serwerze:** wgraj zawartość `dist/` do katalogu WWW (wraz z katalogiem `api/` zawierającym `api.php` i `data.json`)

**Uwaga:** `npm start` i `npm run preview` używają Webpack Dev Server z proxy do API PHP, więc wymagają uruchomionego serwera PHP (`php -S localhost:8000 -t .`).

## Struktura projektu

```
Med/
├── api/
│   ├── api.php         # Endpoint API (JSON)
│   └── data.json       # Dane sekcji dla API
├── public/
│   ├── index.html      # Szablon HTML
│   ├── data.json       # Fallback danych (kopiowany do dist)
│   └── images/         # Obrazki (kopiowane do dist/images/)
├── src/
│   ├── App.vue         # Root aplikacji, renderuje <Banner360 />
│   ├── main.js         # Punkt wejścia
│   ├── components/
│   │   └── Banner360.vue   # Komponent bannera 360° (sekcje, koło, logo, tekst)
│   └── styles/
│       └── main.css    # Style globalne
├── .eslintrc.cjs       # Konfiguracja ESLint (Vue 2)
├── webpack.config.js   # Webpack (Vue, CSS, copy public → dist)
└── package.json
```

## API

### GET /api/api.php

Zwraca tablicę sekcji w formacie JSON. Przykład elementu:

```json
{
  "id": 0,
  "label": "Nazwa sekcji",
  "color": "#HEX",
  "image": "/images/plik.png",
  "circle_bg": "/images/circle-bg-1.png",
  "description": "Opis sekcji"
}
```

**Priorytet danych:**
1. **API PHP** (`/api/api.php`) - aplikacja **najpierw** próbuje pobrać dane z API PHP
2. **Fallback** (`/data.json`) - gdy API PHP jest niedostępne (błąd sieci, timeout, 404, 500), aplikacja automatycznie używa `data.json` z `public/` (w buildzie z `dist/`)

Aplikacja loguje w konsoli przeglądarki źródło danych (API PHP lub fallback).

## Konfiguracja danych

- **API:** `api/data.json` (format jak powyżej).
- **Fallback:** `public/data.json` – kopiowany do `dist/` przy `npm run build`.

Ścieżki do obrazków (np. `image`, `circle_bg`) powinny wskazywać pliki z `public/images/` (w buildzie `dist/images/`), np. `/images/nazwa.png`.

## ESLint

Projekt ma skonfigurowany ESLint (eslint + eslint-plugin-vue dla Vue 2). Uruchomienie:

- `npm run lint` – sprawdzenie
- `npm run lint:fix` – sprawdzenie i automatyczne poprawki

Reguły stylu (formatowanie) są wyłączone; działają reguły zalecane (m.in. błędy, dobre praktyki Vue).

## Licencja

MIT
