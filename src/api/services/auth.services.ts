import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { verifyUser, comparePassword } from "@src/utils";

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
