const modal = document.getElementById("myModal");
const close = document.getElementsByClassName("close")[0];
const modalContent = document.getElementById("modalContent");
const movieWrapper = document.getElementById("movie-wrapper");
const loader = document.getElementById("loading");

close.onclick = () => {
  modal.style.display = "none";
}

const filmData = [];

(async () => {

  const filmRes = await fetch("https://swapi.dev/api/films")
  const { results: films } = await filmRes.json()

  const { characters } = films

  for (let filmIndex = 0; filmIndex < films.length; filmIndex++) {
    const film = films[filmIndex]
    const { characters } = film

    const charCache = []
    for (let charIndex = 0; charIndex < characters.length; charIndex++) {
      const characterUrl = characters[charIndex];
      
      const charRes = await fetch(characterUrl)
      const character = await charRes.json()

      charCache.push(character.name)
    }

    charCache.sort((a, b) => {
      return (a < b) ? -1 : (a > b) ? 1 : 0
    })

    filmData.push({
      filmTitle: film.title,
      filmRelease: film.release_date,
      characters: [
        ...charCache
      ]
    })
  }

  movieWrapper.innerHTML = filmData.map((film, index) => {
    return `<div class="movie" onClick="showMovie(${index})"><h2>${film.filmTitle}</h2><h3>${film.filmRelease}</h3></div>`
  })

  loader.style.display = "none"
})()

const showMovie = (filmIndex) => {
  const movie = filmData[filmIndex]

  modalContent.innerHTML = `
    <h1>${movie.filmTitle}</h1>
    <h2>Characters:</h2>
    ${movie.characters.map(char => {
      return `<p>${char}</p>`
    }).join('')}
  `;

  modal.style.display = "block";
}