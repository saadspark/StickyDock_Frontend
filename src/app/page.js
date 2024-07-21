import Image from "next/image";
import Header from "./Components/Header";
import Hero from "./sections/Hero";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
    </main>
  );
}
