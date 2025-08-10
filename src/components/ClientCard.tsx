"use client";

import dynamic from "next/dynamic";

// Create a client-only version of the Card component
const ClientCard = dynamic(() => import("./Card"), {
  ssr: false,
  loading: () => (
    <div 
      className="relative w-full overflow-hidden flex-col items-center justify-center text-center"
      style={{
        backgroundColor: "black",
        height: "100vh",
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Loading placeholder */}
      </div>
    </div>
  ),
});

export default ClientCard;
