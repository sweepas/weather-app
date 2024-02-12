import React from "react";

export interface Temperatures {
  temp: number;
  feelsTemp: number;
  minTemp: number;
  maxTemp: number;
}

export default function MainTemp(props: Temperatures) {
  return (
    <div className="text-center text-5xl flex flex-col py-4 items-center px-4">
      <span>{props.temp}°</span>
      <p className="text-xs whitespace-nowrap">
        <span>Feels like </span>
        <span>{props.feelsTemp}°</span>
        <p className="text-xs">
          <span>
            {props.minTemp}
            °↓
          </span>
          <span>
            {props.maxTemp}
            °↑
          </span>
        </p>
      </p>
    </div>
  );
}
