export const ok = (res, data, meta = {}) => {
  res.json({
    ok: true,
    data,
    meta
  });
};

export const error = (res, err) => {
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "Internal server error",
      details: err.details || {}
    }
  });
};


