export const PASSES = [
  { id: "ikon_full", name: "Ikon Pass", tier: "Full", price: 1259, childPrice: 899, color: "#E8490F" },
  { id: "ikon_base", name: "Ikon Base Pass", tier: "Base", price: 869, childPrice: 619, color: "#FF6B35" },
  { id: "epic_full", name: "Epic Pass", tier: "Full", price: 941, childPrice: 490, color: "#0066CC" },
  { id: "epic_local", name: "Epic Local Pass", tier: "Local", price: 583, childPrice: 350, color: "#3399FF" },
  { id: "mountain_collective", name: "Mountain Collective", tier: "Full", price: 575, childPrice: 399, color: "#2D8B4E" },
  { id: "indy_pass", name: "Indy Pass", tier: "Full", price: 359, childPrice: 179, color: "#8B5E3C" },
];

export const REGIONS = [
  { id: "pnw", name: "Pacific Northwest", states: ["WA", "OR"] },
  { id: "rockies", name: "Rocky Mountains", states: ["CO", "UT", "WY", "MT", "ID"] },
  { id: "california", name: "California", states: ["CA"] },
  { id: "northeast", name: "Northeast", states: ["VT", "NH", "ME", "NY", "MA"] },
  { id: "southeast", name: "Southeast", states: ["NC", "WV", "VA"] },
  { id: "midwest", name: "Midwest", states: ["MI", "WI", "MN"] },
];

