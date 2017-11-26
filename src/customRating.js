const customRating = (results) => {
    
    return results.map((res) => {
        let customRating = 0;
        
        if(res.imdbRating) {
            const value = parseFloat(res.imdbRating, 10);
            if (value < 7) customRating--;
            if (value >= 7.5) customRating++;
            if (value >= 8.0) customRating++;
            if (value >= 8.5) customRating++;
        }

        if(res.Ratings && res.Ratings[1] && res.Ratings[1].Source === 'Rotten Tomatoes') {
            const value = parseInt(res.Ratings[1].Value, 10);
            if (value < 70) customRating--;
            if (value >= 80) customRating++;
            if (value >= 90) customRating++;
            if (value >= 95) customRating++;
        }

        res.customRating = customRating;
        return res;
    });
}

export default customRating;