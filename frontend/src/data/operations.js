export const customers = [
  {
    id: "cus-201",
    name: "Ahmet Yılmaz",
    phone: "+90 532 100 10 10",
    motorcycle: "Yamaha MT-07",
    lastAction: "Periyodik bakım",
    date: "Bugün",
    status: "Aktif servis",
  },
  {
    id: "cus-202",
    name: "Selin Kaya",
    phone: "+90 533 200 20 20",
    motorcycle: "Honda Forza",
    lastAction: "Aksesuar teklifi",
    date: "Dün",
    status: "Teklif bekliyor",
  },
  {
    id: "cus-203",
    name: "Mert Demir",
    phone: "+90 534 300 30 30",
    motorcycle: "BMW GS",
    lastAction: "Fren sistemi",
    date: "12 Tem",
    status: "Teslim edildi",
  },
  {
    id: "cus-204",
    name: "Deniz Arslan",
    phone: "+90 535 400 40 40",
    motorcycle: "Vespa GTS",
    lastAction: "Lastik değişimi",
    date: "8 Tem",
    status: "Randevu alındı",
  },
];

export const invoices = [
  {
    id: "FTR-1028",
    customer: "Ahmet Yılmaz",
    description: "Servis + yağ",
    amount: 3850,
    status: "Ödendi",
    date: "20 Tem 2026",
  },
  {
    id: "FTR-1029",
    customer: "Selin Kaya",
    description: "Kask + eldiven",
    amount: 6680,
    status: "Bekliyor",
    date: "19 Tem 2026",
  },
  {
    id: "FTR-1030",
    customer: "Mert Demir",
    description: "Fren balatası",
    amount: 2450,
    status: "Ödendi",
    date: "18 Tem 2026",
  },
  {
    id: "FTR-1031",
    customer: "Deniz Arslan",
    description: "Lastik + işçilik",
    amount: 5200,
    status: "Taslak",
    date: "17 Tem 2026",
  },
];

export const serviceJobs = [
  ["SRV-440", "Yamaha MT-07", "Yağ + filtre", "Bugün 14:30", "Serviste"],
  ["SRV-441", "Honda Forza", "Kayış kontrol", "Yarın 10:00", "Planlandı"],
  ["SRV-442", "BMW GS", "Fren testi", "Bugün 17:00", "Parça bekliyor"],
];

export const balanceLines = [
  ["Ürün ve parça geliri", 112400, "Gelir"],
  ["Servis işçilik geliri", 74000, "Gelir"],
  ["Parça tedarik gideri", 61200, "Gider"],
  ["Kira ve operasyon", 30000, "Gider"],
];
