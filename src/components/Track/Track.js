import React from 'react';
import PropTypes from 'prop-types';

import './Track.css';

class Track extends React.Component{
    constructor(props){
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    //Button -> Song hinzufügen oder entfernen
    renderAction () {
        if (this.props.isRemoval){
            return <button className='Track-action' onClick={this.removeTrack}>-</button>
        } else {
            return <button className='Track-action' onClick={this.addTrack}>+</button>
        }
    }
    addTrack() {
        this.props.onAdd(this.props.track);
    }
    removeTrack(){
        this.props.onRemove(this.props.track);
    }

    render () {
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
    searchResults: PropTypes.array.isRequired,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    track: PropTypes.object,
}
export default Track;
