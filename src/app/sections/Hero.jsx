'use clients'
import React from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import logo from "../assets/logos/StickyDock.png";
// Dynamically import Carousel from react-bootstrap
const Carousel = dynamic(() => import('react-bootstrap/Carousel'), { ssr: false });

export default function Hero() {
  return (
    <section className="h-screen rounded-lg bg-slate-500 p-5">
     <div>
      erer
     </div>
    </section>
  );
}
