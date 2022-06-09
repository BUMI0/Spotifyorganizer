import crypto, { randomBytes } from "crypto";
import express from "express";
import morgan from "morgan"; // normally i write my own logging Solution but i am trying to stay close to the lessons
import cors from "cors";
import mongo from "mongodb"; // could use mongoose for encryption
import sessionParserIm from "./sessionParser.js";
import textCheck from "./textCheck.js";
import { ValidationError, WrongSessionKey, WrongCredentials } from "./customErrors.js";
// Variables
const PORT = 3003; // [1024..65536]
const loggingLevel = ":remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"; // https://github.com/expressjs/morgan#options
const mongoDBUrl = "localhost";
const mongoDBPort = 27017;
const mongoDBName = "testdb";

// This might belong into env vars for obscurity? and also for easy access n sessionParser
const algo = "aes-256-gcm"; // though obscurity does not provide security, it slows attacks down // doesnt have to be a secret
const int_vector = Buffer.from("36189a4f08b5fe0198acb181", "hex"); // produced by a secure rand generator // doesnt have to be a secret
const key_salt = Buffer.from("a3a51f61059afcf7dbfc3729809e1c6cf106874a6603f5604bc28df203746d07", "hex"); // produced by a secure rand generator // as far as i know also doesn't have to be a  secret

// Initialize Express
const app = express();

// Initialize Middlewares
app.use(morgan(loggingLevel));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// Initialize MongoDB
// Unsing MongoDB after extensive use of SQL in praxisphase really opened my eyes, how bad/not big project ready  mongodb compared to sql is XD
console.log("Starting MongoDB");
let mClient = new mongo.MongoClient("mongodb://" + mongoDBUrl + ":" + mongoDBPort);

// Starting MongoDB
// TODO:
console.log("MongoDB is now running");
mClient = await mClient.connect();
const dbConn = mClient.db(mongoDBName);
console.log("connected to: " + "mongodb://" + mongoDBUrl + ":" + mongoDBPort + "/" + mongoDBName);

if (true) {
    // reset the users database:
    dbConn.collection("users").deleteMany({});
    // add test accounts to useres db:
    addUserToDbWithoutChecks("logintest", "logintest@example.com", "logintestpw", "logintestspotifytoken");
    addUserToDbWithoutChecks("loginEMAILtest", "loginEMAILtest@example.com", "loginEMAILtestpw", "loginEMAILtestspotifytoken");
    addUserToDbWithoutChecks("chibbi", "chibbi@example.com", "b1g01ck", "BQAWhFkLj30ZZvrqWMg4Boa3V3WgHYqCELKYlZ9ILdANAB4BbnkjQupM_eCpBiTK_73wiaPGfaqKA4u-5TodszUngwFGzXZDO19BwdnqHjTQNTyPEKhQ_oTSZeIjDULZpezAfbOxXF3tydn1nL9mZ0GItEsL0t3C6tC79AeWLXq06Syntekrke7PmRDbbmczXSg")
}
// delete test Accounts on startup:
dbConn.collection("users").deleteMany({ "username": "user'1=1test'name" });
dbConn.collection("users").deleteMany({ "useremail": "useremail" });
dbConn.collection("users").deleteMany({ "username": "testregister" });
dbConn.collection("users").deleteMany({ "useremail": "testregister@example.com" });

// crude data how many users exist // mostly for development
console.log("users: ", await dbConn.collection("users").countDocuments());
console.log("admins:", await dbConn.collection("admins").countDocuments());

// session
const sessionParser = new sessionParserIm();

