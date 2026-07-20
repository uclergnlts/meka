export function notFoundHandler(req, res) {
  res.status(404).json({
    error: "NOT_FOUND",
    message: `${req.method} ${req.originalUrl} endpointi bulunamadı.`,
  });
}
