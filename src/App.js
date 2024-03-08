import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WeatherForecast.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCloud, faCloudSun, faCloudMoon, faCloudRain, faBolt, faSnowflake, faSmog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const API_KEY = 'bc61bf5657b047f7a4bc553fc19c04c9';
const API_URL = 'https://api.openweathermap.org/data/2.5/';

function WeatherForecast() {
  const [city, setCity] = useState('Paris'); // State to store the city name
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    fetchWeatherData(city); // Initial call to function to load weather data
  }, [city]);

  const fetchWeatherData = (city) => {
    axios.get(`${API_URL}weather?q=${city}&appid=${API_KEY}&units=metric`)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error('Error fetching current weather data:', error);
      });

    axios.get(`${API_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`)
      .then(response => {
        // Group forecasts by day
        const dailyForecasts = groupForecastByDay(response.data.list);
        setForecastData(dailyForecasts);
      })
      .catch(error => {
        console.error('Error fetching forecast data:', error);
      });
  };

  const groupForecastByDay = (forecastList) => {
    const groupedForecasts = {};
    forecastList.forEach(forecast => {
      const date = new Date(forecast.dt * 1000);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!groupedForecasts[dayOfWeek]) {
        groupedForecasts[dayOfWeek] = [];
      }
      groupedForecasts[dayOfWeek].push(forecast);
    });

    // Calculate the maximum and minimum temperature for each day
    const dailyForecasts = Object.keys(groupedForecasts).map(dayOfWeek => {
      const forecastsForDay = groupedForecasts[dayOfWeek];
      const minTemp = Math.min(...forecastsForDay.map(forecast => forecast.main.temp_min));
      const maxTemp = Math.max(...forecastsForDay.map(forecast => forecast.main.temp_max));
      const iconCode = forecastsForDay[0].weather[0].icon;
      const description = forecastsForDay[0].weather[0].description;
      return {
        dt_txt: dayOfWeek,
        main: {
          temp_min: minTemp,
          temp_max: maxTemp
        },
        weather: [{
          icon: iconCode,
          description: description
        }]
      };
    });

    return dailyForecasts;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload when form is submitted
    fetchWeatherData(city); // Load weather data for the specified city
  };

  // Function to get weather icon based on icon code
  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d':
        return <FontAwesomeIcon icon={faSun} />;
      case '01n':
        return <FontAwesomeIcon icon={faMoon} />;
      case '02d':
        return <FontAwesomeIcon icon={faCloudSun} />;
      case '02n':
        return <FontAwesomeIcon icon={faCloudMoon} />;
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <FontAwesomeIcon icon={faCloud} />;
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <FontAwesomeIcon icon={faCloudRain} />;
      case '11d':
      case '11n':
        return <FontAwesomeIcon icon={faBolt} />;
      case '13d':
      case '13n':
        return <FontAwesomeIcon icon={faSnowflake} />;
      case '50d':
      case '50n':
        return <FontAwesomeIcon icon={faSmog} />;
      default:
        return <FontAwesomeIcon icon={faQuestionCircle} />;
    }
  };

  return (
    <div className="container mt-5">
      <div className="weather-forecast-container" style={{ backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Enter city name" value={city} onChange={(e) => setCity(e.target.value)} />
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </form>

        {weatherData && (
          <div>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>{weatherData.name}</h2>
            <div className="d-flex align-items-center" style={{ marginBottom: '10px' }}>
              <div>{getWeatherIcon(weatherData.weather[0].icon)}</div>
              <div style={{ color: '#333', fontSize: '18px', marginLeft: '10px' }}>Temperature: {weatherData.main.temp}°C</div>
              <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>{weatherData.weather[0].description}</div>
            </div>
          </div>
        )}

        {forecastData.length > 0 && (
          <div>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Weather Forecast for the Week</h2>
            <ul>
              {forecastData.map((forecast, index) => (
                <li key={index}>
                  <div style={{ color: '#333', fontWeight: 'bold', marginBottom: '5px' }}>{forecast.dt_txt}</div>
                  <div className="d-flex align-items-center" style={{ marginBottom: '5px' }}>
                    <div>{getWeatherIcon(forecast.weather[0].icon)}</div>
                    <div style={{ color: '#333', fontSize: '18px', marginLeft: '10px' }}>Min Temperature: {forecast.main.temp_min}°C</div>
                    <div style={{ color: '#333', fontSize: '18px', marginLeft: '10px' }}>Max Temperature: {forecast.main.temp_max}°C</div>
                    <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>{forecast.weather[0].description}</div>
                  </div>
                  {index < forecastData.length - 1 && <hr style={{ margin: '5px 0' }} />} {/* Line between each day */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherForecast;

























