"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { Moon, Sun } from "lucide-react";

// Random motivational quotes
const quotes = [
  "Keep pushing forward! 🚀",
  "Believe in yourself! ✨",
  "Every day is a new opportunity! 💡",
  "Dream big, work hard! 🔥",
];

function Header() {
  const { user } = useUser();
  const [theme, setTheme] = useState("light");
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = "";

    if (hour < 12) newGreeting = "Good morning";
    else if (hour < 18) newGreeting = "Good afternoon";
    else newGreeting = "Good evening";

    if (user) {
      newGreeting = `${newGreeting}, <strong>${user.firstName}</strong>!`;
    } else {
      newGreeting = `${newGreeting}!`;
    }

    setGreeting(newGreeting);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm dark:bg-gray-800 dark:text-white">
      <Image src="/logo.svg" width={90} height={50} alt="logo" />

      <div className="text-center">
        <p className="text-lg font-semibold" dangerouslySetInnerHTML={{ __html: greeting }} />
        <p className="text-sm italic text-gray-500 dark:text-gray-400">{quote}</p>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={toggleTheme} className="p-2 hover:text-primary">
          {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </button>
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
