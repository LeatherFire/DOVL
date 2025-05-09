"use client";
import { useEffect } from "react";

export default function HataSayfasi() {
  useEffect(() => {
    // Kasıtlı olarak hata oluştur
    throw new Error("Bu bir test hatasıdır. 500 hata sayfasını görmek için oluşturuldu.");
  }, []);
  
  return <div>Bu sayfa 500 hata sayfasını gösterecek</div>;
} 