"use client"

import { useState } from "react"
import Image from 'next/image'

type Weather = {
  current: {
    condition: {
      text: string
      icon: string
    }
    cloud: number
    feelslike_c: number
    humidity: number
    is_day: number
    last_updated: string
    temp_c: number
    precip_mm: number
  }
  location: {
    country: string
    name: string
    region: string
  }
}

export default function Home() {
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error("Geolocation not supported");
    }
  }

  function success(position: GeolocationPosition) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    setLocation({ lat, lng });

    fetch(`http://api.weatherapi.com/v1/current.json?q=${lat},${lng}&key=668ea459c80a4a76a4f221902233107`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
      })
      .catch(error => console.error(error));
  }

  function error() {
    console.error("Unable to retrieve your location");
  }

  return (
    <div className="h-screen bg-gray-950 flex place-items-center">
      <div className="w-[720px] mx-auto">
        <div className="mt-4 bg-slate-800 shadow-2xl shadow-slate-500/5 rounded-3xl p-4 cursor-pointer hover:scale-105 transition duration-500">
          { !location ?
            <button 
              onClick={handleLocationClick}
              className="w-3/4 py-4 mx-auto bg-indigo-700 text-xl text-slate-200 font-semibold rounded-lg"
            >
              What am i feeling?
            </button>
          : null }
          {location && !weather ? <p>Loading weather data...</p> : null}
          {weather ? (
            <div>
              <Image 
                src={`https:${weather.current.condition.icon.replace(/64x64/, '128x128')}`}
                alt={weather.current.condition.text}
                className=""
                width={128}
                height={128}
              />
              <p>Location: {weather.location.name}</p>
              <p>Temperature: {weather.current.temp_c} °C</p>
              <p>Weather: {weather.current.condition.text}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
