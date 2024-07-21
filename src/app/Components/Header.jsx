import Image from "next/image";
import React from "react";
import logo from "../assets/logos/StickyDock.png";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";
import { IoBagHandleOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";

export default function Header() {
  return (
    <section>
      <div className="flex w-full bg-black justify-center items-center h-8">
        <p className="font-sans font-semibold text-white">
          {" "}
          Flat 20% Off on All Summer Products
        </p>
      </div>
      <nav className="p-3 flex justify-between items-center">
        <Link href="/">
          <Image src={logo} alt=" sticky dock logo" height={100} width={200} />
        </Link>
        <div className="flex max-lg:hidden justify-center items-center gap-4">
          <Link href="/products" className="text-black">
            Categories
          </Link>
          <Link href="/about" className="text-black">
            About
          </Link>
          <Link href="/contact" className="text-black">
            Contact
          </Link>
        </div>

        <div className="flex justify-center items-center gap-3">
          <form className="max-lg:hidden flex justify-center items-center">
            <input type="text" className="bg-slate-200 rounded-l-lg h-7 w-40 text-sm"  placeholder=" search..." />
            <IoMdSearch  size={23} className="font-bold bg-slate-200 rounded-r-lg h-7" />
          </form>
          <FaRegUser size={20} className="font-bold" />
          <IoBagHandleOutline size={23} className="font-bold" />
          <IoMdSearch  size={23} className="font-bold hidden max-md:block" />
          <FaBars size={23} className="font-bold hidden max-md:block" />
        </div>
      </nav>
    </section>
  );
}
