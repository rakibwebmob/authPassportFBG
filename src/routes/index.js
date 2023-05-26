 import express from 'express';
import passport, { Passport } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import expressSession from 'express-session';
import AppleStrategy from 'passport-apple';
const app = express();
import db from "../config/db"
var user=db.user
const GOOGLE_CLINT_ID="486030974809-hg16cqhci2bgq4ieb65rrdn0gbb93gg5.apps.googleusercontent.com";
const GOOGLE_CLINT_SECRET="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";
const FACEBOOK_CLINT_ID="1297761350834773";
const FACEBOOK_CLINT_SECRET="d6484f319b930cdadfef1a74e3dc12d6";

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLINT_ID,
    clientSecret: GOOGLE_CLINT_SECRET,
    callbackURL: '/google'
},(accessToken, refreshToken, profile, done)=>{
    // callback(null, profile);
    user.findOne({googleId:profile.id}).then((currentUser)=>{
        if(currentUser){
            console.log("user is: " ,currentUser);
            done(null,currentUser);
        }else{
            new user({
                googleId:profile.id,
                username: profile.displayName
            }).save().then((newUser)=>{
                console.log("created new user:" ,newUser);
                done(null,newUser)
            })
        }
    })
}))

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLINT_ID,
    clientSecret: FACEBOOK_CLINT_SECRET,
    callbackURL:'/facebook',
    profileFields: ['emails', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, callback)=>{
    callback(null, profile)
}))

passport.use(
    new AppleStrategy(
      {
        clientID: 'your_client_id',
        teamID: 'your_team_id',
        keyID: 'your_key_id',
        privateKeyPath: 'path_to_your_private_key.p8',
        callbackURL: 'http://localhost:3000/apple',
      }, (accessToken, refreshToken, profile, callback)=>{
        callback(null, profile)
    }))


  

passport.serializeUser((user,callback)=>{
    callback(null, user);
})

passport.deserializeUser((user, callback)=>{
    callback(null, user);
})

app.use(expressSession({
    secret: 'rakiballiapp',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
//routes
app.get('/login/google', passport.authenticate('google', {scope:['profile email']}));
app.get('/login/facebook', passport.authenticate('facebook', {scope: ['email']}));

app.get('/google', passport.authenticate('google'),(req,res)=>{
    res.redirect('/');
})


app.get('/facebook', passport.authenticate('facebook'),(req,res)=>{
    res.redirect('/');
})

app.get("/login/apple",passport.authenticate("apple",{scope:['profile id']}))

app.get('/apple', passport.authenticate('apple'),(req,res)=>{
    res.redirect('/');
})

app.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
});
app.get('/',(req,res)=>{

    res.send(req.user? req.user: 'Not logged in, login with Google or facebook or apple');
})

app.listen(3000, ()=>{
    console.log('server started on 3000');
})

module.exports={app}