"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "next-auth";
import { Button } from "./ui/button";
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User

  return (
    <>
      <nav>
        <div className="w-full flex justify-between items-center py-4 px-6 shadow-md bg-gray-100">
          <a className="text-2xl font-bold " href="#">True Feedback</a>
          <div>
            {session ? (
              <>
                {" "}
                <span className="mx-4">Welcome, {user?.username || user?.email}</span>
                <Button onClick={() => signOut()}>Logout</Button>
              </>
            ) : (
              <Link href={"/signin"}>
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
