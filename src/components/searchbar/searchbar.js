import React from 'react';

import './searchbar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            term: ''
        }

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    //Methode akzeptiert den state von dem search Attribut 
    search(event) {
        this.props.onSearch(this.state.term);
    }


    //Methode ersetzt den searchbar term mit dem event target wert
    handleTermChange(event) {
        this.setState({ term: event.target.value });
    }
    render() {
        return (
            <div className="SearchBar">
                {/*handleTermChange wird ausgelöst, wenn Nutzer Sucherbegriff eingibt*/}
                <input onChange={this.handleTermChange} placeholder="Suchbegriff eingeben" />
                <button onClick={this.search} className="SearchButton">SUCHE STARTEN</button>
            </div>
        )
    }
}

export default SearchBar;
