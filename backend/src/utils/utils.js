import jwt from "jsonwebtoken";

export const generateJWT = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    httpOnly: true, // prevents XSS attacks
    sameSite: "strict", // CSRF attack prevention
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
