"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";

export default function Test404Sayfasi() {
  useEffect(() => {
    // 404 sayfasına yönlendir
    notFound();
  }, []);
  
  return <div>Bu sayfa 404 hata sayfasını gösterecek</div>;
} 