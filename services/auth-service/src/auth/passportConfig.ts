import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET is not defined in the environment variables"
  );
}

const cookieExtractor = (req: any): string | null => {
  return req && req.cookies ? req.cookies["jwt-token"] : null;
};

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
};

passport.use(
  new JwtStrategy(options, (jwtPayload, done) => {
    try {
      return done(null, jwtPayload);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
