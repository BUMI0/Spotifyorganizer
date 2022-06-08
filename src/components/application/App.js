import './App.css';
import '../Login/Login.css';
import React from 'react';


import SearchBar from '../searchbar/searchbar';
import SearchResults from '../SearchResults/SerachResults';
import Playlist from '../Playlist/Playlist';

import Spotify  from '../../util/Spotify';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      searchResults: [],
       playlistName: 'My Playlist',
      //Tracks die von den searchresults in die Playlist gefügt werden 
      playlistTracks: []
    };
    this.token = false;
    //binden, weil Methoden an Playlist Komponente gepassed wird
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  //Songs von searchresults werden zu Ende der Playlist hinzugefügt, wenn id Property nicht mit einem
  //bereits hinzugefügten track übereinstimmt
  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks})
  }
  //track mithilfe id property aus playlisttracks zu filtern und neues State bei Playlist setzen
  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }
  //Nutzer kann den Namen der Playlist ändern 
  updatePlaylistName(name){
    //State wird zu dem input Argument gesetzt
    this.setState({playlistName: name});
  }

  savePlaylist(){
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }
  
  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    })
  }
  
  render(){
    if(!this.token) {
      return (
      <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form>
        <label>
          <p>Username</p>
          <input type="text" />
        </label>
        <label>
          <p>Password</p>
          <input type="password" />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
    }
    return(
    <div className="MainContent">
      <h1><span className="highlight">SpotifyOrganizer</span></h1>
      <div className="App">
        <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
          
          <SearchResults searchResults={this.state.searchResults}
                        onAdd={this.addTrack}/>
          {/*State von PlaylistName, Tracks, ... an Playlist Komponente übergeben*/}
          {/*removeTrack Methode an Playlist Komponente weitergeben*/}
          <Playlist playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave = {this.savePlaylist}/>
    </div>
  </div>
</div>
    )
  }
}

export default App;
