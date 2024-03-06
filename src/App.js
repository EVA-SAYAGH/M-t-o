import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './WeatherForecast.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faCloud, faCloudSun, faCloudMoon, faCloudRain, faCloudSunRain, faBolt, faSnowflake, faSmog, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const API_KEY = 'bc61bf5657b047f7a4bc553fc19c04c9';
const API_URL = 'https://api.openweathermap.org/data/2.5/';

function WeatherForecast() {
  const [city, setCity] = useState('Paris'); // État pour stocker le nom de la ville
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    fetchWeatherData(city); // Appel initial à la fonction pour charger les données météo
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
        const dailyForecasts = response.data.list.filter((forecast, index) => {
          return forecast.dt_txt.includes('12:00:00');
        });
        setForecastData(dailyForecasts);
      })
      .catch(error => {
        console.error('Error fetching forecast data:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
    fetchWeatherData(city); // Charge les données météo pour la ville spécifiée
  };

  // Fonction pour obtenir l'icône météo en fonction du code de l'icône
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
                    <div style={{ color: '#333', fontSize: '18px', marginLeft: '10px' }}>Temperature: {forecast.main.temp}°C</div>
                    <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>{forecast.weather[0].description}</div>
                  </div>
                  {index < forecastData.length - 1 && <hr style={{ margin: '5px 0' }} />} {/* Ligne entre chaque jour */}
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














