# PowROI — Ski Pass Advisor

A data-driven ski pass comparison tool that helps skiers (and MBA students analyzing recreational investments) find the best season pass based on their trip profile, budget, and must-have resorts.

## Features

- **6 pass options**: Ikon (Full/Base), Epic (Full/Local), Mountain Collective, Indy Pass
- **50 curated resorts** across PNW, Rockies, California, Northeast, Southeast, Midwest
- **Interactive Leaflet map** with resort pinning (select up to 3 must-haves)
- **Break-even analysis** chart comparing cost-per-day curves against day ticket averages
- **Sensitivity analysis** table showing how cost shifts with varying ski days
- **Optional travel cost** toggle for all-in trip economics
- **Ranked list + comparison table** toggle for results

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- React 18 + Vite
- react-leaflet (OpenStreetMap tiles)
- Recharts (charts)
- Lodash

## Data

Resort and pass data is hardcoded for the 2025/2026 season in `src/data/resorts.js`. Prices are representative and should be verified against current published pricing before sharing publicly.

## Built by

[Sarrah Renfro](https://sarrahrenfro.com)
