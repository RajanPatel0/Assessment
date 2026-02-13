import { verifyAccessToken, getUserFromToken } from "../utils/Token/userToken.js";

export const userAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies (like vendor uses)
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Verify the token (checks signature + expiry)
    const decoded = verifyAccessToken(token);

    // Get user from decoded token's id
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // Token is valid → attach user to req object
    req.user = {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };

    // Continue to protected route
    next();

  } catch (err) {
    return res.status(401).json({ 
      message: "Unauthorized: " + err.message 
    });
  }
};
