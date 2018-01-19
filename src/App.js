import React, { Component } from 'react';
import './App.css';
import './Spinner.css';
import Button from './Button.js';
import Results from './Results.js';
import './CopyToClipboard.css';
import chain from './svg/chain.svg';
import octocat from './svg/octocat.svg';

import Copy from 'react-copy';
import debounce from 'lodash.debounce';
import arrayDiff from 'arraydiff';

class App extends Component {
  apiKey = 'e0fa53bd'; // please create your own at omdbapi.com
  apiEndpoint = 'https://www.omdbapi.com/?t=';

  constructor(props) {
    super(props);

    this.state = {
      content:
        'Taxi Driver\nWild strawberries // ingmar bergman\nRan\nPsycho\nAliens',
      lines: [],
      infos: [],
      href: ''
    };

    this.debouncedSubmit = debounce(this.handleSubmit, 1000);
  }

  handleChange(event) {
    this.setState({ content: event.target.value });
    this.debouncedSubmit();
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const lines = this.state.content
      .split('\n')
      .filter(item => item.trim() !== ''); // get rid of empty lines

    this.setState(
      {
        lines: lines
      },
      this.updateHref
    );
  }

  removeInfo(removeDiff) {
    const newInfos = this.state.infos.filter((info, index) => {
      return (
        index < removeDiff.index ||
        index >= removeDiff.index + removeDiff.howMany
      );
    });
    this.setState({
      infos: newInfos
    });
  }

  componentDidMount() {
    if (window.location.hash) {
      this.getInfoFromHash();
    }
    window.addEventListener(
      'hashchange',
      this.getInfoFromHash.bind(this),
      false
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      'hashchange',
      this.getInfoFromHash.bind(this),
      false
    );
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.lines !== this.state.lines) {
      const diff = arrayDiff(previousState.lines, this.state.lines);

      diff
        .filter(diff => diff.type === 'insert')
        .map(insertDiff => this.searchInfos(insertDiff));

      diff
        .filter(diff => diff.type === 'remove')
        .map(removeDiff => this.removeInfo(removeDiff));
    }
  }

  getInfoFromHash() {
    const hashLines = window.location.hash
      .replace('#', '')
      .split(',')
      .map(item => decodeURIComponent(item));
    this.setState({
      lines: hashLines,
      content: hashLines.join('\n')
    });
  }

  searchInfos(insertDiff) {
    this.setState({
      showSpinner: true
    });
    const linePromises = insertDiff.values.map((line, j) => {
      const commentRegex = /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/;
      const commentMatches = line.match(commentRegex);
      const comment = commentMatches
        ? commentMatches[0].replace('//', '').trim()
        : '';

      const movieTitle = line.replace(commentRegex, ''); // remove comments
      const uri = this.apiEndpoint + `${movieTitle}&apikey=${this.apiKey}`;

      return fetch(uri)
        .then(response => {
          if (!response.ok) {
            const e = new Error('Something went wrong');
            throw e;
          }
          return response.json();
        })
        .then(json => {
          if (json.Response === 'False') {
            json.Title = line;
          }
          json.Comment = comment;
          const newInfos = this.state.infos;
          // insert new items right away at correct position from insertDiff.index
          newInfos.splice(insertDiff.index + j, 0, json);
          this.setState({
            infos: newInfos
          });
          return json;
        });
    });

    Promise.all(linePromises)
      .then(() => {
        this.setState({
          showSpinner: false
        });
        this.updateHref();
      })
      .catch(function(err) {
        this.setState({
          showSpinner: false
        });
        console.log(err.message);
      });
  }

  updateHref() {
    if (window.history.pushState) {
      window.history.pushState(
        { state: this.state.content },
        null,
        '#' + this.state.lines.map(line => encodeURIComponent(line)).join()
      );
    }
    this.setState({
      href: window.location.href
    });
  }

  onCopy(result) {
    this.setState({ showResultMsg: true });

    this.copyTimeout = window.setTimeout(() => {
      window.clearTimeout(this.copyTimeout);
      this.setState({ showResultMsg: false });
    }, 3000);
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
          <textarea
            onChange={this.handleChange.bind(this)}
            value={this.state.content}
          />
          <Button type="submit" onClick={this.handleSubmit}>
            Submit
          </Button>
        </form>

        <div
          className={this.state.showSpinner ? 'spinner active' : 'spinner'}
        />

        <Results results={this.state.infos} />

        {this.state.infos.length > 0 && (
          <Copy
            textToBeCopied={this.state.href}
            onCopy={this.onCopy.bind(this)}
            className="copywrapper"
          >
            <Button level="secondary">
              {this.state.showResultMsg === true ? (
                'Copied!'
              ) : (
                <span className="flex">
                  Copy Link<img
                    src={chain}
                    className="icon chain-icon"
                    alt="chain icon"
                  />
                </span>
              )}
            </Button>
          </Copy>
        )}

        <a
          className="view-on-github"
          href="https://github.com/hamsterbacke23/movierater"
        >
          <span> View on GitHub </span>
          <img src={octocat} alt="octocat" />
        </a>
      </div>
    );
  }
}

export default App;
