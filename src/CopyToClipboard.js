import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './CopyToClipboard.css';

import Button from './Button.js';
import chain from './svg/chain.svg';



class CopyToClipboard extends Component {

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
        const successful = document.execCommand('copy');
        return 'Copied';
    } catch (err) {
        return 'Oops, unable to copy';
    }
  }

  render() {
    return (
      <div className="copyContainer">
          <span className="copyToClipboard" ref={(span) => { this.urlSpan = span; }} >
              {this.props.string}
          </span>
          <Button level='secondary' clickHandler={this.copyToClipboard.bind(this, this.urlSpan)}>
              Copy Link
              <img src={chain} alt="chain icon" />
          </Button>
      </div>
    );
  }

}

CopyToClipboard.propTypes = {
  string: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string,
};

export default CopyToClipboard;
