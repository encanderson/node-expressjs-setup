import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as BearerStrategy } from "passport-http-bearer";

import { UserToken, UserVerification } from "@src/utils";
import { Blocklist } from "../subscribers";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserVerification.verifyUser(email);
        await UserVerification.comparePassword(password, user.password);

        delete user.password;

        const { refreshToken } = await UserToken.generateRefreshToken(email);

        user.refreshToken = refreshToken;

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      await Blocklist.verifyToken(token);
      const userId = UserToken.verifyToken(token);
      done(null, userId, token);
    } catch (err) {
      done(err);
    }
  })
);

module.exports = {
  initialize: () => passport.initialize(),
};
