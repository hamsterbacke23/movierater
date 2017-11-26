import React from 'react';
import PropTypes from 'prop-types';
import './Results.css';
import thumbs_up from './svg/thumbs_up.svg';
import tobiRating from './tobiRating.js'


const row = (result, index) =>
    <li key={`row_${index ? index : Math.random(1, 100000)}`}>
        <img src={result.Poster} alt={`${result.Title} Poster`}/>
        <span>{result.Title}</span>
        <ul className="ratings">
            {result.Ratings && result.Ratings.map((rating, j) =>
                <li key={`ratings_${j}_${index}`}>{rating.Source}: {rating.Value}</li>
            )}
        </ul>
        <img src={thumbs_up} className={`tobirating tobirating-${result.tobiRating}`} alt={`tobi rating: ${result.tobiRating}`}/>
        
    </li>



function Results(props) {
    const formattedResults = tobiRating(props.results);
    return (
        <ul className="results">
            {formattedResults.map((result, index) =>
                result.Response !== 'False' 
                    ? row(result) 
                    : <li className='notfound' key={`nf_${index}`}>{result.Title} not found</li>
            )}
        </ul>
    );
}

Results.propTypes = {
  results: PropTypes.array
};

export default Results;
