//clientId von Spotify gegeben durch registrieren einer WebApplikation
const clientId = '6698407c6b244c96b9c5d13a829d0ebd';
const redirectUri = 'http://localhost:3000'; // TODO: dynamisch erstellen: also: window.location.host oder so
//Varible, die erhaltenen Access Token speichern soll
let accessToken;

const Spotify = {
    getAccessToken(dbAccessToken) {
        // TODO: check vailidity of dbAccessToken
        // if valid use that one
        // if not valid do the rest
        if (dbAccessToken !== undefined) {
            return dbAccessToken;
        }
        if (accessToken) {
            return accessToken;
        }

        //gibt es einen access Token paar?
        //access token und mithilfe window.location.href aus URL abgerufen
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            //Die existierenden Parameter entfernen um neue Access Token zu erhalten
            window.setTimeout(() => accessToken = '', expiresIn * 1000); //Ablaufzeit
            window.history.pushState('Access Token', null, '/'); //
            // TODO: safe new accesstoken inside of DB backend
            return accessToken;
        } else {
            //redirect zu login
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    async search(term, dbAccessToken) { //akzeptiert den Such Term des Nutzers
        const accessToken = Spotify.getAccessToken(dbAccessToken);
        // TODO: if term is empty dont do anything
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers: {
                    //request nach access token
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            })

    },

    savePlaylist(name, trackUris, accessToken) {
        if (!name || !trackUris.length) {
            return;
        }
        // TODO: handle empty playlists properly, seems there are bugs to kill
        // TODO: feedback to user if upload was successful
        accessToken = accessToken === undefined ? Spotify.getAccessToken() : accessToken;
        const headers = { Authorization: `Bearer ${accessToken}` };

        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then((userDataResponse) => {
            userDataResponse.json().then((json) => {
                const userId = json.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                    {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({ name: name })
                    }).then((PlaylistsResponse) => {
                        PlaylistsResponse.json().then(jsonResponse => {
                            console.log(jsonResponse)
                            const playlistId = jsonResponse.id;
                            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                                {
                                    headers: headers,
                                    method: 'POST',
                                    body: JSON.stringify({ uris: trackUris })
                                });
                        });
                    });
            });
        });
    }
}

export default Spotify;
