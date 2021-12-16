import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as BearerStrategy } from "passport-http-bearer";

import { verifyUser, comparePassword, verifyToken } from "@src/utils";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await verifyUser(email);
        await comparePassword(password, user.password);

        delete user.password;
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
      const userId = verifyToken(token);
      done(null, userId);
    } catch (err) {
      done(err);
    }
  })
);

module.exports = {
  initialize: () => passport.initialize(),
};
