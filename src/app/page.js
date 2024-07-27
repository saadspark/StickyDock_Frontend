import Image from "next/image";
import Header from "./Components/Header";
import Hero from "./sections/Hero";
// import ShirtDesigner from "./sections/ShirtDesigner";
import dynamic from 'next/dynamic';

// Dynamically import the component that uses 'canvas'

export default function Home() {
  const ShirtDesigner = dynamic(() => import('./sections/ShirtDesigner'), { ssr: false });
  return (
    <main className="relative">
      <Header />
      {/* <Hero /> */}
      <ShirtDesigner />
    </main>
  );
}
