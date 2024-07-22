import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  // generate json web token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    // expiry
    expiresIn: "15d",
  });
  //   cookie
  res.cookie("jwt", token, {
    // secure
    httpOnly: true,
    // miliseconds
    maxAge: 15 * 24 * 60 * 60 * 1000,

    // Cross-Site Request Forgery (CSRF) is an attack that forces authenticated users
    // to submit a request to a Web application against
    // which they are currently authenticated.
    sameSite: "strict",
  });
  return token;
};

export default generateTokenAndSetCookie;
