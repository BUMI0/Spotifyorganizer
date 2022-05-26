import React from 'react';

import './searchbar.css';

class SearchBar extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            term: ''
        }
        
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    search() {
        this.props.onSearch(this.state.term);
    }
    
    
    handleTermChange(event){
        this.setState({term: event.target.value});
    }
    render(){
        return (
            <div className="SearchBar">
                <input onChange = {this.handleTermChange} placeholder="Suchbegriff eingeben" />
                <button className="SearchButton">SUCHE STARTEN</button>
            </div>
        )
    }
}

export default SearchBar;
