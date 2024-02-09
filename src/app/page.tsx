"use client";

import axios from "axios";
import Navbar from "../components/Navbar";
import { useQuery } from "react-query";
import { compareAsc, format } from "date-fns";
import { parseISO } from "date-fns/parseISO";
import Container from "@/components/Container";
import kelvinToCelciusConverter from "@/utils/kelvinToCelciusConverter";
import WeatherIcon from "@/components/WeatherIcon";
import ForecastDetails from "@/components/ForecastDetails";
import { WiCloudyGusts } from "react-icons/wi";


//https://api.openweathermap.org/data/2.5/forecast?q=london&appid=f5db868ac34a3272f8f044a223476065

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );
  console.log(process.env.NEXT_PUBLIC_WEATHER_KEY);
  const todayData = data?.list[0];

  console.log("data", data?.list[0], todayData);
  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex-col gap-9 w-full pb-10 pt-4">
        {/* Todays weather */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(todayData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-sm">
                (
                {format(parseISO(todayData?.dt_txt ?? ""), "dd-MM-yyyy h:mm a")}
                )
              </p>
            </h2>
            <div>
              <Container className="gap-10 px-6 items-center">
                <div className="text-center text-5xl flex flex-col px-4">
                  <span>
                    {kelvinToCelciusConverter(todayData?.main.temp ?? 0)}°
                  </span>
                  <p className="text-xs whitespace-nowrap">
                    <span>Feels like </span>
                    <span>
                      {kelvinToCelciusConverter(
                        todayData?.main.feels_like ?? 0
                      )}
                      °
                    </span>
                    <p className="text-xs">
                      <span>
                        {kelvinToCelciusConverter(
                          todayData?.main.temp_min ?? 0
                        )}
                        °↓
                      </span>
                      <span>
                        {kelvinToCelciusConverter(
                          todayData?.main.temp_max ?? 0
                        )}
                        °↑
                      </span>
                    </p>
                  </p>
                </div>
                <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                  {data?.list.map((interval, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(interval.dt_txt), "h:mm a")}
                        </p>
                        <div>
                          <WeatherIcon iconName={interval.weather[0].icon} />
                        </div>
                        <p>{kelvinToCelciusConverter(interval.main.temp)}°</p>
                      </div>
                    );
                  })}
                </div>
              </Container>
              <div className="flex gap-4 my-4">
                <Container className="w-fit flex flex-col px-6 py-4 capitalize text-center">
                  <p>{todayData?.weather[0].description}</p>
                  <WeatherIcon iconName={todayData?.weather[0].icon} />
                </Container>
                <Container className="bg-yellow-300/80 justify-between px-6">
                  <ForecastDetails />
                </Container>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col gap-4">
          <h2 className="flex gap-1 text-2xl items-end">Forecast (7 days)</h2>
        </section>
      </main>
    </div>
  );
}
