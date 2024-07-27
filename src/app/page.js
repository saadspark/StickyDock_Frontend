import Image from "next/image";
import Header from "./Components/Header";
import Hero from "./sections/Hero";
import ShirtDesigner from "./sections/ShirtDesigner";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <ShirtDesigner />
    </main>
  );
}