export const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export const RESORTS = [
  // PNW
  { id: 1, name: "Crystal Mountain", lat: 46.935, lng: -121.504, region: "pnw", dayTicket: 129, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 2, name: "Stevens Pass", lat: 47.745, lng: -121.089, region: "pnw", dayTicket: 139, skillLevel: "Intermediate", passes: ["epic_full", "epic_local"], blackout: false },
  { id: 3, name: "Mt. Baker", lat: 48.857, lng: -121.665, region: "pnw", dayTicket: 89, skillLevel: "Advanced", passes: ["indy_pass"], blackout: false },
  { id: 4, name: "Snoqualmie Pass", lat: 47.420, lng: -121.413, region: "pnw", dayTicket: 99, skillLevel: "Beginner", passes: ["epic_full", "epic_local"], blackout: false },
  { id: 5, name: "Mt. Hood Meadows", lat: 45.330, lng: -121.662, region: "pnw", dayTicket: 119, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 6, name: "Mt. Bachelor", lat: 43.979, lng: -121.688, region: "pnw", dayTicket: 149, skillLevel: "Advanced", passes: ["ikon_full"], blackout: false },
  { id: 7, name: "Mission Ridge", lat: 47.293, lng: -120.399, region: "pnw", dayTicket: 79, skillLevel: "Intermediate", passes: ["indy_pass"], blackout: false },

  // Rockies - CO
  { id: 10, name: "Vail", lat: 39.640, lng: -106.374, region: "rockies", dayTicket: 269, skillLevel: "Advanced", passes: ["epic_full"], blackout: false },
  { id: 11, name: "Breckenridge", lat: 39.480, lng: -106.067, region: "rockies", dayTicket: 239, skillLevel: "Intermediate", passes: ["epic_full", "epic_local"], blackout: false },
  { id: 12, name: "Aspen Snowmass", lat: 39.209, lng: -106.950, region: "rockies", dayTicket: 239, skillLevel: "Expert", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 13, name: "Steamboat", lat: 40.457, lng: -106.804, region: "rockies", dayTicket: 229, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 14, name: "Winter Park", lat: 39.884, lng: -105.763, region: "rockies", dayTicket: 209, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 15, name: "Copper Mountain", lat: 39.502, lng: -106.151, region: "rockies", dayTicket: 189, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 16, name: "Keystone", lat: 39.605, lng: -105.971, region: "rockies", dayTicket: 209, skillLevel: "Intermediate", passes: ["epic_full", "epic_local"], blackout: false },
  { id: 17, name: "Crested Butte", lat: 38.899, lng: -106.965, region: "rockies", dayTicket: 179, skillLevel: "Expert", passes: ["epic_full"], blackout: false },
  { id: 18, name: "Telluride", lat: 37.937, lng: -107.846, region: "rockies", dayTicket: 219, skillLevel: "Advanced", passes: ["epic_full"], blackout: false },
  { id: 19, name: "Arapahoe Basin", lat: 39.642, lng: -105.872, region: "rockies", dayTicket: 159, skillLevel: "Expert", passes: ["ikon_full", "ikon_base"], blackout: false },
  { id: 20, name: "Eldora", lat: 39.937, lng: -105.583, region: "rockies", dayTicket: 119, skillLevel: "Beginner", passes: ["ikon_full", "ikon_base"], blackout: false },

  // Rockies - UT
  { id: 21, name: "Park City", lat: 40.651, lng: -111.508, region: "rockies", dayTicket: 239, skillLevel: "Advanced", passes: ["epic_full"], blackout: false },
  { id: 22, name: "Snowbird", lat: 40.583, lng: -111.657, region: "rockies", dayTicket: 199, skillLevel: "Expert", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 23, name: "Alta", lat: 40.588, lng: -111.638, region: "rockies", dayTicket: 189, skillLevel: "Expert", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 24, name: "Deer Valley", lat: 40.637, lng: -111.478, region: "rockies", dayTicket: 259, skillLevel: "Advanced", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 25, name: "Brighton", lat: 40.598, lng: -111.583, region: "rockies", dayTicket: 129, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: false },
  { id: 26, name: "Solitude", lat: 40.620, lng: -111.592, region: "rockies", dayTicket: 139, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: false },

  // Rockies - WY/MT/ID
  { id: 27, name: "Jackson Hole", lat: 43.588, lng: -110.828, region: "rockies", dayTicket: 219, skillLevel: "Expert", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 28, name: "Big Sky", lat: 45.284, lng: -111.401, region: "rockies", dayTicket: 209, skillLevel: "Advanced", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 29, name: "Sun Valley", lat: 43.697, lng: -114.351, region: "rockies", dayTicket: 189, skillLevel: "Advanced", passes: ["epic_full"], blackout: false },
  { id: 30, name: "Whitefish", lat: 48.482, lng: -114.353, region: "rockies", dayTicket: 109, skillLevel: "Intermediate", passes: ["indy_pass"], blackout: false },

  // California
  { id: 31, name: "Palisades Tahoe", lat: 39.196, lng: -120.235, region: "california", dayTicket: 229, skillLevel: "Expert", passes: ["epic_full"], blackout: false },
  { id: 32, name: "Mammoth Mountain", lat: 37.630, lng: -119.033, region: "california", dayTicket: 209, skillLevel: "Advanced", passes: ["ikon_full", "ikon_base"], blackout: false },
  { id: 33, name: "Heavenly", lat: 38.935, lng: -119.940, region: "california", dayTicket: 199, skillLevel: "Intermediate", passes: ["epic_full", "epic_local"], blackout: false },
  { id: 34, name: "Northstar", lat: 39.274, lng: -120.121, region: "california", dayTicket: 189, skillLevel: "Intermediate", passes: ["epic_full", "epic_local"], blackout: false },
  { id: 35, name: "Kirkwood", lat: 38.685, lng: -120.065, region: "california", dayTicket: 179, skillLevel: "Advanced", passes: ["epic_full", "epic_local"], blackout: false },
  { id: 36, name: "Sugar Bowl", lat: 39.304, lng: -120.334, region: "california", dayTicket: 159, skillLevel: "Intermediate", passes: ["mountain_collective"], blackout: false },
  { id: 37, name: "Big Bear", lat: 34.236, lng: -116.896, region: "california", dayTicket: 99, skillLevel: "Beginner", passes: ["ikon_full", "ikon_base"], blackout: false },

  // Northeast
  { id: 40, name: "Stowe", lat: 44.531, lng: -72.782, region: "northeast", dayTicket: 179, skillLevel: "Advanced", passes: ["epic_full"], blackout: false },
  { id: 41, name: "Killington", lat: 43.620, lng: -72.795, region: "northeast", dayTicket: 159, skillLevel: "Advanced", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 42, name: "Sugarbush", lat: 44.136, lng: -72.905, region: "northeast", dayTicket: 139, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 43, name: "Sunday River", lat: 44.467, lng: -70.856, region: "northeast", dayTicket: 139, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 44, name: "Sugarloaf", lat: 45.031, lng: -70.313, region: "northeast", dayTicket: 129, skillLevel: "Advanced", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 45, name: "Hunter Mountain", lat: 42.200, lng: -74.227, region: "northeast", dayTicket: 119, skillLevel: "Intermediate", passes: ["epic_full", "epic_local"], blackout: false },
  { id: 46, name: "Loon Mountain", lat: 44.036, lng: -71.621, region: "northeast", dayTicket: 129, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },
  { id: 47, name: "Stratton", lat: 43.113, lng: -72.908, region: "northeast", dayTicket: 149, skillLevel: "Intermediate", passes: ["ikon_full", "ikon_base"], blackout: true },

  // Southeast
  { id: 48, name: "Snowshoe", lat: 38.408, lng: -79.995, region: "southeast", dayTicket: 109, skillLevel: "Intermediate", passes: ["epic_full"], blackout: false },
  { id: 49, name: "Beech Mountain", lat: 36.190, lng: -81.880, region: "southeast", dayTicket: 69, skillLevel: "Beginner", passes: ["indy_pass"], blackout: false },

  // Midwest
  { id: 50, name: "Boyne Mountain", lat: 45.167, lng: -84.934, region: "midwest", dayTicket: 89, skillLevel: "Beginner", passes: ["indy_pass"], blackout: false },
];

export const CANADIAN_LUMPED = {
  name: "Canadian Resorts (Whistler, Banff, etc.)",
  note: "Multiple Canadian resorts available on Ikon and Epic. Details coming in V2.",
  passes: ["ikon_full", "ikon_base", "epic_full"],
};
