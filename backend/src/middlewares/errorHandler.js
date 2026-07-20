export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error.code === "P1001" || error.code === "ECONNREFUSED" || error.message?.includes("Can't reach database server")) {
    res.status(503).json({
      error: "DATABASE_UNAVAILABLE",
      message: "Veritabanına bağlanılamadı. PostgreSQL çalışıyor mu ve DATABASE_URL doğru mu kontrol edin.",
    });
    return;
  }

  res.status(error.statusCode ?? 500).json({
    error: error.code ?? "INTERNAL_SERVER_ERROR",
    message: error.message ?? "Beklenmeyen bir hata oluştu.",
    details: error.details,
  });
}
