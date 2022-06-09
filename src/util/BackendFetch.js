// for actual production this would be converted to https
const redirectUri = "";//'http://localhost:3003'; // TODO: dynamisch erstellen: also: window.location.host oder so
const registerEndPoint = "/auth/register";
const loginEndPoint = "/auth/login";
const sessionEndPoint = "/auth/session";
const spotifyEndPoint = "/data/spotifytoken";

async function postFetch(body, endpoint) {
    const requestOptions = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    };
    return fetch(redirectUri + endpoint, requestOptions)
        .then(response => { return response.json() })
        .then(data => { return data })
        .catch((err) => { return "ERROR:\n" + err });
}

async function registerUser(username, useremail, userpw, sptoken) {
    const body = JSON.stringify({
        name: username,
        email: useremail,
        pw: userpw,
        sptoken: sptoken,
    });
    return postFetch(body, registerEndPoint);
    // TODO: request
    // TODO: if request.statusCode == 200 take the new session key as session key
    // TODO: load maincontent
    // TODO: if request.statusCode != 200 print errors to user
    // TODO: return sessionKey or error
}

// createSession aka. login
async function createSession(username, userpw) {
    const body = JSON.stringify({
        name: username,
        pw: userpw,
    });
    return postFetch(body, loginEndPoint);
    // TODO: if request.statusCode == 200 take the newsession key as session key
    // TODO: load maincontent
    // TODO: if request.statusCode != 200 print errors to user
    // TODO: return sessionKey or error
}

async function validateSession(key) {
    // TODO: error when key empty
    const body = JSON.stringify({
        sessionKey: key,
    });
    return postFetch(body, sessionEndPoint);
    // TODO: if request.statusCode == 200 take the newsession key as session key
    // TODO: load maincontent
    // TODO: if request.statusCode != 200 print errors to user
    // TODO: return sessionKey or error
}

async function getSpotifyKey(key) {
    // TODO: error when key empty
    const body = JSON.stringify({
        sessionKey: key,
    });
    return postFetch(body, spotifyEndPoint + "/get");
    // TODO: if request.statusCode == 200 take the new (or maybe its the old one, but who cares) session key as session key
    // TODO: load maincontent
    // TODO: if request.statusCode != 200 print errors to user
    // TODO: return sessionKey or error
}

async function setSpotifyKey(key) {
    // TODO: error when key empty
    const body = JSON.stringify({
        sessionKey: key,
    });
    return postFetch(body, spotifyEndPoint + "/set");
    // TODO: if request.statusCode == 200 take the new (or maybe its the old one, but who cares) session key as session key
    // TODO: load maincontent
    // TODO: if request.statusCode != 200 print errors to user
    // TODO: return sessionKey or error
}

export default { registerUser, createSession, validateSession, getSpotifyKey };
