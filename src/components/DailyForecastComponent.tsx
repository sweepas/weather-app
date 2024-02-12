import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import MainTemp, { Temperatures } from "./MainTemp";
import ForecastDetails, { WeatherPropertyProps } from "./ForecastDetails";

export interface DailyForecastDetails
  extends WeatherPropertyProps,
    Temperatures {
  iconName: string;
  date: string;
  dayOfTheWeek: string;
  description: string;
}

export default function DailyForecastComponent(props: DailyForecastDetails) {
  const {
    iconName = "02d",
    date = "11.02",
    dayOfTheWeek = "Tuesday",
    temp,
  } = props;
  return (
    <>
      <div>
        <p className="text-xl">
          {props.dayOfTheWeek}
          <span className="text-sm">{" (" + props.date + ")"}</span>
        </p>
      </div>

      <Container className="justify-between px-6  sm:gap-16 bg-blue-300">
        <div className="flex flex-col items-center text-center pr-4">
          <p className="capitalize py-2 w-20">{props.description}</p>
          <WeatherIcon iconName={props.iconName}></WeatherIcon>
        </div>

        <MainTemp {...props} />
        <div className="flex overflow-x-auto gap-16 px-4">
        <ForecastDetails {...props} />

        </div>
      </Container>
    </>
  );
}
