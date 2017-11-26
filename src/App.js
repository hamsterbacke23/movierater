import React, { Component } from 'react';
import './App.css';
import Button from './Button.js';
import Results from './Results.js';

class App extends Component {

  apiKey = 'e0fa53bd'; // please create your own at omdbapi.com

  constructor(props) {
    super(props);
    
    this.state = {
      content: 'dances with wolves',
      lines : ['dances with wolves'],
      infos: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({content: event.target.value});
  }

  handleSubmit(event) {
    const lines = this.state.content.split('\n')
      // .map((item) => item.replace(/-/g, ''))
      .filter((item) => item.trim() !== '' );
    this.setState({
      'lines': lines,
      'infos' : [], // reset
    });
  }

  componentDidMount() {
    if (window.location.hash) {
       const hashLines = window.location.hash.replace('#', '')
          .split(',')
          .map(item => decodeURIComponent(item));
       this.setState({
         lines: hashLines,
         content: hashLines.reverse().join('\n'),
      });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    if(previousState.lines !== this.state.lines) {
      this.searchInfos();
    }
    if(this.state.infos && window.history.pushState) {
        window.history.pushState(null, null, '#' + this.state.infos.map(item => encodeURIComponent(item.Title)).join());
    }
  }

  searchInfos(){
    this.state.lines.map((line) => fetch(`https://www.omdbapi.com/?t=${line}&apikey=${this.apiKey}`)
      .then(response => {
        if(!response.ok) {
          const e = new Error('Something went wrong');
          throw e;
        }
        return response.json();
      }).then(json => {
        if(json.Response === 'False') {
          json.Title = line;
        }
        const oldValues = this.state.infos;
        const newValues = [...oldValues, json];
        this.setState({infos : newValues});
      }));

  } 

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Movierater</h1>
        </header>
        <div className="App-input">
          <textarea onChange={this.handleChange} value={this.state.content}></textarea>
          <Button handleSubmit={this.handleSubmit}>Submit</Button>
        </div>
        <Results results={this.state.infos}/>
      </div>
    );
  }
}

export default App;
