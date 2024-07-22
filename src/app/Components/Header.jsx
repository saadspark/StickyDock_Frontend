'use client';
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import logo from "../assets/logos/StickyDock.png";
import Link from "next/link";
import { FaRegUser, FaBars } from "react-icons/fa6";
import { IoBagHandleOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import gsap from "gsap";

export default function Header() {
  const [menu, setMenu] = React.useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (menu) {
      gsap.to(menuRef.current, { duration: 0.5, x: '0%', display: "flex" });
    } else {
      gsap.to(menuRef.current, { duration: 0.5, x: '100%', display: "none" });
    }
  }, [menu]);

  return (
    <section>
      <div className="flex w-full bg-black justify-center items-center h-8">
        <p className="font-sans font-semibold text-white">
          Flat 20% Off on All Summer Products
        </p>
      </div>
      <nav className="p-3 flex justify-between items-center">
        <Link href="/">
          <Image src={logo} alt="sticky dock logo" height={100} width={200} />
        </Link>
        <div className="flex max-lg:hidden justify-center items-center gap-4">
          <Link href="/products" className="text-black font-semibold hover:underline hover:text-red-500">
            Categories
          </Link>
          <Link href="/about" className="text-black font-semibold hover:underline hover:text-red-500">
            About
          </Link>
          <Link href="/contact" className="text-black font-semibold hover:underline hover:text-red-500">
            Contact
          </Link>
        </div>
        <div className="flex justify-center items-center gap-3">
          <form className="max-lg:hidden flex justify-center items-center">
            <input type="text" className="bg-slate-200 rounded-l-lg h-9 w-50 text-sm p-2" placeholder=" search..." />
            <IoMdSearch size={23} className="font-bold bg-slate-200 rounded-r-lg h-9" />
          </form>
          <FaRegUser size={20} className="font-bold" />
          <IoBagHandleOutline size={23} className="font-bold" />
          <IoMdSearch size={23} className="font-bold hidden max-md:block" />
          <FaBars size={23} className="font-bold hidden max-md:block" onClick={() => setMenu(!menu)} />
        </div>
      </nav>
      <div className="relative w-full z-10">
        <div ref={menuRef} className="fixed top-0 right-0 h-screen w-56 bg-red-600" style={{ transform: 'translateX(100%)', display: "none" }}>
        <FaBars
            size={23}
            className=""
            onClick={() => setMenu(!menu)}
          />
        </div>
      </div>
    </section>
  );
}
