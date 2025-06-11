"use client";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import BackButton from "@/components/backbutton/backbutton";
export default function notFound() {
  return (
    <div className="not-found-page flex flex-col">
        <div>
            <BackButton />
        </div>
      
      <DotLottieReact
        src="https://lottie.host/0395b6ca-7e26-4860-831d-0b45d2a53614/3ibr1uMK4z.lottie"
        loop
        autoplay
      />
      <h1>Oops!</h1>
      <p>
        Looks like you’ve wandered off the beaten path.
        <br /> The page you’re looking for might have been moved, deleted, or
        never existed in the first place. Let’s get you back on track:
      </p>
    </div>
  );
}
