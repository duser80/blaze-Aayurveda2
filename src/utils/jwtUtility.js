import jwt from "jsonwebtoken";

const secretKey = "qwertyVerseJackGupta"; // Replace with your actual secret key, and keep it safe

export function generateToken(user) {
  const payload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Token valid for 1 hour
}
