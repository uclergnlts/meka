export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  const driverCause = error.meta?.driverAdapterError?.cause;
  const mysqlPoolUnavailable = driverCause?.kind === "mysql" && Number(driverCause.code) === 45028;

  if (mysqlPoolUnavailable || error.code === "P1001" || error.code === "ECONNREFUSED" || error.message?.includes("Can't reach database server")) {
    res.status(503).json({
      error: "DATABASE_UNAVAILABLE",
      message: "Veritabanına bağlanılamadı. MySQL çalışıyor mu ve DATABASE_URL doğru mu kontrol edin.",
    });
    return;
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    res.status(400).json({
      error: "INVALID_JSON",
      message: "İstek gövdesi geçerli JSON biçiminde olmalıdır.",
    });
    return;
  }

  if (error.type === "entity.too.large") return res.status(413).json({ error: "PAYLOAD_TOO_LARGE", message: "Gönderilen veri çok büyük (en fazla 2 MB)." });
  if (error.status === 404 && req.path.startsWith("/uploads/")) return res.status(404).json({ error: "NOT_FOUND", message: "Dosya bulunamadı." });
  if (error.code === "P2003") return res.status(409).json({ error: "RECORD_IN_USE", message: "Stok geçmişi bulunan ürün silinemez." });
  if (error.code === "P2025") return res.status(404).json({ error: "NOT_FOUND", message: "Kayıt bulunamadı." });
  if (error.code === "P2002") {
    res.status(409).json({
      error: "DUPLICATE_RECORD",
      message: "Aynı benzersiz bilgiyle kayıt zaten mevcut.",
    });
    return;
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const isOperationalError = statusCode >= 400 && statusCode < 500;

  if (!isOperationalError) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: isOperationalError ? error.code ?? "REQUEST_FAILED" : "INTERNAL_SERVER_ERROR",
    message: isOperationalError ? error.message : "Beklenmeyen bir hata oluştu.",
    ...(isOperationalError && error.details ? { details: error.details } : {}),
  });
}
