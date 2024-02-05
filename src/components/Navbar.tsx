import React from "react";
import { MdSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import SearchBox from "./SearchBox";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <MdSunny className="text-3xl mt-1 text-yellow-400" />
        </div>
        <section className="flex gap-2 items-center">
          <MdMyLocation className="text-2xl text-gray-400 hover:opscity-80 cursor-pointer" />
          <IoLocationOutline className="text-3xl" />
          <p className="text-slate-900/80 text-sm">UK</p>
          <div>
            <SearchBox />
          </div>
        </section>
      </div>
    </nav>
  );
}
