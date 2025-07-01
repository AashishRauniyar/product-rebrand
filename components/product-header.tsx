"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
  productName: string;
}

export default function ProductHeader({ productName }: ProductHeaderProps) {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <section className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-8 rounded-2xl mb-8 shadow-xl">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
            Tribal Force X
          </h2>

          <p className="text-lg mb-6">
            In an effort to combat counterfeit versions of this popular male
            enhancement formula, we have rebranded to
            <span className="font-bold"> Tribal Force X</span>. This ensures you
            receive the highest quality, original product.
          </p>

          <div className="bg-indigo-600/20 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-indigo-300">
                Hurry, Limited Stock Available!
              </p>
              <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-xl font-bold">{formatTime(seconds)}</span>
              </div>
            </div>
          </div>

          <Button
            className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-lg py-6 rounded-xl transition-all duration-300"
            onClick={() =>
              window.open(
                "https://thetribalforcex.com/start/index.php?aff_id=12683&subid=renamelander",
                "_blank"
              )
            }
          >
            <span className="relative z-10 font-bold tracking-wider">
              ORDER NOW
            </span>
            <span className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
          </Button>
        </div>

        <div className="relative order-1 md:order-2 flex justify-center">
          <div className="relative w-48 h-64">
            <Image
              src="/images/TRIBAL_FORCE_X.png"
              alt="Tribal Force X Product"
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute -bottom-4 right-0 md:right-10 w-24 h-24">
            <Image
              src="/images/New-and-Improved-Badge.png"
              alt="New and Improved Badge"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
