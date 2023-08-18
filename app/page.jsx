'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { RxMagnifyingGlass } from 'react-icons/rx';
import { BsFillSunriseFill, BsFillSunsetFill, BsFillDropletFill } from 'react-icons/bs';
import { RiFahrenheitFill, RiCelsiusFill } from 'react-icons/ri';
import {
  WiMoonAltWaningGibbous3,
  WiMoonAltThirdQuarter,
  WiMoonAltWaningCrescent3,
  WiMoonAltNew,
  WiMoonAltWaxingCrescent3,
  WiMoonAltFirstQuarter,
  WiMoonAltWaxingGibbous3,
  WiMoonAltFull,
} from 'react-icons/wi';
import Image from 'next/image';
import CustomTooltip from './components/CustomTooltip';
import RainJauge from './components/RainJauge';
import './assets/css/style.css';

export default function Home() {
  let timeoutError = null;
  const [showComponents, setShowComponents] = useState(false);
  const [metaTheme, setMetaTheme] = useState('#1c95ec');
  const [mainImg, setMainImg] = useState(null);
  const [ville, setVille] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [description, setDescription] = useState(null);
  const [ressenti, setRessenti] = useState(null);
  const [humidite, setHumidite] = useState(null);
  const [vent, setVent] = useState(null);
  const [ventDirection, setVentDirection] = useState(0);
  const [pression, setPression] = useState(null);
  const [lever, setLever] = useState(null);
  const [coucher, setCoucher] = useState(null);
  const [airPollution, setAirPollution] = useState(null);
  const [minutelyData, setMinutelyData] = useState([]);
  const [uv, setUv] = useState(null);
  const [latitudeVille, setLatitudeVille] = useState(null);
  const [longitudeVille, setLongitudeVille] = useState(null);
  const [mapURL, setMapURL] = useState(null);
  const [moonPhase, setMoonPhase] = useState(null);
  const [dataChart1, setDataChart1] = useState(null);
  const [dataChart2, setDataChart2] = useState(null);
  const [heure, setHeure] = useState(null);
  const [jours, setJours] = useState(Array(7).fill(null));
  const [tempMinJours, setTempMinJours] = useState(Array(7).fill(null));
  const [tempMaxJours, setTempMaxJours] = useState(Array(7).fill(null));
  const [precipitationJours, setPrecipitationJours] = useState(Array(7).fill(null));
  const [imgJours, setImgJours] = useState(Array(7).fill(null));
  const [thunderMessage, setThunderMessage] = useState(false);
  const [heatMessage, setHeatMessage] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const metaThemeColor = document.querySelectorAll('.themecolor');
    if (metaThemeColor) {
      metaThemeColor.forEach((meta) => meta.setAttribute('content', metaTheme));
    }
    if (typeof window !== 'undefined') {
      const savedVille = localStorage.getItem('ville');
      setVille(savedVille || '');
    }
    if ('serviceWorker' in navigator) {
      (async () => {
        await navigator.serviceWorker.register('/sw.js');
      })();
    }
  }, [metaTheme]);

  const showError = (message) => {
    if (timeoutError) clearTimeout(timeoutError);
    const notification = document.querySelector('#error-notification');
    setError(message);
    notification.style.display = 'block';
    timeoutError = setTimeout(() => {
      notification.style.display = 'none';
    }, 5000);
  };

  const getImage = (id, sunDown, sunUp, time, main) => {
    let imgSrc = '';
    let backgroundColor = '';

    if ((id >= 200 && id <= 202) || (id >= 230 && id <= 232)) {
      imgSrc = '/assets/icons/storm.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#19242b';
          setMetaTheme('#19242b');
        } else {
          backgroundColor = '#281e33';
          setMetaTheme('#281e33');
        }
      }
    } else if (id >= 210 && id <= 221) {
      imgSrc = '/assets/icons/thunder.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#202d36';
          setMetaTheme('#202d36');
        } else {
          backgroundColor = '#2f1f3f';
          setMetaTheme('#2f1f3f');
        }
      }
    } else if (id >= 300 && id <= 321) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/drizzle.png';
        if (main) {
          backgroundColor = '#425b6b';
          setMetaTheme('#425b6b');
        }
      } else {
        imgSrc = '/assets/icons/drizzleNight.png';
        if (main) {
          backgroundColor = '#543973';
          setMetaTheme('#543973');
        }
      }
    } else if (id === 500) {
      imgSrc = '/assets/icons/rain.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#3d5669';
          setMetaTheme('#3d5669');
        } else {
          backgroundColor = '#412e57';
          setMetaTheme('#412e57');
        }
      }
    } else if ((id >= 501 && id <= 504) || (id >= 520 && id <= 531)) {
      imgSrc = '/assets/icons/shower.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#2c3c47';
          setMetaTheme('#2c3c47');
        } else {
          backgroundColor = '#312440';
          setMetaTheme('#312440');
        }
      }
    } else if (id === 511) {
      imgSrc = '/assets/icons/hail.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#879eb0';
          setMetaTheme('#879eb0');
        } else {
          backgroundColor = '#5a4c6b';
          setMetaTheme('#5a4c6b');
        }
      }
    } else if (id === 600) {
      imgSrc = '/assets/icons/snow.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#879eb0';
          setMetaTheme('#879eb0');
        } else {
          backgroundColor = '#77668a';
          setMetaTheme('#77668a');
        }
      }
    } else if ((id === 601 || id === 602) || (id >= 620 && id <= 622)) {
      imgSrc = '/assets/icons/blizzard.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#657682';
          setMetaTheme('#657682');
        } else {
          backgroundColor = '#857a91';
          setMetaTheme('#857a91');
        }
      }
    } else if (id >= 611 && id <= 616) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/sleet.png';
        if (main) {
          backgroundColor = '#2c3c47';
          setMetaTheme('#2c3c47');
        }
      } else {
        imgSrc = '/assets/icons/sleetNight.png';
        if (main) {
          backgroundColor = '#462c63';
          setMetaTheme('#462c63');
        }
      }
    } else if (id >= 701 && id <= 721) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/haze.png';
        if (main) {
          backgroundColor = '#38aafc';
          setMetaTheme('#38aafc');
        }
      } else {
        imgSrc = '/assets/icons/hazeNight.png';
        if (main) {
          backgroundColor = '#895abf';
          setMetaTheme('#895abf');
        }
      }
    } else if (id === 731 || (id >= 751 && id <= 771)) {
      imgSrc = '/assets/icons/dust.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#38aafc';
          setMetaTheme('#38aafc');
        } else {
          backgroundColor = '#895abf';
          setMetaTheme('#895abf');
        }
      }
    } else if (id === 741) {
      imgSrc = '/assets/icons/fog.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#38aafc';
          setMetaTheme('#38aafc');
        } else {
          backgroundColor = '#895abf';
          setMetaTheme('#895abf');
        }
      }
    } else if (id === 781) {
      imgSrc = '/assets/icons/tornado.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#2c3c47';
          setMetaTheme('#2c3c47');
        } else {
          backgroundColor = '#462c63';
          setMetaTheme('#462c63');
        }
      }
    } else if (id === 800) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/sun.png';
      } else {
        imgSrc = '/assets/icons/moon.png';
        if (main) {
          backgroundColor = '#723ead';
          setMetaTheme('#723ead');
        }
      }
    } else if (id === 801 || id === 802) {
      if (time >= sunUp && time < sunDown) {
        imgSrc = '/assets/icons/fewclouds.png';
        if (main) {
          backgroundColor = '#5080a3';
          setMetaTheme('#5080a3');
        }
      } else {
        imgSrc = '/assets/icons/fewcloudsNight.png';
        if (main) {
          backgroundColor = '#5a308a';
          setMetaTheme('#5a308a');
        }
      }
    } else {
      imgSrc = '/assets/icons/clouds.png';
      if (main) {
        if (time >= sunUp && time < sunDown) {
          backgroundColor = '#496c85';
          setMetaTheme('#496c85');
        } else {
          backgroundColor = '#4a2d6b';
          setMetaTheme('#4a2d6b');
        }
      }
    }
    return { imgSrc, backgroundColor };
  };

  const fetchDataAirPollution = async (data) => {
    let aqi = data;
    if (aqi === 1) {
      aqi = `${aqi} - Excellent`;
    } else if (aqi === 2) {
      aqi = `${aqi} - Bon`;
    } else if (aqi === 3) {
      aqi = `${aqi} - Moyen`;
    } else if (aqi === 4) {
      aqi = `${aqi} - Mauvais`;
    } else {
      aqi = `${aqi} - Très mauvais`;
    }
    setAirPollution(aqi);
  };

  const fetchDataMoon = async (data) => {
    let phase = data;
    if (phase > 0 && phase < 0.25) {
      phase = <WiMoonAltWaningGibbous3 />;
    } else if (phase === 0.25) {
      phase = <WiMoonAltThirdQuarter />;
    } else if (phase > 0.25 && phase < 0.5) {
      phase = <WiMoonAltWaningCrescent3 />;
    } else if (phase === 0.5) {
      phase = <WiMoonAltNew />;
    } else if (phase > 0.5 && phase < 0.75) {
      phase = <WiMoonAltWaxingCrescent3 />;
    } else if (phase === 0.75) {
      phase = <WiMoonAltFirstQuarter />;
    } else if (phase > 0.75 && phase < 1) {
      phase = <WiMoonAltWaxingGibbous3 />;
    } else {
      phase = <WiMoonAltFull />;
    }
    setMoonPhase(phase);
  };

  const fetchDataForecasts = async (data, sunDown, sunUp) => {
    const { minutely, hourly, daily } = data;
    const currentDateTime = new Date();
    const currentDay = currentDateTime.toLocaleDateString('fr-FR', { timeZone: data.timezone });
    const nextDay = new Date(currentDateTime.getTime() + 24 * 60 * 60 * 1000);
    const nextDayFormatted = nextDay.toLocaleDateString('fr-FR', { timeZone: data.timezone });
    const createChartData = (items, filterFn) => items
      .filter(filterFn)
      .map((item) => {
        const forecastDateTime = new Date(item.dt * 1000);
        const forecastTime = forecastDateTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: data.timezone,
        });
        return {
          name: forecastTime,
          temp: item.temp,
          humidity: item.humidity,
          pressure: item.pressure,
          wind: item.wind_speed,
          windDeg: item.wind_deg,
          weather: item.weather[0].id,
          precipitation: item.rain ? item.rain['1h'] : 0,
          rain: (item.pop * 100) || 0,
          uv: item.uvi,
          sunDownH: sunDown,
          sunUpH: sunUp,
        };
      });

    let chartData1 = createChartData(hourly, (item) => {
      const forecastDateTime = new Date(item.dt * 1000);
      const forecastDay = forecastDateTime.toLocaleDateString('fr-FR', { timeZone: data.timezone });
      return forecastDay === currentDay;
    }).slice(1);

    if (chartData1.length > 12) {
      chartData1 = chartData1.filter((item, index) => index % 2 === 0);
    }

    const chartData2 = createChartData(hourly, (item, index) => {
      const forecastDateTime = new Date(item.dt * 1000);
      const forecastDay = forecastDateTime.toLocaleDateString('fr-FR', { timeZone: data.timezone });
      return forecastDay === nextDayFormatted && index % 2 === 0;
    });

    const forecastsDaily = daily.slice(2);
    const temperaturesDailyMax = forecastsDaily.map((forecast) => Math.floor(forecast.temp.max));
    const temperaturesDailyMin = forecastsDaily.map((forecast) => Math.floor(forecast.temp.min));
    const precipitationDaily = forecastsDaily.map((forecast) => (forecast.pop * 100).toFixed(0));
    const weatherIdsDaily = forecastsDaily.map((forecast) => forecast.weather[0].id);
    const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
    const dates = forecastsDaily.map((forecast) => new Date(forecast.dt * 1000));
    const daysOfWeek = dates.map((date) => days[date.getDay()]);

    for (let i = 0; i < 7; i += 1) {
      setJours((prevJour) => [
        ...prevJour.slice(0, i),
        daysOfWeek[i],
        ...prevJour.slice(i + 1),
      ]);

      setPrecipitationJours((prevPrecipitation) => [
        ...prevPrecipitation.slice(0, i),
        `${precipitationDaily[i]}%`,
        ...prevPrecipitation.slice(i + 1),
      ]);

      setTempMinJours((prevTempMin) => [
        ...prevTempMin.slice(0, i),
        `${temperaturesDailyMin[i]}°C`,
        ...prevTempMin.slice(i + 1),
      ]);

      setTempMaxJours((prevTempMax) => [
        ...prevTempMax.slice(0, i),
        `${temperaturesDailyMax[i]}°C`,
        ...prevTempMax.slice(i + 1),
      ]);

      setImgJours((prevImg) => [
        ...prevImg.slice(0, i),
        getImage(weatherIdsDaily[i], '1', '0', '0', false).imgSrc,
        ...prevImg.slice(i + 1),
      ]);
    }

    setDataChart1(chartData1);
    setDataChart2(chartData2);
    setMinutelyData(minutely);
  };

  const fetchDataCurrent = async (city, data, data2) => {
    const { current, alerts, timezone_offset: timezoneOffset } = data;
    const weatherId = current.weather[0].id;
    const ventDeg = current.wind_deg || 0;
    const date = new Date();
    const timezoneOffsetMinutes = timezoneOffset / 60;
    const timezoneOffsetHours = timezoneOffset / 3600;
    const utcDate = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );
    const localDate = new Date(utcDate.getTime() + (timezoneOffsetHours * 60 * 60 * 1000));
    const heureLocale = localDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const sunriseUTC = new Date(current.sunrise * 1000 || 0);
    const sunsetUTC = new Date(current.sunset * 1000 || 0);
    const offsetMilliseconds = (date.getTimezoneOffset() + timezoneOffsetMinutes) * 60 * 1000;
    const sunriseLocal = new Date(sunriseUTC.getTime() + offsetMilliseconds);
    const sunsetLocal = new Date(sunsetUTC.getTime() + offsetMilliseconds);
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const sunUp = sunriseLocal.toLocaleTimeString('fr-FR', timeOptions);
    const sunDown = sunsetLocal.toLocaleTimeString('fr-FR', timeOptions);
    const name = city;
    const result = getImage(weatherId, sunDown, sunUp, heureLocale, true);
    const { imgSrc, backgroundColor } = result;

    setLever(sunUp);
    setCoucher(sunDown);
    setHeure(heureLocale);
    setVille(name);
    setTemperature(`${current.temp.toFixed(1)}°C`);
    setDescription(current.weather[0].description);
    setRessenti(`${current.feels_like.toFixed(0)}°C`);
    setHumidite(`${current.humidity}%`);
    setVent(`${(3.6 * current.wind_speed).toFixed(0)}km/h`);
    setVentDirection(ventDeg + 180);
    setPression(`${current.pressure}hPa`);
    setUv(current.uvi.toFixed(0));
    setLatitudeVille(data.lat);
    setLongitudeVille(data.lon);
    setMapURL(`https://www.openstreetmap.org/export/embed.html?bbox=${data.lon - 0.1}%2C${data.lat - 0.1}%2C${data.lon + 0.1}%2C${data.lat + 0.1}&amp;layer=mapnik`);
    setMainImg(<Image
      src={imgSrc}
      className="mainImg"
      alt={current.weather[0].description}
      width={96}
      height={90}
    />);

    if (alerts) {
      if (alerts.some((alert) => alert.event.includes('thunder'))) {
        setThunderMessage('VIGILANCE - ORAGES');
      }
      if (alerts.some((alert) => alert.event.includes('high-temperature', 'heat'))) {
        setHeatMessage('VIGILANCE - FORTES CHALEURS');
      }
    }

    document.body.style.background = backgroundColor;
    localStorage.setItem('ville', name);

    await fetchDataMoon(data.daily[0].moon_phase);
    await fetchDataAirPollution(data2.list[0].main.aqi);
    await fetchDataForecasts(data, sunDown, sunUp);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    document.querySelector('.info-txt').style.display = 'block';
    if (ville === '' || /^[0-9]+$/.test(ville)) {
      showError('Veuillez saisir une ville valide...');
      document.querySelector('.info-txt').style.display = 'none';
      return;
    }
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ville,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      const { city, oneCallData, airPollutionData } = data;
      await fetchDataCurrent(city, oneCallData, airPollutionData);
      setShowComponents(true);
    } else {
      showError('Un problème est survenu, saisissez le nom complet de la ville...');
    }
    document.querySelector('.info-txt').style.display = 'none';
  };

  const geolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        document.querySelector('.info-txt').style.display = 'block';
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        const response = await fetch('/api/geolocation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude, longitude,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          const { city, oneCallData, airPollutionData } = data;
          await fetchDataCurrent(city, oneCallData, airPollutionData);
          setShowComponents(true);
        } else {
          showError('Un problème est survenu lors de la géolocalisation...');
        }
        document.querySelector('.info-txt').style.display = 'none';
      }, () => {
        showError('Veuillez activer la géolocalisation de votre appareil pour ce site...');
      });
    } else {
      showError('Votre navigateur ne supporte pas la géolocalisation...');
    }
  };

  const handleReturn = () => {
    setShowComponents(false);
    document.body.style.background = '#1c95ec';
    setMetaTheme('#1c95ec');
    setVille(localStorage.getItem('ville'));
  };

  const handleUnity = () => {
    if (temperature.endsWith('C')) {
      setTemperature(`${(temperature.slice(0, -2) * 1.8 + 32).toFixed(1)}°F`);
      setRessenti(`${(ressenti.slice(0, -2) * 1.8 + 32).toFixed(0)}°F`);
      setVent(`${(vent.slice(0, -4) / 1.609).toFixed(0)}mph`);
      setTempMinJours(tempMinJours.map((temp) => `${(parseInt(temp.slice(0, -2), 10) * 1.8 + 32).toFixed(0)}°F`));
      setTempMaxJours(tempMaxJours.map((temp) => `${(parseInt(temp.slice(0, -2), 10) * 1.8 + 32).toFixed(0)}°F`));
      setDataChart1(dataChart1.map((item) => ({
        ...item,
        temp: item.temp * 1.8 + 32,
        wind: item.wind / 1.609,
      })));
      setDataChart2(dataChart2.map((item) => ({
        ...item,
        temp: item.temp * 1.8 + 32,
        wind: item.wind / 1.609,
      })));
    } else {
      setTemperature(`${((temperature.slice(0, -2) - 32) / 1.8).toFixed(1)}°C`);
      setRessenti(`${((ressenti.slice(0, -2) - 32) / 1.8).toFixed(0)}°C`);
      setVent(`${(vent.slice(0, -3) * 1.609).toFixed(0)}km/h`);
      setTempMinJours(tempMinJours.map((temp) => `${((parseInt(temp.slice(0, -2), 10) - 32) / 1.8).toFixed(0)}°C`));
      setTempMaxJours(tempMaxJours.map((temp) => `${((parseInt(temp.slice(0, -2), 10) - 32) / 1.8).toFixed(0)}°C`));
      setDataChart1(dataChart1.map((item) => ({
        ...item,
        temp: (item.temp - 32) / 1.8,
        wind: item.wind * 1.609,
      })));
      setDataChart2(dataChart2.map((item) => ({
        ...item,
        temp: (item.temp - 32) / 1.8,
        wind: item.wind * 1.609,
      })));
    }
  };

  return (
    <div className="wrapper">
      <header>
        {showComponents ? (
          <>
            <span id="heure">
              {heure}
              {' '}
              {localStorage.getItem('ville')}
            </span>
            <button
              type="button"
              aria-label="Changer d'unité"
              onClick={handleUnity}
            >
              {temperature.endsWith('C') ? <RiFahrenheitFill color="white" size="25px" /> : <RiCelsiusFill color="white" size="25px" />}
            </button>
            <button
              type="button"
              aria-label="Retour"
              onClick={handleReturn}
            >
              <RxMagnifyingGlass color="white" size="25px" />
            </button>
          </>
        ) : (
          <h1>Météo</h1>
        )}
        <div id="error-notification">{error}</div>
      </header>
      <main>
        {!showComponents && (
        <form onSubmit={handleSubmit}>
          <div className="input-part">
            <p className="info-txt">Chargement...</p>
            <input
              type="text"
              placeholder="Paris, FR"
              maxLength="50"
              aria-label="Rechercher"
              id="ville"
              value={ville}
              onChange={(event) => setVille(event.target.value)}
              aria-required="true"
              required
            />
            <button type="submit">
              Rechercher
            </button>
            <div className="separator" />
            <button type="button" onClick={geolocation}>
              Localisation actuelle
            </button>
          </div>
        </form>
        )}
        {showComponents && (
        <>
          {thunderMessage.length > 0 && (
          <div className="alerts-thunder-part">
            <span>{thunderMessage}</span>
          </div>
          )}
          {heatMessage.length > 0 && (
          <div className="alerts-heat-part">
            <span>{heatMessage}</span>
          </div>
          )}
          <section className="current-part">
            <div className="main-info">
              <div className="temp">
                {mainImg}
              </div>
              <div className="temp">
                <span className="main-temp">{temperature}</span>
                <span className="line">{description}</span>
                <span className="line">
                  ressenti
                  {' '}
                  {ressenti}
                </span>
                <span className="line">
                  UV
                  {' '}
                  {uv}
                </span>
              </div>
            </div>
            <div className="details">
              <div className="column">
                <div className="detail">
                  <span>{humidite}</span>
                  <p>Humidité</p>
                </div>
              </div>
              <div className="column">
                <div className="detail">
                  <span>
                    <svg width="18" height="18" viewBox="0 0 50 50">
                      <path d="M25 5 L40 45 L25 35 L10 45 Z" fill="currentColor" transform={`rotate(${ventDirection}, 25, 25)`} />
                    </svg>
                    {vent}
                  </span>
                  <p>Vent</p>
                </div>
              </div>
              <div className="column">
                <div className="detail">
                  <span>{pression}</span>
                  <p>Pression</p>
                </div>
              </div>
            </div>
          </section>
          <RainJauge minutely={minutelyData} />
          <section className="chart-part">
            <div className="graphique">
              {dataChart1.length > 0 && (
              <>
                <p className="sous-titre">Ajourd&#39;hui</p>
                <ResponsiveContainer width="100%" height={100} style={{ margin: 'auto', overflowX: 'auto' }}>
                  <LineChart
                    margin={{
                      top: 5, left: 5, right: 5, bottom: -24,
                    }}
                    data={dataChart1}
                  >
                    <XAxis axisLine={false} tick={false} dataKey="name" />
                    <YAxis yAxisId="temperature" domain={['dataMin', 'dataMax']} width={0} />
                    <YAxis yAxisId="precipitation" width={0} />
                    <Tooltip
                      content={(
                        <CustomTooltip getImage={getImage} temperature={temperature} />
                      )}
                      wrapperStyle={{ zIndex: '999' }}
                    />
                    <Line
                      dataKey="temp"
                      stroke="rgba(255,255,255,.7)"
                      strokeWidth="2"
                      dot={{ r: 4 }}
                      yAxisId="temperature"
                    />
                    <Line
                      dataKey="precipitation"
                      stroke="rgba(57,196,243,.7)"
                      strokeWidth="2"
                      dot={{ r: 4 }}
                      yAxisId="precipitation"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="images-chart1">
                  {dataChart1.map((item) => (
                    <Image
                      src={
                        getImage(item.weather, item.sunDownH, item.sunUpH, item.name, false).imgSrc
                      }
                      alt=""
                      width={16}
                      height={15}
                      key={item.name}
                    />
                  ))}
                </div>
              </>
              )}
            </div>
            <div className="graphique">
              <p className="sous-titre">Demain</p>
              <ResponsiveContainer width="100%" height={100} style={{ margin: 'auto' }}>
                <LineChart
                  margin={{
                    top: 5, left: 5, right: 5, bottom: -24,
                  }}
                  data={dataChart2}
                >
                  <XAxis axisLine={false} tick={false} dataKey="name" />
                  <YAxis yAxisId="temperature" domain={['dataMin', 'dataMax']} width={0} />
                  <YAxis yAxisId="precipitation" width={0} />
                  <Tooltip
                    content={(
                      <CustomTooltip getImage={getImage} temperature={temperature} />
                    )}
                    wrapperStyle={{ Index: '999' }}
                  />
                  <Line
                    dataKey="temp"
                    stroke="rgba(255,255,255,.7)"
                    strokeWidth="2"
                    dot={{ r: 4 }}
                    yAxisId="temperature"
                  />
                  <Line
                    dataKey="precipitation"
                    stroke="rgba(57,196,243,.7)"
                    strokeWidth="2"
                    dot={{ r: 4 }}
                    yAxisId="precipitation"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="images-chart2">
                {dataChart2.map((item) => (
                  <Image
                    src={
                      getImage(item.weather, item.sunDownH, item.sunUpH, item.name, false).imgSrc
                    }
                    alt=""
                    width={16}
                    height={15}
                    key={item.name}
                  />
                ))}
              </div>
            </div>
          </section>
          <section className="forecasts-part">
            <div className="details">
              <div className="column">
                <p>{jours[0]}</p>
                <Image src={imgJours[0]} alt="" width={48} height={45} />
                <div className="temp-min-max">
                  <span>
                    {tempMinJours[0]}
                    /
                    {tempMaxJours[0]}
                  </span>
                </div>
                <div>
                  <BsFillDropletFill />
                  <span>{precipitationJours[0]}</span>
                </div>
              </div>
              <div className="column">
                <p>{jours[1]}</p>
                <Image src={imgJours[1]} alt="" width={48} height={45} />
                <div className="temp-min-max">
                  <span>
                    {tempMinJours[1]}
                    /
                    {tempMaxJours[1]}
                  </span>
                </div>
                <div>
                  <BsFillDropletFill />
                  <span>{precipitationJours[1]}</span>
                </div>
              </div>
              <div className="column">
                <p>{jours[2]}</p>
                <Image src={imgJours[2]} alt="" width={48} height={45} />
                <div className="temp-min-max">
                  <span>
                    {tempMinJours[2]}
                    /
                    {tempMaxJours[2]}
                  </span>
                </div>
                <div>
                  <BsFillDropletFill />
                  <span>{precipitationJours[2]}</span>
                </div>
              </div>
              <div className="column">
                <p>{jours[3]}</p>
                <Image src={imgJours[3]} alt="" width={48} height={45} />
                <div className="temp-min-max">
                  <span>
                    {tempMinJours[3]}
                    /
                    {tempMaxJours[3]}
                  </span>
                </div>
                <div>
                  <BsFillDropletFill />
                  <span>{precipitationJours[3]}</span>
                </div>
              </div>
              <div className="column">
                <p>{jours[4]}</p>
                <Image src={imgJours[4]} alt="" width={48} height={45} />
                <div className="temp-min-max">
                  <span>
                    {tempMinJours[4]}
                    /
                    {tempMaxJours[4]}
                  </span>
                </div>
                <div>
                  <BsFillDropletFill />
                  <span>{precipitationJours[4]}</span>
                </div>
              </div>
              <div className="column">
                <p>{jours[5]}</p>
                <Image src={imgJours[5]} alt="" width={48} height={45} />
                <div className="temp-min-max">
                  <span>
                    {tempMinJours[5]}
                    /
                    {tempMaxJours[5]}
                  </span>
                </div>
                <div>
                  <BsFillDropletFill />
                  <span>{precipitationJours[5]}</span>
                </div>
              </div>
            </div>
            <section className="carte">
              <iframe
                title="Carte"
                width="95%"
                height="150"
                src={mapURL}
              />
            </section>
            <details>
              <summary>Plus d&#39;informations</summary>
              <div className="plus-info">
                <p>
                  Pollution de l&#39;air :
                  {' '}
                  {airPollution}
                </p>
                <p>
                  <BsFillSunriseFill />
                  {lever}
                  {' '}
                  <BsFillSunsetFill />
                  {coucher}
                </p>
                <p>
                  Phase de lune :
                  {' '}
                  {moonPhase}
                </p>
                <p>
                  Longitude :
                  {' '}
                  {longitudeVille}
                </p>
                <p>
                  Latitude :
                  {' '}
                  {latitudeVille}
                </p>
                <p>
                  Màj app :
                  {' '}
                  <a href="https://github.com/PouletEnSlip/Meteo" target="_blank" rel="noreferrer" aria-label="Vers GitHub">18/08/2023</a>
                </p>
              </div>
            </details>
          </section>
        </>
        )}
      </main>
      {!showComponents && (
        <footer>
          &copy;
          <a href="https://leoseguin.fr/" target="_blank" rel="noreferrer" aria-label="Vers leoseguin.fr">leoseguin.fr</a>
          {' '}
          -
          {' '}
          <a href="https://leoseguin.fr/mentionslegales" target="_blank" rel="noreferrer" aria-label="Vers mentions légales">Mentions légales</a>
        </footer>
      )}
    </div>
  );
}
