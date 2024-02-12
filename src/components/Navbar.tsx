"use client";

import React, { useState } from "react";
import { MdSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import SearchBox from "./SearchBox";
import axios from "axios";
import { useAtom } from "jotai";
import { placeAtom, loadingLocationAtom } from "@/app/atom";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [place, setPlace] = useAtom(placeAtom);
  const [loadingLocation, setLoadingLocation] = useAtom(loadingLocationAtom);

  async function handleChange(value: string) {
    setCity(value);
    if (value.length > 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );
        const suggestions = response.data.list.map((item: any) => {
          return item.name;
        });
        console.log(suggestions);

        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }
  function handleSuggestionsClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoadingLocation(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("Location not found");
      setLoadingLocation(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoadingLocation(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { longitude, latitude } = position.coords;
        try {
          setLoadingLocation(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setLoadingLocation(false);
            setPlace(response.data.name);
          }, 500);
        } catch (error) {
          setLoadingLocation(false);
        }
      });
    }
  }
  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-blue-500">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-slate-900/80 text-3xl">Weather</h2>
            <MdSunny className="text-3xl mt-1 text-yellow-400" />
          </div>
          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="My current Location"
              onClick={handleMyLocation}
              className="text-2xl text-gray-400 hover:opscity-80 cursor-pointer"
            />
            <IoLocationOutline className="text-3xl text-slate-900/80 " />
            <p className="text-slate-900/80 text-sm">{location}</p>
            <div className="relative hidden md:flex ">
              <SearchBox
                value={city}
                onSubmit={handleSubmit}
                onChange={(e) => handleChange(e.target.value)}
              />
              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionsClick,
                  error,
                }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden ">
        <div className="relative">
          <SearchBox
            value={city}
            onSubmit={handleSubmit}
            onChange={(e) => handleChange(e.target.value)}
          />
          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionsClick,
              error,
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionsClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionsClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="flex flex-col gap-1 p-2 mb-4 bg-white absolute border top-[38px] left-0 border-grey-300 rounded-md min-w-[200px]">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1">{error}</li>
          )}
          {suggestions.map((item, index) => {
            return (
              <li
                key={index}
                onClick={() => handleSuggestionsClick(item)}
                className="cursor-pointer p-1 rounded hover:bg-blue-300"
              >
                {item}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
