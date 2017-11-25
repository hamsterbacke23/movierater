import React, { Children } from 'react';
import PropTypes from 'prop-types';
import './Button.css';


function Button(props) {
  return (
    <button onClick={props.handleSubmit}>
        {Children.toArray(props.children)}
    </button>
  );
}

Button.propTypes = {
  handleSubmit: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Button;
