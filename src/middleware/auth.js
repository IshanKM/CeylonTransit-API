// src/middleware/auth.js
export function requireApiKey(req, res, next) {
  const key = req.header('x-api-key') || req.query.api_key;
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized: invalid API key' });
  }
  next();
}
