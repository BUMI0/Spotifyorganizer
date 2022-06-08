//clientId von Spotify gegeben durch registrieren einer WebApplikation
const clientId = '6698407c6b244c96b9c5d13a829d0ebd';
const redirectUri = 'http://localhost:3000'; // TODO: dynamisch erstellen: also: window.location.host oder so
//Varible, die erhaltenen Access Token speichern soll
let accessToken;

const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }

        //gibt es einen access Token paar?
        //access token und mithilfe window.location.href aus URL abgerufen
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            //Die existierenden Parameter entfernen um neue Access Token zu erhalten
            window.setTimeout(() => accessToken = '', expiresIn * 1000); //Ablaufzeit
            window.history.pushState('Access Token', null, '/'); //
            return accessToken;
        } else {
            //redirect zu login
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },
    
    async search(term){ //akzeptiert den Such Term des Nutzers
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {headers: {
            //verwendung des accesstoken des Nutzer Accounts
            Authorization: `Bearer ${accessToken}`
        }
    }).then(response => {
        return response.json(); //response wird zu json konvertiert
    }).then(jsonResponse => {
            //Abfrage, ob tracks in der response sind
        if(!jsonResponse.tracks){ 
            return [];
        }
        //tracks werden als array zurückgegeben
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    })

    },
   //erstellte Playlist zu dem Spotidfy Account des NUtzers hinzufügen
    savePlaylist(name,trackUris){ //kontrolliert, ob Werte als Name und Track Uris gespeichert sind
        if(!name || !trackUris.length){
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers} //request nach dem usernamen des NUtzers
        ).then(response => response.json() //umwandlung der reaponse zu json
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            //POST request erstellt eine neue Playlist
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name}) //Playlist mit Namen der die Methode als Parameter hat
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id; //playlist Id ist die Id der erstellten Playlist im Spotify Account
                //POST requets der den track array zu der Playlist hinzufügt
                return fetch(`https://api.spontify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris}) //der tracks array
                })
            })
        })
    }
}

export default Spotify;