// Routing
app.post("/auth/register", (req, res) => {
    const username = req.body.name;
    const useremail = req.body.email;
    const userpw = req.body.pw;
    const spotifytoken = req.body.sptoken;
    if (username == undefined || useremail == undefined || userpw == undefined || spotifytoken == undefined) {
        res.statusCode = 400;
        return;
    }
    if (textCheck.checkEMailInput(useremail)) {
        res.status(401).send({ "err": "not a valid email" });
        return
    }
    if (textCheck.checkInput(username) || username.includes("@") || username.includes(".")) {
        res.status(401).send({ "err": "not a valid username" });
        return
    }
    // check if username exists
    dbConn.collection("users").findOne({
        username: username
    }, (err, dbRes) => {
        if (err) {
            res.status(500).send({ "err": "could not create user" });
            throw err;
        } else {
            if (dbRes == null) {
                // check if email exists
                dbConn.collection("users").findOne({
                    useremail: useremail
                }, (err, dbRes) => {
                    if (err) {
                        res.status(500).send({ "err": "could not create user" });
                        throw err;
                    } else {
                        if (dbRes == null) {
                            const cipher = crypto.createCipheriv(algo, crypto.scryptSync(userpw, key_salt, 32), int_vector);
                            const encrypted_spotifytoken = cipher.update(spotifytoken).toString("hex");
                            // using hmac would be more secure i think, but this is good enough for now
                            // most notably hmac can help against collisions i think
                            const pw_salt = crypto.createHash("sha256").update(userpw).digest().toString("hex");
                            // create user
                            dbConn.collection("users").insertOne({
                                username: username,
                                useremail: useremail,
                                userpw: pw_salt,
                                spotifytoken: encrypted_spotifytoken,
                            }, (err, dbRes) => {
                                if (err) {
                                    res.status(500).send({ "err": "could not create user" });
                                    throw err;
                                }
                                createSession(username, userpw, res);
                            });
                        } else {
                            res.status(403).send({ "err": "email already exists" });
                        }
                    }
                });

            } else {
                res.status(403).send({ "err": "username already exists" });
            }
        }

    });
});
app.post("/auth/login", (req, res) => {
    const username = req.body.name;
    const userpw = req.body.pw;
    if (username == undefined || userpw == undefined) {
        res.status(400).send({ "err": "invalid input" });
        return;
    }
    if (username.includes("@")) {
        sessionParser.createSessionViaEMail(username, userpw, dbConn, (sessionId) => {
            if (sessionId == undefined) {
                res.status(401).send({ "err": "wrong input" });
                return;
            }
            // can also use res.statusCode = 200
            res.status(200).send({ "result": sessionId, "err": false });
        })
            .catch((e) => {
                if (e instanceof WrongCredentials || e instanceof WrongCredentials) {
                    res.status(401).send({ "err": "wrong input" });
                } else {
                    res.status(500).send({ "err": "could not create user" });
                    console.error("got some error, register:", e);
                }
            });
    } else {
        createSession(username, userpw, res);
    }
});
app.post("/auth/session", (req, res) => {
    const sessionKey = req.body.sessionKey;
    if (sessionKey == undefined) {
        res.status(401).send({ "err": "invalid input" });
        return;
    }
    try {
        if (sessionParser.checkSession(sessionKey)) {
            res.status(200).send({ "result": true, "err": false });
            return;
        }
    } catch (e) {
        if (e instanceof WrongSessionKey || e instanceof WrongCredentials) {
            res.status(401).send({ "err": "wrong input" });
            return;
        } else {
            res.status(500).send({ "err": "could not attempt to find session key" });
            console.error("got some error, session:", e);
        }
    }
});
app.post("/data/spotifytoken/get", (req, res) => {
    const sessionKey = req.body.sessionKey;
    if (sessionKey == undefined) {
        res.status(401).send({ "err": "invalid input" });
        return;
    }
    try {
        if (sessionParser.checkSession(sessionKey)) {
            const token = sessionParser.getSpotifyToken(sessionKey);
            res.status(200).send({ "result": token, "err": false });
            return;
        }
    } catch (e) {
        if (e instanceof WrongSessionKey || e instanceof WrongCredentials) {
            res.status(401).send({ "err": "wrong input" });
            return;
        } else {
            res.status(500).send({ "err": "could not attempt to find spotify token" });
            console.error("got some error, spotifytoken:", e);
        }
    }
});

app.post("/data/spotifytoken/set", (req, res) => {
    const sessionKey = req.body.sessionKey;
    const newToken = req.body.spToken;
    const username = req.body.name;
    const userpw = req.body.pw;
    if (sessionKey == undefined) {
        res.status(401).send({ "err": "invalid input" });
        return;
    }
    try {
        if (sessionParser.checkSession(sessionKey)) {
            // every username is unique also useremail one of those is enough
            const cipher = crypto.createCipheriv(algo, crypto.scryptSync(userpw, key_salt, 32), int_vector);
            const encrypted_spotifytoken = cipher.update(newToken).toString("hex");
            dbConn.collection("users").updateOne({
                username: username
            }, {
                $set: {
                    spotifytoken: encrypted_spotifytoken
                }
            }, (err, dbRes) => {
                if (err) {
                    res.status(500).send({ "err": "could not set spotify token" });
                    throw err;
                }
                res.status(200).send({ "result": true, "err": false });
                return;
            });
        }
    } catch (e) {
        if (e instanceof WrongSessionKey || e instanceof WrongCredentials) {
            res.status(401).send({ "err": "wrong input" });
            return;
        } else {
            res.status(500).send({ "err": "could not set spotify token" });
            console.error("got some error, spotifytoken:", e);
        }
    }
});

// Starting Server
app.listen(PORT);
console.log("Server is now running on", PORT);


function addUserToDbWithoutChecks(username, useremail, userpw, spotifytoken) {
    const cipher = crypto.createCipheriv(algo, crypto.scryptSync(userpw, key_salt, 32), int_vector);
    const encrypted_spotifytoken = cipher.update(spotifytoken).toString("hex");
    const pw_salt = crypto.createHash("sha256").update(userpw).digest().toString("hex");
    dbConn.collection("users").insertOne({
        username: username,
        useremail: useremail,
        userpw: pw_salt,
        spotifytoken: encrypted_spotifytoken,
    }, (err, dbRes) => {
        if (err) {
            res.status(500).send({ "err": "could not create user" });
            throw err;
        }
    });
}

function createSession(username, userpw, res) {
    sessionParser.createSessionViaName(username, userpw, dbConn, (sessionId) => {
        if (sessionId == undefined) {
            res.status(401).send({ "err": "wrong input" });
            return;
        }
        // can also use res.statusCode = 200
        res.status(200).send({ "result": sessionId, "err": false });
    })
        .catch((e) => {
            if (e instanceof WrongCredentials || e instanceof WrongCredentials) {
                res.status(401).send({ "err": "wrong input" });
            } else {
                res.status(500).send({ "err": "could not create user" });
                console.error("got some error, register:", e);
            }
        });
}