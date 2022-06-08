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
    search() {
        this.props.onSearch(this.state.term);
    }


    //Methode ersetzt den searchbar term mit dem event target wert
    handleTermChange(event) {
        this.setState({ term: event.target.value });
    }
    render() {
        return (
            <div className="SearchBar">
<<<<<<< HEAD
               {/*handleTermChange wird ausgelöst, wenn Nutzer Sucherbegriff eingibt*/}
                <input onChange = {this.handleTermChange} placeholder="Suchbegriff eingeben" />
=======
                {/*handleTermChange wird ausgelöst, wenn Nutzer Sucherbegriff eingibt*/}
                <input onChange={this.handleTermChange} placeholder="Suchbegriff eingeben" />
>>>>>>> 258dae184a88bb06b9d9915776f27fac78e13df6
                <button className="SearchButton">SUCHE STARTEN</button>
            </div>
        )
    }
}

export default SearchBar;
