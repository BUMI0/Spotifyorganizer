import React from 'react';
import PropTypes from 'prop-types';

import './Track.css';

class Track extends React.Component {
    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    //Button -> Song hinzufügen oder entfernen
    renderAction() {
        //Button mit - wenn isRemoval = false
        if (this.props.isRemoval) {
            return <button className='Track-action' onClick={this.removeTrack}>-</button> //auslösen der removeTrack Methode
        } else {
            return <button className='Track-action' onClick={this.addTrack}>+</button> //auslösen der addTrack Methode
        }
    }
    addTrack() {
        this.props.onAdd(this.props.track);
    }
    //Entfernt Track, dessen id Property aus Playlist gefiltert wurde
    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-action">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {this.renderAction()}
            </div>
        )
    }
}

Track.propTypes = {
    track: PropTypes.object.isRequired,
    key: PropTypes.string,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    isRemoval: PropTypes.bool
}
export default Track;
