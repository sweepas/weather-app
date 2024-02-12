"use client";

import axios from "axios";
import Navbar from "../components/Navbar";
import { useQuery } from "react-query";
import { compareAsc, format } from "date-fns";
import { parseISO } from "date-fns/parseISO";
import Container from "@/components/Container";
import kelvinToCelciusConverter from "@/utils/kelvinToCelciusConverter";
import dateStampToHours from "@/utils/dateStampToHours";
import mToKm from "@/utils/mToKm";
import WeatherIcon from "@/components/WeatherIcon";
import ForecastDetails from "@/components/ForecastDetails";
import { WiCloudyGusts } from "react-icons/wi";
import MainTemp from "@/components/MainTemp";
import DailyForecastComponent from "@/components/DailyForecastComponent";
import IndexPage from "@/components/IndexPage";
import { useAtom } from "jotai";
import { placeAtom, loadingLocationAtom } from "@/app/atom";
import { useEffect } from "react";

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
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingLocation, setLoadingLocation] = useAtom(loadingLocationAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );
  const todayData = data?.list[0];

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-blue-100 min-h-screen">
      <IndexPage />
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex-col gap-9 w-full pb-10 pt-4">
        {/* Todays weather */}
        {loadingLocation ? (
          <LoadingSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(todayData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-sm">
                    (
                    {format(
                      parseISO(todayData?.dt_txt ?? ""),
                      "dd-MM-yyyy h:mm a"
                    )}
                    )
                  </p>
                </h2>
                <div>
                  <Container className="gap-10 px-6 items-center bg-blue-300">
                    <MainTemp
                      temp={kelvinToCelciusConverter(todayData?.main.temp ?? 0)}
                      feelsTemp={kelvinToCelciusConverter(
                        todayData?.main.feels_like ?? 0
                      )}
                      minTemp={kelvinToCelciusConverter(
                        todayData?.main.temp_min ?? 0
                      )}
                      maxTemp={kelvinToCelciusConverter(
                        todayData?.main.temp_max ?? 0
                      )}
                    />
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
                              <WeatherIcon
                                iconName={interval.weather[0].icon}
                              />
                            </div>
                            <p>
                              {kelvinToCelciusConverter(interval.main.temp)}°
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </Container>
                  <div className="flex gap-4 my-4">
                    <Container className="w-fit flex flex-col px-6 py-4 capitalize text-center bg-blue-300">
                      <p>{todayData?.weather[0].description}</p>
                      <WeatherIcon
                        iconName={todayData?.weather[0].icon ?? ""}
                      />
                    </Container>
                    <Container className="bg-yellow-300/80 justify-between px-6 overflow-x-auto">
                      <ForecastDetails
                        visability={`${mToKm(todayData?.visibility ?? 0)} km`}
                        humidity={`${todayData?.main.humidity} %`}
                        windSpeed={`${todayData?.wind.speed} m/s`}
                        airPresure={`${todayData?.main.pressure} hPa`}
                        sunrise={`${dateStampToHours(data?.city.sunrise ?? 0)}`}
                        sunset={`${dateStampToHours(data?.city.sunset ?? 0)}`}
                      />
                    </Container>
                  </div>
                </div>
              </div>
            </section>
            <section className="w-full flex flex-col gap-4">
              <h2 className="flex gap-1 text-2xl items-end">
                Forecast (7 days)
              </h2>
              <div>
                {firstDataForEachDate.map((d, i) => {
                  return (
                    <DailyForecastComponent
                      key={i}
                      description={d?.weather[0].description ?? ""}
                      iconName={d?.weather[0].icon ?? "01d"}
                      date={format(parseISO(d?.dt_txt ?? ""), "dd/MM")}
                      dayOfTheWeek={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                      feelsTemp={kelvinToCelciusConverter(
                        d?.main.feels_like ?? 0
                      )}
                      temp={kelvinToCelciusConverter(d?.main.temp ?? 0)}
                      minTemp={kelvinToCelciusConverter(d?.main.temp_max ?? 0)}
                      maxTemp={kelvinToCelciusConverter(d?.main.temp_min ?? 0)}
                      airPresure={`${d?.main.pressure} hPa `}
                      humidity={`${d?.main.humidity}% `}
                      sunrise={dateStampToHours(
                        data?.city.sunrise ?? 1702517657
                      )}
                      sunset={dateStampToHours(data?.city.sunset ?? 1702517657)}
                      visability={`${mToKm(d?.visibility ?? 10000)} `}
                      windSpeed={`${d?.wind.speed ?? 1.64} `}
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
const LoadingSkeleton = () => {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
};
