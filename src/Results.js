import React from 'react';
import PropTypes from 'prop-types';
import './Results.css';


const row = (result, index) =>
    <li key={`row_${index ? index : Math.random(1, 100000)}`}>
        <img src={result.Poster} alt={`${result.Title} Poster`}/>
        <span>{result.Title}</span>
        {result.Ratings && 
            <ul className="ratings">
                {result.Ratings.map((rating, j) =>
                    <li key={`ratings_${j}_${index}`}>{rating.Source}: {rating.Value}</li>
                )}
            </ul>
        }
    </li>




function Results(props) {
    return (
        <ul className="results">
            {props.results.map((result, index) =>
                result.Response !== 'False' ? row(result) : <li className='notfound' key={`nf_${index}`}>{result.Title} not found</li>
            )}
        </ul>
    );
}

Results.propTypes = {
  results: PropTypes.array
};

export default Results;
