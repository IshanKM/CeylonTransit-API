// src/helpers/geo.js
export function toRad(v) { return (v * Math.PI) / 180; }

// distance in meters between [lng,lat] points
export function distanceMeters(a, b) {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const R = 6371000;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);
  const aa = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
             Math.cos(φ1) * Math.cos(φ2) *
             Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

// bearing in degrees from point A to B
export function bearing(a, b) {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const toRad = (v) => (v * Math.PI) / 180;
  const toDeg = (v) => (v * 180) / Math.PI;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const λ1 = toRad(lng1), λ2 = toRad(lng2);
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2 - λ1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// linear interpolate between two coords
export function interpolate(a, b, t) {
  return [ a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t ];
}
