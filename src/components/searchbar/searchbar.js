import React from 'react';

import './searchbar.css';

class searchbar extends React.Component{
    render(){
        return (
            <div className="SearchBar">
                <input placeholder="Suchbegriff eingeben" />
                <button className="SearchButton">SUCHE STARTEN</button>
            </div>
        )
    }
}

export default searchbar;