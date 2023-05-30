const express = require("express");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const expressSession = require("express-session");
const AppleStrategy = require("passport-apple");
const db = require("../config/db");
const user = db.user;

const app = express();

const GOOGLE_CLIENT_ID =
  "486030974809-hg16cqhci2bgq4ieb65rrdn0gbb93gg5.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const FACEBOOK_CLIENT_ID = "1297761350834773";
const FACEBOOK_CLIENT_SECRET = "d6484f319b930cdadfef1a74e3dc12d6";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/google",
    },
    (accessToken, refreshToken, profile, done) => {
      user.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log("user is: ", currentUser);
          done(null, currentUser);
        } else {
          new user({
            googleId: profile.id,
            username: profile.displayName,
          })
            .save()
            .then((newUser) => {
              console.log("created new user:", newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: "/facebook",
      profileFields: ["emails", "displayName", "name", "picture"],
    },
    (accessToken, refreshToken, profile, done) => {
      user.findOne({ facebookId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log("user is: ", currentUser);
          done(null, currentUser);
        } else {
          new user({
            facebookId: profile.id,
            displayName: profile.displayName,
            // name:profile.name,
            // picture:profile.picture,
            // emails:profile.emails
          })
            .save()
            .then((newUser) => {
              console.log("created new user:", newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new AppleStrategy(
    {
      clientID: "your_client_id",
      teamID: "your_team_id",
      keyID: "your_key_id",
      privateKeyPath: "path_to_your_private_key.p8",
      callbackURL: "http://localhost:3000/apple",
    },
    (accessToken, refreshToken, profile, callback) => {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});

app.use(
  expressSession({
    secret: "rakiballiapp",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
app.get("/google", passport.authenticate("google"), (req, res) => {
  res.redirect("/");
});
app.get("/facebook", passport.authenticate("facebook"), (req, res) => {
  res.redirect("/");
});
app.get(
  "/login/apple",
  passport.authenticate("apple", { scope: ["profile", "id"] })
);
app.get("/apple", passport.authenticate("apple"), (req, res) => {
  res.redirect("/");
});
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.get("/", (req, res) => {
  res.send(
    req.user
      ? req.user
      : "Not logged in, login with Google or Facebook or Apple"
  );
});

app.listen(3000, () => {
  console.log("server started on 3000");
});

module.exports = { app };
