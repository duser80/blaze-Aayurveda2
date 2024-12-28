"use client";

import React, { FC, useState, useEffect } from "react";
import backgroundLineSvg from "@/src/images/Moon.svg";
import ButtonPrimary from "@/src/shared/Button/ButtonPrimary";
import Next from "@/src/shared/NextPrev/Next";
import Prev from "@/src/shared/NextPrev/Prev";
import useInterval from "react-use/lib/useInterval";
import useBoolean from "react-use/lib/useBoolean";
import Image from "next/image";
import { getHero2DemoData, Hero2DataType } from "./data";

export interface SectionHero2Props {
  className?: string;
}

let TIME_OUT: NodeJS.Timeout | null = null;

const SectionHero2: FC<SectionHero2Props> = ({ className = "" }) => {
  const [indexActive, setIndexActive] = useState(0);
  const [isRunning, toggleIsRunning] = useBoolean(true);
  const [DATA, setData] = useState<Hero2DataType[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const data = await getHero2DemoData();
    setData(data);
  };

  useInterval(
    () => {
      handleAutoNext();
    },
    isRunning ? 5500 : null
  );

  const handleAutoNext = () => {
    setIndexActive((state) => (state >= DATA.length - 1 ? 0 : state + 1));
  };

  const handleClickNext = () => {
    setIndexActive((state) => (state >= DATA.length - 1 ? 0 : state + 1));
    handleAfterClick();
  };

  const handleClickPrev = () => {
    setIndexActive((state) => (state === 0 ? DATA.length - 1 : state - 1));
    handleAfterClick();
  };

  const handleAfterClick = () => {
    toggleIsRunning(false);
    if (TIME_OUT) {
      clearTimeout(TIME_OUT);
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true);
    }, 1000);
  };

  const renderItem = (index: number) => {
    const isActive = indexActive === index;
    const item = DATA[index];
    if (!isActive) {
      return null;
    }
    return (
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation flex flex-col lg:flex-row relative overflow-hidden ${className}`}
        key={index}
      >
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex justify-center space-x-2">
          {DATA.map((_, index) => {
            const isActive = indexActive === index;
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index);
                  handleAfterClick();
                }}
                className="relative px-1 py-1.5 cursor-pointer"
              >
                <div
                  className={`relative w-20 h-1 shadow-sm rounded-md ${
                    isActive ? "bg-slate-900" : "bg-white"
                  }`}
                ></div>
              </div>
            );
          })}
        </div>

        <Prev
          className="absolute left-1 sm:left-5 top-3/4 sm:top-1/2 sm:-translate-y-1/2 z-10 text-slate-700"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickPrev={handleClickPrev}
        />
        <Next
          className="absolute right-1 sm:right-5 top-3/4 sm:top-1/2 sm:-translate-y-1/2 z-10 text-slate-700"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickNext={handleClickNext}
        />

        <div className="absolute inset-0 bg-[#E3FFE6]">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute w-full h-full object-contain"
            src={backgroundLineSvg}
            alt="hero"
          />
        </div>

        <div className="relative container pb-0 pt-14 sm:pt-20 lg:py-44 flex flex-col lg:flex-row items-center">
          <div className="relative z-[1] w-full lg:w-1/2 space-y-8 sm:space-y-14 nc-SectionHero2Item__left">
            <div className="space-y-5 sm:space-y-6">
              <span className="nc-SectionHero2Item__subheading block text-base md:text-xl text-slate-700 font-medium">
                {item.subHeading}
              </span>
              <h2 className="nc-SectionHero2Item__heading font-semibold text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl leading-tight text-slate-900">
                {item.heading}
              </h2>
            </div>

            <ButtonPrimary
              className="nc-SectionHero2Item__button dark:bg-slate-900"
              sizeClass="py-3 px-6 sm:py-5 sm:px-9"
              href={item.btnLink}
            >
              <span>{item.btnText}</span>
              <span>
                <svg className="w-5 h-5 ml-2.5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 22L20 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </ButtonPrimary>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2">
            <div className=" aspect-square w-1/2">
              <Image
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover object-center rounded-xl"
                src={item.image}
                alt={item.heading}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{DATA.map((_, index) => renderItem(index))}</>;
};

export default SectionHero2;
