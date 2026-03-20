# API Documentation

## API Endpoints

### 1. /api/waves
#### Description:
Fetches wave data for a specified location.

#### Request:
- **Method:** GET  
- **Query parameters:**  
  - `location`: The location for which to fetch wave data (e.g., `Hawaii`, `California`).

#### Response:
- **Status Code:** 200 OK  
- **Body:**
```json
{
    "location": "Hawaii",
    "waves": [
        {
            "height": "1.5m",
            "period": "12s",
            "type": "left"
        },
        {
            "height": "2.0m",
            "period": "15s",
            "type": "right"
        }
    ]
}
```

---

### 2. /api/flights
#### Description:
Fetches available flights to a specified destination.

#### Request:
- **Method:** GET  
- **Query parameters:**  
  - `destination`: The destination for the flights (e.g., `Hawaii`, `California`).
  - `date`: The travel date (e.g., `2026-03-25`).

#### Response:
- **Status Code:** 200 OK  
- **Body:**
```json
{
    "destination": "Hawaii",
    "flights": [
        {
            "flight_number": "AA123",
            "departure": "2026-03-25T10:00:00Z",
            "arrival": "2026-03-25T14:00:00Z",
            "price": 300
        },
        {
            "flight_number": "DL456",
            "departure": "2026-03-25T12:00:00Z",
            "arrival": "2026-03-25T16:00:00Z",
            "price": 350
        }
    ]
}
```

---

### 3. /api/recommendations
#### Description:
Provides recommendations for surf spots based on wave data.

#### Request:
- **Method:** POST  
- **Body:**
```json
{
    "location": "Hawaii",
    "skill_level": "intermediate"
}
```

#### Response:
- **Status Code:** 200 OK  
- **Body:**
```json
{
    "recommendations": [
        {
            "spot": "Waikiki Beach",
            "description": "Great for intermediate surfers with consistent waves."
        },
        {
            "spot": "Waimea Bay",
            "description": "Famous big wave surf spot."
        }
    ]
}
```

---

## Conclusion
This documentation provides a brief overview of the available API endpoints for the Surf Trip Planner application. For more detailed information, refer to the respective endpoint documentation.