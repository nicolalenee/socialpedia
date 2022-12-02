import jwt from 'jsonwebtoken';

// grab req authorization header from the front end
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }
    // remove 'Bearer /s'
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    // run next step of the function
    next();
  } catch (err) {
    res.status(500).json({ error: err.message})
  }
}