// for actual production this would be converted to https
const redirectUri = 'http://localhost:3003'; // TODO: dynamisch erstellen: also: window.location.host oder so
const registerEndPoint = "/auth/register";
const loginEndPoint = "/auth/login";
const sessionEndPoint = "/auth/session";
const spotifyEndPoint = "/data/spotifytoken";
//Varible, die erhaltenen Access Token speichern soll
let sessionKey = "DEFAULT_KEY";

async function postFetch(body, endpoint) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    };
    return fetch(redirectUri + endpoint, requestOptions)
        .then(response => { return response.json() })
        .then(data => { return data })
        .catch((err) => { return "ERROR" + err });
}
const Backend = {
    async registerUser(username, useremail, userpw, sptoken) {
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
    },

    // createSession aka. login
    async createSession(username, userpw) {
        const body = JSON.stringify({
            name: username,
            pw: userpw,
        });
        return postFetch(body, loginEndPoint);
        // TODO: if request.statusCode == 200 take the newsession key as session key
        // TODO: load maincontent
        // TODO: if request.statusCode != 200 print errors to user
        // TODO: return sessionKey or error
    },

    async validateSession(key) {
        // for testing purposes
        sessionKey = key === undefined ? sessionKey : key;
        const body = JSON.stringify({
            sessionKey: sessionKey,
        });
        return postFetch(body, sessionEndPoint);
        // TODO: if request.statusCode == 200 take the newsession key as session key
        // TODO: load maincontent
        // TODO: if request.statusCode != 200 print errors to user
        // TODO: return sessionKey or error
    },

    async getSpotifyKey(key) {
        sessionKey = key === undefined ? sessionKey : key;
        const body = JSON.stringify({
            sessionKey: sessionKey,
        });
        return postFetch(body, spotifyEndPoint);
        // TODO: if request.statusCode == 200 take the new (or maybe its the old one, but who cares) session key as session key
        // TODO: load maincontent
        // TODO: if request.statusCode != 200 print errors to user
        // TODO: return sessionKey or error
    },
}

export default Backend;
