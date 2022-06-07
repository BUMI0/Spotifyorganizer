import React from 'react';
import PropTypes from 'prop-types';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component{
    render() {
        return (
            <div className="TrackList">
                {
                 //für alle objekte im this.props.tracks array wird Track Komponent returned  
                this.props.tracks.map(track => {
                        return <Track track={track}
                            key={track.id} 
                            onAdd={this.props.onAdd}
                            onRemove={this.props.onRemove}
                            isRemoval={this.props.isRemoval}
                                />
                    })
                }
            </div>
        )
    }
}

//überprüfen, ob die daten valid sind
TrackList.propTypes = {
    tracks: PropTypes.array.isRequired,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    isRemoval: PropTypes.bool
}

export default TrackList;
