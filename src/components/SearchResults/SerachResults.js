import React from "react";
import PropTypes from 'prop-types';
import'./SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component {
    render(){
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList tracks={this.props.searchResults}
                            onAdd={this.props.onAdd}
                            isRemoval={false}/>
            </div>
        )
    }
}

SearchResults.propTypes = {
    searchResults: PropTypes.array.isRequired,
    onAdd: PropTypes.func,
}
export default SearchResults;