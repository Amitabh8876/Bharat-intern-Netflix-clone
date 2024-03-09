// API Key and URLs
const apiKey = "acb4b4badef4e396949772271988bdbd";
const baseUrl = "https://api.themoviedb.org/3";
const imageUrl = "https://image.tmdb.org/t/p/original";
const fetchAllMoviesUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US`;
const fetchGenresUrl = `${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`;
const fetchTrendingUrl = `${baseUrl}/trending/all/week?api_key=${apiKey}&language=en-US`;

// Fetch data from the API
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Fetch banner and display
async function fetchAndDisplayBanner() {
    const trendingData = await fetchData(fetchTrendingUrl);
    const banner = document.getElementById("banner");
    const bannerContent = document.getElementById("banner_content");
    const bannerTitle = document.getElementById("banner_title");
    const bannerDescription = document.getElementById("banner_description");

    // Randomly select a movie from the trending list
    const randomIndex = Math.floor(Math.random() * trendingData.results.length);
    const movie = trendingData.results[randomIndex];

    // Update banner background with movie backdrop image
    banner.style.backgroundImage = `url(${imageUrl}${movie.backdrop_path})`;

    // Update banner content with movie details
    bannerTitle.innerText = movie.title;
    bannerDescription.innerText = movie.overview;

    // Display the banner
    bannerContent.style.display = "block";
}

// Populate movie sections by genre
async function populateMovieSections() {
    const genresData = await fetchData(fetchGenresUrl);
    const allMoviesData = await fetchData(fetchAllMoviesUrl);
    const movieSections = document.querySelector('.movie-sections');

    for (const genre of genresData.genres) {
        const moviesInSection = allMoviesData.results.filter(movie => movie.genre_ids.includes(genre.id)).slice(0, 6);

        if (moviesInSection.length > 0) {
            const section = document.createElement('section');
            section.classList.add('movie-section');
            const title = document.createElement('h2');
            title.classList.add('section-title');
            title.textContent = genre.name;
            section.appendChild(title);
            const movieRow = document.createElement('div');
            movieRow.classList.add('movie-row');

            moviesInSection.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie');
                const moviePoster = document.createElement('img');
                moviePoster.src = movie.poster_path ? `${imageUrl}${movie.poster_path}` : 'image/placeholder.png';
                movieElement.appendChild(moviePoster);
                movieRow.appendChild(movieElement);
            });

            section.appendChild(movieRow);
            movieSections.appendChild(section);
        }
    }
}

// Populate banner and movie sections on page load
window.addEventListener('load', () => {
    fetchAndDisplayBanner();
    populateMovieSections();
});
