import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl">
      <div className="flex items-center space-x-5">
        <Link href="/">
            <img className="w-44 object-contain cursor-pointer" src="https://links.paparect.com/yvf" alt="" />
        </Link>
        <div className="hidden md:inline-flex items-center  space-x-5">
            <h3>About</h3>
            <h3>Contact</h3>
            <h3 className=" bg-green-600 text-white rounded-full px-4 py-1 ">Follow</h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign in</h3>
        <h3 className="border px-4 py-1 rounded-full border-green-600">Get started</h3>
      </div>
    </header>
  );
}
