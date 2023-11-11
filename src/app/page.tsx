"use client"

import { useState } from "react"
import Image from 'next/image'
import { FastAverageColor } from 'fast-average-color'

type Weather = {
   current: {
      condition: {
         code: number
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

//Partly cloudy | Clear | Sunny | Light rain | Patchy rain possible

export default function Home() {
   const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)
   const [weather, setWeather] = useState<Weather | null>(null)
   const [bgColor, setBgColor] = useState<string>('rgb(3, 7, 18)')
   const [imgCode, setImgCode] = useState<number>(1000)

   const fac = new FastAverageColor();

   function handleLocationClick() {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(success, error);
      } else {
         console.error("Geolocation not supported");
      }
   }

   function resetWeatherAndLocation() {
      setWeather(null)
      setLocation(null)
      setBgColor('rgb(3, 7, 18)')
   }

   function success(position: GeolocationPosition) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      setLocation({ lat, lng });

      fetch(`http://api.weatherapi.com/v1/current.json?q=${lat},${lng}&key=668ea459c80a4a76a4f221902233107`)
         .then(response => response.json())
         .then(data => {
            setWeather(data);
            updateBgColor((data as Weather).current.condition.code/*1006*/)
         })
         .catch(error => console.error(error));
   }

   function error() {
      console.error("Unable to retrieve your location");
   }

   function updateBgColor(code: number) {
      setImgCode(code)

      fac.getColorAsync(`/assets/${code}.jpg`).then(color => { setBgColor(color.rgba) })
         .catch(e => { console.log(e); });
   }

   return (
      <div className="h-screen flex place-items-center transition duration-500"
         style={{ backgroundColor: bgColor }}
      >
         <div className="w-[720px] mx-auto transition duration-500">
            <div id="card" className="mt-4 bg-slate-800 shadow-2xl p-1 shadow-slate-500/5 rounded-3xl cursor-pointer hover:scale-105 transition duration-500 bg-cover will-change-contents"
               style={{ backgroundImage: `url('assets/${imgCode}.jpg')` }}
            >
               <div className="h-full w-full overflow-clip bg-white/5 backdrop-blur-lg p-8 rounded-3xl flex flex-col items-center transition duration-500">
                  { !location ?
                     <button 
                        onClick={handleLocationClick}
                        className="w-full py-4 mx-auto bg-indigo-700 text-xl text-slate-200 font-semibold rounded-lg shadow-indigo-700/40 hover:shadow-indigo-700/50 shadow-md hover:shadow-xl transition duration-500"
                     >
                        What am i feeling?
                     </button>
                  : null }
                  {location && !weather ? <p>Loading weather data...</p> : null}
                  <div className="flex justify-between items-start w-full transition duration-500">
                     {weather ? (
                        <>
                           <Image 
                              src={`https:${weather.current.condition.icon.replace(/64x64/, '128x128')}`}
                              alt={weather.current.condition.text}
                              className=""
                              width={128}
                              height={128}
                           />
                           <div>
                              <p className="font-sans font-semibold text-[6rem]">{weather.current.temp_c} °C</p>
                              <p>Location: {weather.location.name}</p>
                              <p>Weather: {weather.current.condition.text}</p>
                           </div>
                        </>
                     ) : null}
                  </div>
                  {location && weather ? (
                     <a 
                        onClick={resetWeatherAndLocation}
                        className="mx-auto mt-12 text-xl pb-1 text-slate-200 font-semibold border-b-2 hover:border-b-4 border-emerald-500"
                     >
                        Discard feelings
                     </a>
                  ) : null}
               </div>
            
            </div>
         </div>
      </div>
   )
}
