import React, { Children } from 'react';
import PropTypes from 'prop-types';
import './Button.css';


function Button(props) {
  return (
    <div>
      { (props.level === 'primary' || !props.level)  && 
        <button type={props.type} onClick={props.clickHandler}>
            {Children.toArray(props.children)}
        </button>
      }
      { props.level === 'secondary' && 
        <button type={props.type} className='secondary' onClick={props.clickHandler}>
            {Children.toArray(props.children)}
        </button>
      }
    </div>
  );
}

Button.propTypes = {
  clickHandler: PropTypes.func,
  level: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
