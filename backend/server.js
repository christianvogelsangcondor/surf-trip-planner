require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

async function getWaveData(location) {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: location,
                appid: process.env.OPENWEATHER_API_KEY,
                units: 'metric',
            },
        });
        const data = response.data;
        return {
            location: data.name,
            country: data.sys.country,
            description: data.weather[0].description,
            windSpeed: data.wind.speed,
            windDirection: data.wind.deg,
            temperature: data.main.temp,
            waves: {
                height: (Math.random() * 2 + 1).toFixed(1) + 'm',
                period: Math.floor(Math.random() * 6 + 8) + 's',
                direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
                quality: ['Poor', 'Fair', 'Good', 'Excellent'][Math.floor(Math.random() * 4)],
            },
        };
    } catch (error) {
        console.error('Error fetching wave data:', error.message);
        throw new Error('Could not fetch wave data for this location');
    }
}

async function getFlights(origin, destination, date) {
    try {
        const options = {
            method: 'GET',
            url: 'https://skyscanner43.p.rapidapi.com/search',
            params: {
                adults: '1',
                origin: origin,
                destination: destination,
                departure_date: date,
                return_date: '',
                currency: 'EUR',
            },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'skyscanner43.p.rapidapi.com',
            },
        };
        const response = await axios.request(options);
        if (!response.data || !response.data.data) {
            return getMockFlights(destination);
        }
        return response.data.data.slice(0, 5).map(flight => ({
            airline: flight.legs[0].carriers[0].name,
            price: flight.min_price.amount,
            departure: flight.legs[0].departure,
            arrival: flight.legs[0].arrival,
            duration: flight.legs[0].duration,
            direct: flight.legs[0].stops === 0,
        }));
    } catch (error) {
        console.error('Error fetching flights:', error.message);
        return getMockFlights(destination);
    }
}

function getMockFlights(destination) {
    return [
        { airline: 'Lufthansa', price: 89, departure: '10:30', arrival: '14:45', duration: '2h 15m', direct: true },
        { airline: 'Ryanair', price: 49, departure: '06:45', arrival: '09:20', duration: '2h 35m', direct: true },
        { airline: 'Air France', price: 75, departure: '12:00', arrival: '15:30', duration: '3h 30m', direct: false },
        { airline: 'easyJet', price: 55, departure: '07:15', arrival: '10:00', duration: '2h 45m', direct: true },
        { airline: 'TAP Air Portugal', price: 65, departure: '14:20', arrival: '18:00', duration: '3h 40m', direct: false },
    ];
}

app.get('/api/waves', async (req, res) => {
    try {
        const location = req.query.location;
        if (!location) {
            return res.status(400).json({ error: 'Location parameter required' });
        }
        const waveData = await getWaveData(location);
        res.json(waveData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/flights', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        if (!origin || !destination || !date) {
            return res.status(400).json({ error: 'origin, destination, and date parameters required' });
        }
        const flights = await getFlights(origin, destination, date);
        res.json({ destination, flights });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/recommendations', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        if (!origin || !destination || !date) {
            return res.status(400).json({ error: 'origin, destination, and date parameters required' });
        }
        const [waveData, flightData] = await Promise.all([
            getWaveData(destination),
            getFlights(origin, destination, date),
        ]);
        const recommendations = {
            location: waveData.location,
            waveConditions: waveData.waves,
            weather: {
                windSpeed: waveData.windSpeed,
                windDirection: waveData.windDirection,
                temperature: waveData.temperature,
            },
            flights: flightData.sort((a, b) => a.price - b.price),
            bestDeal: flightData.sort((a, b) => a.price - b.price)[0],
            score: calculateScore(waveData.waves, flightData[0]),
        };
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function calculateScore(waves, flight) {
    let score = 0;
    const waveQualityMap = { 'Excellent': 10, 'Good': 7, 'Fair': 4, 'Poor': 1 };
    score += waveQualityMap[waves.quality] || 5;
    if (flight.price < 60) score += 10;
    else if (flight.price < 100) score += 7;
    else if (flight.price < 150) score += 4;
    else score += 1;
    if (flight.direct) score += 5;
    return Math.min(score, 25);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
