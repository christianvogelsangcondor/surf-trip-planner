// frontend/app.js

// Function to handle the search form submission
function handleSearch(event) {
    event.preventDefault(); // Prevent default form submission

    const waveResults = document.getElementById('waveResults');
    const flightResults = document.getElementById('flightResults');

    // Clear previous results
    waveResults.innerHTML = '';
    flightResults.innerHTML = '';

    const searchQuery = document.getElementById('searchInput').value;

    // Simulated results fetching (You can replace this with actual API call)
    const waves = [
        'Great waves at XYZ Beach',
        'Surfable conditions at ABC Cove',
        'Perfect swell at 123 Point'
    ];

    const flights = [
        'Flight to XYZ - $150',
        'Flight to ABC - $200',
        'Flight to 123 - $180'
    ];

    // Display wave results
    waves.forEach(wave => {
        const li = document.createElement('li');
        li.textContent = wave;
        waveResults.appendChild(li);
    });

    // Display flight results
    flights.forEach(flight => {
        const li = document.createElement('li');
        li.textContent = flight;
        flightResults.appendChild(li);
    });
}

// Adding event listener to the search form
document.getElementById('searchForm').addEventListener('submit', handleSearch);

// Sample HTML elements (Ensure these elements exist in your HTML)
// <form id='searchForm'>
//     <input type='text' id='searchInput' placeholder='Search for waves...'/>
//     <button type='submit'>Search</button>
// </form>
// <ul id='waveResults'></ul>
// <ul id='flightResults'></ul>