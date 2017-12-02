import React, { Component } from 'react';
import './App.css';
import './Spinner.css';
import Button from './Button.js';
import Results from './Results.js';
import CopyToClipboard from './CopyToClipboard.js';
import octocat from './svg/octocat.svg';
import debounce from 'lodash/debounce';
import arrayDiff from 'arraydiff';

class App extends Component {

  apiKey = 'e0fa53bd'; // please create your own at omdbapi.com
  apiEndpoint = 'https://www.omdbapi.com/?t=';

  constructor(props) {
    super(props);
    
    this.state = {
      content: 'dances with wolves\nwild strawberries //good movie! \nthe godfather',
      lines : [],
      infos: [],
      href: '',
    };

    this.debouncedSubmit = debounce(this.handleSubmit, 1000);
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
      .filter((item) => item.trim() !== '' ); // get rid of empty lines
    
    // get all remove diffs and search them
    arrayDiff(this.state.lines, lines)
      .filter(diff => diff.type === 'remove')
      .map(removeDiff => this.removeInfo(removeDiff));

    this.setState({
      lines: lines,
    });
  }

  removeInfo(removeDiff) {
    const newInfos = this.state.infos.filter((info, index) => index !== removeDiff.index);
    this.setState({
      infos: newInfos
    });
  }


  componentDidMount() {
    if (window.location.hash) {
      this.getInfoFromHash();
    }
    window.addEventListener('hashchange', this.getInfoFromHash.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.getInfoFromHash.bind(this), false);
  }

  componentDidUpdate(previousProps, previousState) {
    if(previousState.lines !== this.state.lines) {
      
      // get all insert diffs and search them
      arrayDiff(previousState.lines, this.state.lines)
        .filter(diff => diff.type === 'insert')
        .map(insertDiff => this.searchInfos(insertDiff));
    }
  }

  getInfoFromHash() {
    const hashLines = window.location.hash.replace('#', '')
      .split(',')
      .map(item => decodeURIComponent(item));
    this.setState({
      lines: hashLines,
      content: hashLines.join('\n'),
    });
  }

  searchInfos(insertDiff){
    this.setState({
      showSpinner: true,
    });
    const linePromises = insertDiff.values.map((line) => {
      const movieTitle = line.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/, ''); // remove comments
      const uri = this.apiEndpoint + `${movieTitle}&apikey=${this.apiKey}`;

      return fetch(uri)
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
          return json;
        })
      });

      // update href
      Promise.all(linePromises).then((values) => {
        const newInfos = this.state.infos;
        newInfos.splice(insertDiff.index, 0, ...values); // js is awesome
        
        this.setState({
          infos : newInfos,
          href: window.location.href,
          showSpinner: false,
        });

        if (window.history.pushState) {
          window.history.pushState({state: this.state.content}, null, '#' + this.state.lines.map(line => encodeURIComponent(line)).join());
        }
      });

  } 

  render() {
    document.title = this.state.infos.length 
      ? 'Movierater - ' + this.state.infos.map(item => item.Title).join(', ') 
      : 'Movierater';
  
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Movierater</h1>
        </header>
        <form className="App-input" onSubmit={this.handleSubmit}>
          <textarea onChange={this.handleChange.bind(this)} value={this.state.content}></textarea>
          <Button type="submit" clickHandler={this.handleSubmit}>Submit</Button>
        </form>
        
        <div className={this.state.showSpinner ? 'spinner active' : 'spinner'}></div>
        
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
