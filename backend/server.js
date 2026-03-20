const mockWaves = [
    { id: 1, name: 'Perfect Wave', height: '6ft', type: 'reef', location: 'Hawaii' },
    { id: 2, name: 'Choppy Wave', height: '4ft', type: 'beach', location: 'California' }
];

const mockFlights = [
    { id: 1, airline: 'Delta', from: 'JFK', to: 'HNL', price: 500 },
    { id: 2, airline: 'United', from: 'LAX', to: 'OGG', price: 400 }
];

// Replace API calls with mock data
function getWaves() {
    return mockWaves;
}

function getFlights() {
    return mockFlights;
}

// Exporting mock data functions
module.exports = { getWaves, getFlights };