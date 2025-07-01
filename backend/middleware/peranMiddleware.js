const verifyAdmin = (req, res, next) => {
  if (req.user?.id_peran !== 1) {
    return res.status(403).json({ error: 'Akses terbatas untuk Admin.' });
  }
  next();
};

module.exports = { verifyAdmin };
