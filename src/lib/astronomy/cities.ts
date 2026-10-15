export interface CityData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const CITIES_DATABASE: CityData[] = [
  // India - Metros & Major Cities
  { name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad', country: 'India', latitude: 17.385, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
  { name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
  { name: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
  { name: 'Surat', country: 'India', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata' },
  { name: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' },
  { name: 'Kanpur', country: 'India', latitude: 26.4499, longitude: 80.3319, timezone: 'Asia/Kolkata' },
  { name: 'Nagpur', country: 'India', latitude: 21.1458, longitude: 79.0882, timezone: 'Asia/Kolkata' },
  { name: 'Indore', country: 'India', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata' },
  { name: 'Thane', country: 'India', latitude: 19.2183, longitude: 72.9781, timezone: 'Asia/Kolkata' },
  { name: 'Bhopal', country: 'India', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata' },
  { name: 'Visakhapatnam', country: 'India', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata' },
  { name: 'Patna', country: 'India', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata' },
  { name: 'Vadodara', country: 'India', latitude: 22.3072, longitude: 73.1812, timezone: 'Asia/Kolkata' },
  { name: 'Ghaziabad', country: 'India', latitude: 28.6692, longitude: 77.4538, timezone: 'Asia/Kolkata' },
  { name: 'Ludhiana', country: 'India', latitude: 30.901, longitude: 75.8573, timezone: 'Asia/Kolkata' },
  { name: 'Agra', country: 'India', latitude: 27.1767, longitude: 78.0081, timezone: 'Asia/Kolkata' },
  { name: 'Nashik', country: 'India', latitude: 19.9975, longitude: 73.7898, timezone: 'Asia/Kolkata' },
  { name: 'Faridabad', country: 'India', latitude: 28.4089, longitude: 77.3178, timezone: 'Asia/Kolkata' },
  { name: 'Meerut', country: 'India', latitude: 28.9845, longitude: 77.7064, timezone: 'Asia/Kolkata' },
  { name: 'Rajkot', country: 'India', latitude: 22.3039, longitude: 70.8022, timezone: 'Asia/Kolkata' },
  { name: 'Varanasi', country: 'India', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' },
  { name: 'Srinagar', country: 'India', latitude: 34.0837, longitude: 74.7973, timezone: 'Asia/Kolkata' },
  { name: 'Aurangabad', country: 'India', latitude: 19.8762, longitude: 75.3433, timezone: 'Asia/Kolkata' },
  { name: 'Dhanbad', country: 'India', latitude: 23.7957, longitude: 86.4304, timezone: 'Asia/Kolkata' },
  { name: 'Amritsar', country: 'India', latitude: 31.634, longitude: 74.8723, timezone: 'Asia/Kolkata' },
  { name: 'Navi Mumbai', country: 'India', latitude: 19.033, longitude: 73.0297, timezone: 'Asia/Kolkata' },
  { name: 'Allahabad (Prayagraj)', country: 'India', latitude: 25.4358, longitude: 81.8463, timezone: 'Asia/Kolkata' },
  { name: 'Ranchi', country: 'India', latitude: 23.3441, longitude: 85.3096, timezone: 'Asia/Kolkata' },
  { name: 'Howrah', country: 'India', latitude: 22.5958, longitude: 88.2636, timezone: 'Asia/Kolkata' },
  { name: 'Coimbatore', country: 'India', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata' },
  { name: 'Jabalpur', country: 'India', latitude: 23.1815, longitude: 79.9864, timezone: 'Asia/Kolkata' },
  { name: 'Gwalior', country: 'India', latitude: 26.2183, longitude: 78.1828, timezone: 'Asia/Kolkata' },
  { name: 'Vijayawada', country: 'India', latitude: 16.5062, longitude: 80.648, timezone: 'Asia/Kolkata' },
  { name: 'Jodhpur', country: 'India', latitude: 26.2389, longitude: 73.0243, timezone: 'Asia/Kolkata' },
  { name: 'Madurai', country: 'India', latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata' },
  { name: 'Raipur', country: 'India', latitude: 21.2514, longitude: 81.6296, timezone: 'Asia/Kolkata' },
  { name: 'Kota', country: 'India', latitude: 25.2138, longitude: 75.8648, timezone: 'Asia/Kolkata' },
  { name: 'Guwahati', country: 'India', latitude: 26.1445, longitude: 91.7362, timezone: 'Asia/Kolkata' },
  { name: 'Chandigarh', country: 'India', latitude: 30.7333, longitude: 76.7794, timezone: 'Asia/Kolkata' },
  { name: 'Solapur', country: 'India', latitude: 17.6599, longitude: 75.9064, timezone: 'Asia/Kolkata' },
  { name: 'Hubli-Dharwad', country: 'India', latitude: 15.3647, longitude: 75.124, timezone: 'Asia/Kolkata' },
  { name: 'Bareilly', country: 'India', latitude: 28.367, longitude: 79.4304, timezone: 'Asia/Kolkata' },
  { name: 'Mysore', country: 'India', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata' },
  { name: 'Tiruchirappalli', country: 'India', latitude: 10.7905, longitude: 78.7047, timezone: 'Asia/Kolkata' },
  { name: 'Dehradun', country: 'India', latitude: 30.3165, longitude: 78.0322, timezone: 'Asia/Kolkata' },
  { name: 'Kochi', country: 'India', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' },
  { name: 'Bhubaneswar', country: 'India', latitude: 20.2961, longitude: 85.8245, timezone: 'Asia/Kolkata' },
  { name: 'Ujjain', country: 'India', latitude: 23.1765, longitude: 75.7885, timezone: 'Asia/Kolkata' },
  { name: 'Haridwar', country: 'India', latitude: 29.9457, longitude: 78.1642, timezone: 'Asia/Kolkata' },

  // International - Americas
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Los Angeles', country: 'United States', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'San Francisco', country: 'United States', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Chicago', country: 'United States', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
  { name: 'Houston', country: 'United States', latitude: 29.7604, longitude: -95.3698, timezone: 'America/Chicago' },
  { name: 'Miami', country: 'United States', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York' },
  { name: 'Seattle', country: 'United States', latitude: 47.6062, longitude: -122.3321, timezone: 'America/Los_Angeles' },
  { name: 'Boston', country: 'United States', latitude: 42.3601, longitude: -71.0589, timezone: 'America/New_York' },
  { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
  { name: 'Vancouver', country: 'Canada', latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver' },
  { name: 'Montreal', country: 'Canada', latitude: 45.5017, longitude: -73.5673, timezone: 'America/Toronto' },

  // International - Europe
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Manchester', country: 'United Kingdom', latitude: 53.4808, longitude: -2.2426, timezone: 'Europe/London' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Berlin', country: 'Germany', latitude: 52.52, longitude: 13.405, timezone: 'Europe/Berlin' },
  { name: 'Frankfurt', country: 'Germany', latitude: 50.1109, longitude: 8.6821, timezone: 'Europe/Berlin' },
  { name: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam' },
  { name: 'Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich' },
  { name: 'Geneva', country: 'Switzerland', latitude: 46.2044, longitude: 6.1432, timezone: 'Europe/Zurich' },
  { name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome' },
  { name: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid' },
  { name: 'Vienna', country: 'Austria', latitude: 48.2082, longitude: 16.3738, timezone: 'Europe/Vienna' },
  { name: 'Dublin', country: 'Ireland', latitude: 53.3498, longitude: -6.2603, timezone: 'Europe/Dublin' },

  // International - Middle East & Asia
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai' },
  { name: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.531, timezone: 'Asia/Qatar' },
  { name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Osaka', country: 'Japan', latitude: 34.6937, longitude: 135.5023, timezone: 'Asia/Tokyo' },
  { name: 'Seoul', country: 'South Korea', latitude: 37.5665, longitude: 126.978, timezone: 'Asia/Seoul' },
  { name: 'Hong Kong', country: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, timezone: 'Asia/Hong_Kong' },
  { name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.139, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur' },
  { name: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne' },
  { name: 'Auckland', country: 'New Zealand', latitude: -36.8485, longitude: 174.7633, timezone: 'Pacific/Auckland' },
];

export function searchCities(query: string): CityData[] {
  if (!query || query.trim().length === 0) {
    return CITIES_DATABASE.slice(0, 10);
  }
  const clean = query.toLowerCase().trim();
  return CITIES_DATABASE.filter(
    (c) => c.name.toLowerCase().includes(clean) || c.country.toLowerCase().includes(clean)
  ).slice(0, 12);
}
