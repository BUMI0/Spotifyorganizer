import crypto, { randomUUID } from "crypto";
import { ValidationError, WrongSessionKey, WrongCredentials } from "./customErrors.js";
import textCheck from "./textCheck.js";

const algo = "aes-256-gcm";
const int_vector = Buffer.from("36189a4f08b5fe0198acb181", "hex");
const key_salt = Buffer.from("a3a51f61059afcf7dbfc3729809e1c6cf106874a6603f5604bc28df203746d07", "hex");

// test account for login:
const sessions = {
    "PLACEHOLDER_SESSION_KEY": {
        "spotifyKey": "PLACEHOLDER_SPOTIFY_KEY",
        "username": "PLACEHOLDER_USERNAME",
        "creationTime": 111111,
        "isAdmin": false,
    }
};

const sessionsByName = {
    "PLACEHOLDER_NAME": "PLACEHOLDER_SESSION_KEY"
};

// depending on how much overhead you want this is better than asking the db every time (or worse if you dont want to use a lot of mem)
const nameByEmail = {
    "PLACEHOLDER@example.com": "PLACEHOLDER_NAME"
};

class sessionParser {
    async createSessionViaName(username, userpw, dbConn, callback) {
        if (textCheck.checkInputs(username, "Not existend", userpw)) {
            throw new WrongCredentials("wrong credentials");
        }
        if (sessionsByName.hasOwnProperty(username)) {
            callback(sessionsByName[username]);
            return;
        }
        const pw_salt = crypto.createHash("sha256").update(userpw).digest().toString("hex");
        return dbConn.collection("users").findOne({
            username: username,
            userpw: pw_salt,
        }, (err, dbRes) => {
            if (err) {
                throw err;
            }
            if (dbRes == null) {
                // should never happen
                // and only happened when stuff wasnt working
                console.error(username, "with pw_salt:", pw_salt, " was not found in db");
                callback(undefined);
                return;
            } else {
                // TODO: in an extra function so this and viaemail can use the function
                const decipher = crypto.createDecipheriv(algo, crypto.scryptSync(userpw, key_salt, 32), int_vector);
                const decrypted_spotifytoken = decipher.update(dbRes.spotifytoken, "hex", "utf-8");
                const sessionId = sessionParser.createNewSessionId();
                sessions[sessionId] = {
                    "spotifyKey": decrypted_spotifytoken,
                    "username": username,
                    "creationTime": new Date().getTime(),
                    "isAdmin": false,
                }
                sessionsByName[username] = sessionId;
                nameByEmail[dbRes.useremail] = username;
                callback(sessionId);
                console.log(username, "has logged in");
                return;
            }
        });
    }
    async createSessionViaEMail(email, userpw, dbConn, callback) {
        if (textCheck.checkInputs("Not existend", email, userpw)) {
            throw new WrongCredentials("wrong credentials");
        }
        if (nameByEmail.hasOwnProperty(email)) {
            if (sessionsByName.hasOwnProperty(nameByEmail[email])) {
                callback(sessionsByName[nameByEmail[email]]);
                return;
            }
        }
        const pw_salt = crypto.createHash("sha256").update(userpw).digest().toString("hex");
        dbConn.collection("users").findOne({
            useremail: email,
            userpw: pw_salt,
        }, (err, dbRes) => {
            if (err) {
                throw err;
            }
            if (dbRes == null) {
                console.error(email, "with pw_salt:", pw_salt, " was not found in db");
                callback(undefined);
                return;
            } else {
                const decipher = crypto.createDecipheriv(algo, crypto.scryptSync(userpw, key_salt, 32), int_vector);
                const decrypted_spotifytoken = decipher.update(dbRes.spotifytoken, "hex", "utf-8");
                const sessionId = sessionParser.createNewSessionId();
                sessions[sessionId] = {
                    "spotifyKey": decrypted_spotifytoken,
                    "username": dbRes.username,
                    "creationTime": new Date().getTime(),
                    "isAdmin": false,
                }
                sessionsByName[dbRes.username] = sessionId;
                nameByEmail[email] = dbRes.username;
                callback(sessionId);
                console.log(dbRes.username, "has logged in");
                return;
            }
        });
    }

    checkSession(sessionKey) {
        if (textCheck.checkInput(sessionKey)) {
            throw new WrongCredentials("wrong credentials");
        }
        if (sessions.hasOwnProperty(sessionKey)) {
            const sessionTimedOut = !(sessions[sessionKey].creationTime - new Date().getTime() <= 3600 * 48);
            console.log(sessions[sessionKey].creationTime, new Date().getTime(), "=", sessionTimedOut);
            if (sessionTimedOut) {
                console.log("deleting:", sessionKey);
                console.log("before:", sessions);
                delete sessions[sessionKey];
                console.log("after:", sessions);
            }
            console.log(sessionKey, "checked his Session", sessionTimedOut ? "unsuccessfully" : "successfully");
            return !sessionTimedOut;
        }
        throw new WrongSessionKey("wrong session key");
    }

    // Most likely never used, but whilest in development ill leave it in
    // delete when stopping development
    getUsername(sessionKey) {
        if (textCheck.checkInput(sessionKey)) {
            throw new WrongCredentials("wrong credentials");
        }
        if (sessions.hasOwnProperty(sessionKey)) {
            console.log("Someone needed his username to change his spoitfytoken");
            return sessions[sessionKey]["username"];
        }
        throw new WrongSessionKey("wrong session key");
    }

    getSpotifyToken(sessionKey) {
        if (textCheck.checkInput(sessionKey)) {
            throw new WrongCredentials("wrong credentials");
        }
        if (sessions.hasOwnProperty(sessionKey)) {
            console.log("Someone requested his spotifytoken, which will not be printed here");
            return sessions[sessionKey]["spotifyKey"];
        }
        throw new WrongSessionKey("wrong session key");
    }

    static createNewSessionId() {
        let result = crypto.randomUUID();
        // TODO: use not this uuid function because the uuid is far bigger than needed? (mem overhead)
        return result;
    }
}

export default sessionParser;