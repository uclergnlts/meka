export function notFoundHandler(req, res) {
  // Shared hosting caches keep a "not found" answer for a while; without this a file added
  // later (robots.txt, a new image) would stay missing until that cache expires.
  res.set("Cache-Control", "no-store").status(404).json({
    error: "NOT_FOUND",
    message: `${req.method} ${req.originalUrl} endpointi bulunamadı.`,
  });
}
