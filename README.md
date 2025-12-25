# [Yelp Combinator](https://yelp-combinator.louiscohen.me)

A new representation of Yelp bookmarks to fill feature gaps in the standard Yelp bookmark experience. Yelp Combinator uses a combination of page scraping, the Yelp Fusion API, and mapping platforms to collect, display, search, and filter your bookmarked businesses in a more useful and beautiful way.

**[🌐 Live Demo: https://yelp-combinator.louiscohen.me](https://yelp-combinator.louiscohen.me)**

## 🌟 Features

- **Advanced Search**: Search saved businesses by name, category, or personal notes
- **Smart Filtering**: Filter by open/closed status, visited/unvisited, and claimed status
- **AI LLM Search**: Search bookmarks using natural language input
- **Interactive Map**:
  - Unique map marker icons based on business category
  - Visual distinction between visited and not visited businesses
  - Marker clustering for better performance with many locations
  - Beautiful, smooth animations for marker and business info interactions
- **Responsive Design**: Fully optimized for both desktop and mobile devices

### 🚧 Upcoming Features

- [ ] Filter businesses open at a specified time/day
- [ ] User account support
- [ ] Add/remove Yelp collections directly

## 🧰 Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**:
  - Zustand for global state
  - React Query for API data fetching and caching
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Map Platforms**:
  - Mapbox (via react-map-gl)
- **Map Clustering**:
  - Supercluster for efficient point clustering
  - Custom cluster rendering for both map platforms
  - Dynamic cluster expansion on click

### Key Components

- `MapCenter`: Core component managing map functionality
- `SearchBar`: Handles search and filtering functionality
- `BusinessInfoWindow`: Displays business details
- `IconMarker`: Custom business markers based on category

## 🏗️ Project Structure

```
src/
├── components/     # React components
├── contexts/       # React contexts
├── hooks/          # Custom React hooks
├── icons/          # SVG icons as React components
├── store/          # Zustand state management
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Yelp Fusion API key
- Mapbox access token

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/yelp-combinator-frontend.git
   cd yelp-combinator-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the required API keys in the `.env` file.

4. **Set up HTTPS for local development**

   ```bash
   ./setup-local-certs.sh
   ```

   This script will install `mkcert` if needed and generate trusted certificates.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `https://localhost:3000`.

## 📦 Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory. To preview:

```bash
npm run preview
```

## 🔄 Backend API

This frontend connects to a [separate backend service](https://github.com/louismcohen/yelp-combinator-backend-ts) that handles:

- Yelp API integration
- Data storage and caching
- Business updates and synchronization
- Semantic search capabilities

By default, it connects to the production API, but you can point it to a local backend by updating the `VITE_BACKEND_API_URL` in your `.env` file.

For backend setup instructions, visit the [backend repository](https://github.com/louismcohen/yelp-combinator-backend-ts).

## 🧩 Comparison with Existing Products

| Feature                     | Yelp | Google My Maps           | Google Saved Places | Yelp Combinator |
| --------------------------- | ---- | ------------------------ | ------------------- | --------------- |
| Search saved bookmarks      | ❌   | ⚠️ Limited functionality | ❌                  | ✅              |
| Filter by opening hours     | ❌   | ❌                       | ❌                  | ✅              |
| Mark as visited             | ❌   | ❌                       | ❌                  | ✅              |
| Filter by visited           | ❌   | ❌                       | ❌                  | ✅              |
| Custom pin icons            | ❌   | ✅                       | ❌                  | ✅              |
| Load all businesses at once | ❌   | ✅                       | ✅                  | ✅              |
| AI search of your bookmarks | ❌   | ✅                       | ✅                  | ✅              |
| Map pin clustering          | ❌   | ✅                       | ✅                  | ✅              |
