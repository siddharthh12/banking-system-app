const jwt = require("jsonwebtoken");

const authenticateBanker = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, banker) => {
    if (err) return res.sendStatus(403);
    if (banker.role !== "banker") return res.sendStatus(403);
    req.banker = banker;
    next();
  });
};

module.exports = authenticateBanker;
