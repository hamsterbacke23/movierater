const tobiRating = (results) => {
    
    return results.map((res) => {
        let tobiRating = 0;
        
        if(res.imdbRating) {
            const value = parseFloat(res.imdbRating, 10);
            if (value < 7) tobiRating--;
            if (value >= 7.5) tobiRating++;
            if (value >= 8.5) tobiRating++;
        }

        if(res.Ratings && res.Ratings[1] && res.Ratings[1].Source === 'Rotten Tomatoes') {
            const value = parseInt(res.Ratings[1].Value, 10);
            if (value < 70) tobiRating--;
            if (value >= 80) tobiRating++;
            if (value >= 90) tobiRating = tobiRating + 2;
        }

        res.tobiRating = tobiRating;
        return res;
    });
}

export default tobiRating;