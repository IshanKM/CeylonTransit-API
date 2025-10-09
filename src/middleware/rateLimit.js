// src/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export default rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 requests per IP per minute
    message: "Too many requests, please try again later."
});
