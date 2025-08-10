"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to first chapter
    router.push("/chapter-1");
  }, [router]);

  return null;
}
