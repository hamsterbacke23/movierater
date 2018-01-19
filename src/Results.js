import React from 'react';
import PropTypes from 'prop-types';
import './Results.css';
import thumbsUp from './svg/thumbsUp.svg';
import customRating from './customRating.js';

const netflixSearchUri = 'https://www.netflix.com/search?q=';
const imdbUri = 'https://www.imdb.com/title/';
const thumbsUpSteps = 22;
const thumbsUpStart = 120;
const thumbsUpNullRating = 180;

const row = (result, index) => (
  <li key={`row_${index ? index : Math.random(1, 100000)}`}>
    {result.Poster !== 'N/A' ? (
      <img src={result.Poster} alt={`${result.Title} Poster`} />
    ) : (
      <span className="noimage">N/A</span>
    )}

    <div className="infowrapper">
      <div className="info">
        <div>
          <span className="title">{result.Title}</span>
          <div className="links">
            {result.imdbLink}
            <a href={netflixSearchUri + encodeURIComponent(result.Title)}>
              Search on Netflix
            </a>
          </div>
        </div>

        <ul className="ratings">
          {result.Comment && (
            <li className="comment">
              <span className="value">{result.Comment}</span>
            </li>
          )}
          {result.Ratings &&
            result.Ratings.map((rating, j) => (
              <li key={`ratings_${j}_${index}`}>
                <span className="vendor">{rating.Source}</span>
                <span className="value">{rating.Value}</span>
              </li>
            ))}
        </ul>

        <img
          src={thumbsUp}
          className={`customRating customRating-${result.customRating}`}
          alt={`tobi rating: ${result.customRating}`}
          style={{
            transform: `rotate(${
              result.customRating > 0
                ? thumbsUpStart - thumbsUpSteps * result.customRating
                : thumbsUpNullRating
            }deg)`
          }}
        />
      </div>
    </div>
  </li>
);

const formatTitle = results =>
  results.map(res => {
    const newTitle = res.imdbID ? <a href={imdbUri + res.imdbID}>imdb</a> : '';
    return {
      ...res,
      imdbLink: newTitle
    };
  });

function Results(props) {
  const customratedResults = customRating(props.results);
  const formattedResults = formatTitle(customratedResults);
  return (
    <ul className="results">
      {formattedResults.map(
        (result, index) =>
          result.Response !== 'False' ? (
            row(result)
          ) : (
            <li className="notfound" key={`nf_${index}`}>
              {result.Title} not found
            </li>
          )
      )}
    </ul>
  );
}

Results.propTypes = {
  results: PropTypes.array
};

export default Results;
