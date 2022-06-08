import React from 'react';
import PropTypes from 'prop-types';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
    constructor(props){
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    //event wird durch eingabe des Nutzers ausgelöst(getriggert) wird -> durch onChange Attribut im input Element
    handleNameChange(event){
        this.props.onNameChange(event.target.value);
    }
    render (){
        return (
            <div className="Playlist">
            //Methode an das onChange property passen
            <input defaultValue={"New Playlist"} onChange = {this.handleNameChange}/>
            <TrackList tracks={this.props.playlistTracks}
                        onRemove={this.props.onRemove}
                        isRemoval={true}/>
            //value set wird ausgeführt bei button click
            <button className="Playlist-save" onClick={this.props.onSave}>IN SPOTIFY ÜBERTRAGEN</button>
          </div> 
        )
    }
}

Playlist.propTypes = {
    playlistTracks: PropTypes.array.isRequired,
    onNameChange: PropTypes.func,
    onSave: PropTypes.func,
    onRemove: PropTypes.func,
}
export default Playlist;
