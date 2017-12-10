import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './CopyToClipboard.css';
import chain from './svg/chain.svg';

import Button from './Button.js';


class CopyToClipboard extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      resultMsg: '',
      showResultMsg: false,
    };
  }

  selectTextFromElement(domElement) {
    if (window.getSelection && document.createRange) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(domElement);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(domElement);
      range.select();
    }
  }

  copyToClipboard(domElement) {
    this.selectTextFromElement(domElement);

    try {
      document.execCommand('copy');
      this.setState({resultMsg: 'Copied'}) ;
    } catch (err) {
      this.setState({resultMsg: 'Oops, unable to copy'}) ;
    }


    this.setState({
      showResultMsg : true,
    });

    this.copyTimeout = window.setTimeout(() => {
      window.clearTimeout(this.copyTimeout);
      this.setState({ showResultMsg: false });
    }, 3000);
  
  }

  render() {
    return (
      <div className="copyContainer">
          <span className="copyToClipboard" ref={(span) => { this.urlSpan = span; }} >
              {this.props.string}
          </span>


 
      </div>
    );
  }

}

CopyToClipboard.propTypes = {
  string: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string,
};

export default CopyToClipboard;
