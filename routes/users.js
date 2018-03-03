const router = require("express").Router(),
    env = require("../config/env"),
    expressListRoutes   = require("express-list-routes"),
    map = require("../config/map"),
    crypto = require("crypto");

module.exports = (passport) => {

    router.post("/login", (req, res) => {
        passport.authenticate("local")(req, res, (err, user) => {
            if (req.user) {
                new global.models.token({
                    user: req.user._id,
                    hash: crypto.randomBytes(16).toString("hex")
                }).save((err, token) => {
                    return res.status(200).json({ token: token.hash });
                })
            } else {
                return res.status(401).json({ err: "Email or password are incorrect" })
            }
        })

    });

    router.post("/register", (req, res) => {
        global.models.user.register(new global.models.user({
            email: req.body.username,
            fname: req.body.fname,
            lname: req.body.lname
        }), req.body.password, (err, user) => {
            if (err) {
                return res.status(400).json({ err: "Email already in use" });
            } else {
                new global.models.token({
                    user: user._id,
                    hash: crypto.randomBytes(16).toString("hex")
                }).save((err, token) => {
                    return res.status(200).json({ token: token.hash });
                })
            }
        });
    });

    router.get("/create-admin/:key", (req, res) => {
        if (req.params.key == env.admin.key) {
            global.models.user.register(new global.models.user({
                email: env.admin.email,
                fname: env.admin.fname,
                lname: env.admin.lname,
                role: map.ROLES.ADMIN
            }), env.admin.password, (err, user) => {
                if (err) {
                    return res.send(env.admin);
                }
                return res.redirect("/");
            })
        } else {
            res.send("Invalid key");
        }
    });

    router.get("/me", passport.authenticate("bearer"), (req, res) => {
        res.status(200).json({ user: req.user });
    });

    expressListRoutes({ prefix: "/api/users" }, "API:", router );
    return router;
}