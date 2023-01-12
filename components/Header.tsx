import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between">
      <div className="flex items-center space-x-5">
        <Link href="/">
            <img className="w-44 object-contain cursor-pointer" src="https://links.paparect.com/yvf" alt="" />
        </Link>
      </div>
    </header>
  );
}
