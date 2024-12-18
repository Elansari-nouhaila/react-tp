import React, { useState,useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import axios from "axios";
import FiveDays from "./Partials/FiveDays";

function App() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const toDateFunction = () => {
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const WeekDays = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };
  const [favoriteCities, setFavoriteCities] = useState([]);
    const [city, setCity] = useState('');

    useEffect(() => {
        const storedFavoriteCities = localStorage.getItem('favoriteCities');
        if (storedFavoriteCities) {
            setFavoriteCities(JSON.parse(storedFavoriteCities));
        }
    }, []);

    const handleAddFavoriteCity = () => {
        const newFavoriteCities = [...favoriteCities, city];
        setFavoriteCities(newFavoriteCities);
        localStorage.setItem('favoriteCities', JSON.stringify(newFavoriteCities));
    };

    const handleRemoveFavoriteCity = (cityToRemove) => {
        const newFavoriteCities = favoriteCities.filter((city) => city !== cityToRemove);
        setFavoriteCities(newFavoriteCities);
        localStorage.setItem('favoriteCities', JSON.stringify(newFavoriteCities));
    };

  const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInput("");
      setWeather({ ...weather, loading: true });
      const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
      const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
      const api_key = "f00c38e0279b7bc85480c3fe775d518c";

      try {
        // Récupérer les données actuelles
        const currentWeatherResponse = await axios.get(currentWeatherUrl, {
          params: {
            q: input,
            units: "metric",
            appid: api_key,
          },
        });

        setWeather({
          data: currentWeatherResponse.data,
          loading: false,
          error: false,
        });


      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
        setInput("");
      }
    }
  };

  return (
    <div className="">
      <h1 className=" ">Application Météo grp204</h1>
      {/* <div > */}
      <input
        type="text"
        placeholder="Entrez le nom de la ville..."
        value={input}
        className=""
        onChange={(event) => setInput(event.target.value)}
        onKeyPress={search}
      />
      <button onClick={handleAddFavoriteCity}>
        Add to favorite
      </button>
      <ul>
                {favoriteCities.map((city, index) => (
                    <li key={index}>
                        {city}
                        <button onClick={() => handleRemoveFavoriteCity(city)}>Remove</button>
                    </li>
                ))}
            </ul>
      {/* </div> */}

      {weather.loading && (
        <>
          <Oval type="Oval" color="black" height={100} width={100} />
        </>
      )}

      {weather.error && (
        <>
          <span>
            <FontAwesomeIcon icon={faFrown} />
            <span>Ville introuvable</span>
          </span>
        </>
      )}

      {weather.data.main && (
        <div className="">
          <h2 className="">
            {weather.data.name}, <span className="">{weather.data.sys.country}</span>
          </h2>
          <span className="">{toDateFunction()}</span>
          <div className="">
            <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} alt={weather.data.weather[0].description} />
            <p>{Math.round(weather.data.main.temp)}°C</p>
            <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
          </div>
        </div>
      )}

      {/* Affichage des prévisions */}
      <FiveDays city={input} />
    </div>
  );
}

export default App





