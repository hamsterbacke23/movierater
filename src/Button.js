import React, { Children } from 'react';
import PropTypes from 'prop-types';
import './Button.css';


function Button(props) {
  return (
    <div>
      { (props.type === 'primary' || !props.type)  && 
        <button onClick={props.clickHandler}>
            {Children.toArray(props.children)}
        </button>
      }
      { props.type === 'secondary' && 
        <button className='secondary' onClick={props.clickHandler}>
            {Children.toArray(props.children)}
        </button>
      }
    </div>
  );
}

Button.propTypes = {
  clickHandler: PropTypes.func,
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
