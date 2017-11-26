import React from 'react';
import PropTypes from 'prop-types';
import './Results.css';
import thumbsUp from './svg/thumbsUp.svg';
import customRating from './customRating.js'


const imdbUri = 'https://www.imdb.com/title/';
const thumbsUpSteps = 22;
const thumbsUpStart = 120;
const thumbsUpNullRating = 180;

const row = (result, index) =>
    <li key={`row_${index ? index : Math.random(1, 100000)}`}>
        <img src={result.Poster} alt={`${result.Title} Poster`}/>

        <span>{result.Title}</span>
        <ul className="ratings">
            {result.Ratings && result.Ratings.map((rating, j) =>
                <li key={`ratings_${j}_${index}`}>{rating.Source}: {rating.Value}</li>
            )}
        </ul>
        <img
            src={thumbsUp} 
            className={`customRating customRating-${result.customRating}`} 
            alt={`tobi rating: ${result.customRating}`}
            style={{
                'transform': `rotate(${result.customRating > 0 ? thumbsUpStart - thumbsUpSteps * result.customRating : thumbsUpNullRating}deg)`
            }}
            />
        
    </li>

const formatTitle = (results) => results.map((res) => {
    const newTitle = res.imdbID 
        ? <a href={imdbUri + res.imdbID}>{res.Title}</a>
        : res.Title;
    return {
        ...res,
        Title: newTitle
    }
});


function Results(props) {
    const customratedResults = customRating(props.results);
    const formattedResults = formatTitle(customratedResults);
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
