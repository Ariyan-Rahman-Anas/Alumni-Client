"use client"

import { useState, useEffect } from 'react';

function ApiLoadingLoader() {
  const messages = [
    "Almost there… get ready!",
    "Hang tight, greatness incoming!",
    "The wait is worth it!",
    "Something awesome is brewing!",
    "Just a sec… big things ahead!",
    "Loading brilliance… one moment!",
    "Patience, it's almost showtime!",
    "Hold tight, the fun's loading!",
    "On it's way… stay with us!",
    "It's coming… stay excited!",
    "Preparing something epic… wait for it!",
    "Just a moment… something amazing!",
    "Good things in the works!",
    "Almost done… the magic's near!"
  ];

  const [randomMessage, setRandomMessage] = useState<string>("");

  useEffect(() => {
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [messages]);

  return (
    <div className="min-h-[80vh] min-w-full flex flex-col items-center justify-center">
      <div className="animate-spin h-10 w-10 border-8 border-dotted border-black border-t-transparent rounded-full mr-2" />
      <p className="font-semibold px-4 mt-3">
        {randomMessage || "Loading..."}
      </p>
    </div>
  );
}
export default ApiLoadingLoader;