import React from "react";
import { LuEye } from "react-icons/lu";
import { GiWindsock } from "react-icons/gi";
import { RiContrastDropFill } from "react-icons/ri";
import { BsSpeedometer } from "react-icons/bs";
import { LuSunrise } from "react-icons/lu";
import { LuSunset } from "react-icons/lu";

type Props = {};

export interface WeatherPropertyProps {
  visability: string;
  humidity: string;
  windSpeed: string;
  airPresure: string;
  sunrise: string;
  sunset: string;
}

export default function ForecastDetails(props: WeatherPropertyProps) {
  return (
    <>
      <ForecastItem
        icon={<LuEye />}
        info="Visability"
        value={props.visability}
      />
      <ForecastItem
        icon={<RiContrastDropFill />}
        info="Humidity"
        value={props.humidity}
      />
      <ForecastItem
        icon={<GiWindsock />}
        info="Wind Speed"
        value={props.windSpeed}
      />
      <ForecastItem
        icon={<BsSpeedometer />}
        info="Air Pressure"
        value={props.airPresure}
      />
      <ForecastItem icon={<LuSunrise />} info="Sunrise" value={props.sunrise} />
      <ForecastItem icon={<LuSunset />} info="Sunset" value={props.sunset} />
    </>
  );
}

export interface SingleWeatherPropertyProps {
  info: string;
  icon: React.ReactNode;
  value: string;
}

function ForecastItem(props: SingleWeatherPropertyProps) {
  return (
    <div className="flex flex-col justify-between items-center text-xs font-semibold text-black/80 px-4">
      <p className="whitespace-nowrap">{props.info}</p>
      <div className="text-3xl">{props.icon}</div>
      <p className="whitespace-nowrap">{props.value}</p>
    </div>
  );
}
