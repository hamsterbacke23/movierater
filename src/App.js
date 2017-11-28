import React, { Component } from 'react';
import './App.css';
import Button from './Button.js';
import Results from './Results.js';
import CopyToClipboard from './CopyToClipboard.js';
import octocat from './svg/octocat.svg';
import _ from 'lodash';

class App extends Component {

  apiKey = 'e0fa53bd'; // please create your own at omdbapi.com
  apiEndpoint = 'https://www.omdbapi.com/?t=';

  constructor(props) {
    super(props);
    
    this.state = {
      content: 'dances with wolves \nthe godfather',
      lines : ['dances with wolves', 'the godfather'],
      infos: [],
      href: '',
    };

    this.debouncedSubmit = _.debounce(this.handleSubmit, 1000)
  }

  handleChange(event) {
    this.setState({content: event.target.value});
    this.debouncedSubmit();
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    const lines = this.state.content.split('\n')
      .filter((item) => item.trim() !== '' );
    this.setState({
      lines: lines,
      infos : [], // reset
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
  }

  searchInfos(){
    this.setState({
      showSpinner: true,
    });

    const linePromises = this.state.lines.map((line) => fetch(this.apiEndpoint + `${line}&apikey=${this.apiKey}`)
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
        this.setState({
          infos : newValues,
        });
      }));

      // update href
      Promise.all(linePromises).then(() => {
        if (window.history.pushState) {
          window.history.pushState(null, null, '#' + this.state.infos.map(item => encodeURIComponent(item.Title)).join());
        }
        this.setState({
          href: window.location.href
        });
      });

  } 

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Movierater</h1>
        </header>
        <form className="App-input" onSubmit={this.handleSubmit}>
          <textarea onChange={this.handleChange.bind(this)} value={this.state.content}></textarea>
          <Button type="submit" clickHandler={this.handleSubmit}>Submit</Button>
        </form>
        <Results results={this.state.infos}/>
        
        {this.state.infos.length > 0 && 
          <CopyToClipboard 
            string={this.state.href}
          />
        }

        <a className="view-on-github" href="https://github.com/hamsterbacke23/movierater">
          <span> View on GitHub </span>
          <img src={octocat} alt="octocat"/>
        </a>
      </div>
    );
  }
}

export default App;
