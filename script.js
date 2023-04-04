const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('date-input');
const currentImageContainer = document.getElementById('image-container');
const searchHistory = document.getElementById('history-list');

const API_KEY = 'jvKmAWYE9sGIgo0x3t4rbb4aHZrELWglqeam7D6d';

let searches = JSON.parse(localStorage.getItem('searches')) || [];

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split('T')[0];
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${currentDate}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      currentImageContainer.innerHTML = `
        <div class="card">
          <img src="${data.url}" alt="${data.title}" />
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.explanation}</p>
            <p class="card-text"><small class="text-muted">${data.date}</small></p>
          </div>
        </div>
      `;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function getImageOfTheDay(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      currentImageContainer.innerHTML = `
        <div class="card">
          <img src="${data.url}" alt="${data.title}" />
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.explanation}</p>
            <p class="card-text"><small class="text-muted">${data.date}</small></p>
          </div>
        </div>
      `;

      // Save the search to local storage
      saveSearch(date);

      // Add the search to the search history
      addSearchToHistory();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function saveSearch(date) {
  searches.push(date);
  localStorage.setItem('searches', JSON.stringify(searches));
}

function addSearchToHistory() {
  // Clear the search history list
  searchHistory.innerHTML = '';

  // Loop through the searches and add them to the list
  searches.forEach((search) => {
    const li = document.createElement('li');
    li.textContent = search;
    li.addEventListener('click', () => {
      getImageOfTheDay(search);
    });
    searchHistory.appendChild(li);
  });
}

// Get the current image of the day when the page loads
getCurrentImageOfTheDay();

// Add an event listener to the search form
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchDate = searchInput.value;
  getImageOfTheDay(searchDate);
  searchInput.value = '';
});
