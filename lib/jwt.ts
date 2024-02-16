import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiredIn: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiredIn: "1d",
};

export function signJWT(
  payload: JwtPayload,
  option: SignOption = DEFAULT_SIGN_OPTION,
) {
  const secretKey = process.env.JWT_USER_ID_SECRET!;
  const token = jwt.sign(payload, secretKey);
  return token;
}

export function verifyJWT(token: string) {
  try {
    const secretkey = process.env.JWT_USER_ID_SECRET!;
    const decoded = jwt.verify(token, secretkey);
    return decoded as JwtPayload;
  } catch (e) {
    console.log(e);
    return null;
  }
}
