import './App.css';
import '../Login/Login.css';
import React from 'react';
import cookie from "cookie";

import SearchBar from '../searchbar/searchbar';
import SearchResults from '../SearchResults/SerachResults';
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';
import Backend from '../../util/BackendFetch';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      //Tracks die von den searchresults in die Playlist gefügt werden 
      playlistTracks: [],
      loginName: "",
      loginPassword: "",
      sessionKey: cookie.parse(document.cookie)["sessionKey"],
      isLoggedIn: false,
      loginError: false,
    };
    if (!this.state.isLoggedIn && this.state.sessionKey != "") {
      Backend.validateSession(this.state.sessionKey).then((result) => {
        if (result["err"] === false && result["result"] === true) {
          this.setState({ isLoggedIn: true, });
        } else {
          this.setState({ sessionKey: "", });
        }
      });
    }
    //binden, weil Methoden an Playlist Komponente gepassed wird
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  //Songs von searchresults werden zu Ende der Playlist hinzugefügt, wenn id Property nicht mit einem
  //bereits hinzugefügten track übereinstimmt
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks })
  }
  //track mithilfe id property aus playlisttracks zu filtern und neues State bei Playlist setzen
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ playlistTracks: tracks });
  }
  //Nutzer kann den Namen der Playlist ändern 
  updatePlaylistName(name) {
    //State wird zu dem input Argument gesetzt
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    //Array mit den uris der tracks aus der Playlist 
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      //State auf ein leeres Array und default Playlist namen setzen
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) {
    Backend.getSpotifyKey(this.state.sessionKey).then((result) => {
      // TODO: when doing that, if the rest backend says the session key expired, delete it on frontend too
      // TODO: handle results that are not desired
      //Spotify.search(term, result["result"]).then(searchResults => {
      Spotify.search(term).then(searchResults => {
        this.setState({ searchResults: searchResults });
      })
    });
  }

  handleLoginPage = (event) => {
    event.preventDefault();
    Backend.createSession(this.state.loginName, this.state.loginPassword).then((result) => {
      if (result["err"] == false) {
        const expirey = new Date();
        expirey.setTime(expirey.getTime() + 1000 * 3600 * 48);
        document.cookie = "sessionKey=" + result["result"] + ";expires=" + expirey.toUTCString();
        this.setState({
          sessionKey: result["result"],
          isLoggedIn: true,
          loginError: false
        });
      } else {
        this.setState({ isLoggedIn: false, loginError: result["err"] });
        // TODO: give feedback to user
        // easy solution, an error bar and printing error from backend onto this bar
        console.error("Logging in has resulted in an Error:\n", result["err"]);
      }
    });
  }

  handleChangeForm = (event) => {
    // this is done so i can have one function dealing with all changes of forms
    let tempState = {};
    tempState[event.target.className] = event.target.value;
    this.setState(tempState);
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <div className="login-wrapper">
          <h1>Please Log In</h1>
          <form onSubmit={this.handleLoginPage}>
            <label>
              <p>Username</p>
              <input className='loginName' type="text" placeholder='Username' value={this.state.loginName} onChange={this.handleChangeForm} />
            </label>
            <label>
              <p>Password</p>
              <input className='loginPassword' type="password" placeholder='Password' value={this.state.loginPassword} onChange={this.handleChangeForm} />
            </label>
            <div>
              <button type="submit" onSubmit={this.handleLoginPage}>Submit</button>
              <p>{this.state.loginError}</p>
            </div>
          </form>
        </div>
      )
    }
    return (
      <div className="MainContent">
        <h1><span className="highlight">SpotifyOrganizer</span></h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">

            <SearchResults searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            {/*State von PlaylistName, Tracks, ... an Playlist Komponente übergeben*/}
            {/*removeTrack Methode an Playlist Komponente weitergeben*/}
            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
