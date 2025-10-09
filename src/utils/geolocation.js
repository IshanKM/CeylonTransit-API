// Simple placeholder for reverse geocoding
// In production, you can integrate Google Maps API or OpenStreetMap Nominatim
export const getLocationName = async (lat, lng) => {
    // For now, just return "City name placeholder"
    return `Lat:${lat.toFixed(2)} Lng:${lng.toFixed(2)}`;
};
