import type { Order, Product, Spec } from '../types/shop';

// Boshlang'ich mahsulotlar (dizayndagi seed). Backend ulanganda bu API'dan keladi.
export function seedProducts(): Product[] {
  const P = (
    id: number,
    name: string,
    cat: Product['cat'],
    price: number,
    oldPrice: number | null,
    stock: number,
    rating: number,
    desc: string,
    specs: Spec[],
  ): Product => ({ id, name, cat, price, oldPrice, stock, rating, desc, specs, img: '' });

  return [
    P(1, 'Galaxy S24 Ultra', 'smartfon', 15990000, 17990000, 8, 4.9,
      "Titan korpus, 200MP kamera va S Pen bilan eng kuchli Galaxy. Sun'iy intellekt funksiyalari va yorqin AMOLED ekran.",
      [['Ekran', '6.8″ AMOLED 120Hz'], ['Xotira', '256GB / 12GB RAM'], ['Kamera', '200MP asosiy'], ['Batareya', '5000mAh']]),
    P(2, 'Pixel 8 Pro', 'smartfon', 12490000, null, 5, 4.7,
      "Google Tensor G3 protsessori va sun'iy intellekt asosidagi kamera. Sof Android tajribasi.",
      [['Ekran', '6.7″ LTPO OLED'], ['Xotira', '128GB / 12GB RAM'], ['Kamera', '50MP triple'], ['Batareya', '4950mAh']]),
    P(3, 'Redmi Note 13 Pro', 'smartfon', 3990000, 4590000, 14, 4.5,
      'Arzon narxda kuchli imkoniyatlar. 200MP kamera va tez quvvatlash.',
      [['Ekran', '6.67″ AMOLED'], ['Xotira', '256GB / 8GB RAM'], ['Kamera', '200MP'], ['Batareya', '5100mAh']]),
    P(4, 'Nova Phone Z', 'smartfon', 8990000, null, 0, 4.6,
      'Nozik dizayn, yorqin ekran va kuchli protsessor. Hozircha omborda tugagan.',
      [['Ekran', '6.5″ OLED'], ['Xotira', '128GB / 8GB RAM'], ['Kamera', '108MP'], ['Batareya', '4600mAh']]),
    P(5, 'MacBook Air 13 M3', 'noutbuk', 16490000, null, 6, 4.9,
      "Ajoyib yengil korpus, M3 chipi va kun bo'yi ishlaydigan batareya. Talabalar va professionallar uchun.",
      [['Ekran', '13.6″ Liquid Retina'], ['Protsessor', 'Apple M3'], ['Xotira', '512GB SSD / 8GB'], ['Batareya', '18 soatgacha']]),
    P(6, 'ZenBook 14 OLED', 'noutbuk', 11200000, 12800000, 4, 4.6,
      'Ultra-yupqa OLED noutbuk. Intel Core Ultra va nafis alyuminiy korpus.',
      [['Ekran', '14″ OLED 2.8K'], ['Protsessor', 'Core Ultra 7'], ['Xotira', '1TB SSD / 16GB'], ['Batareya', '13 soat']]),
    P(7, 'ThinkPad X1 Carbon', 'noutbuk', 19900000, null, 3, 4.8,
      'Biznes uchun premium noutbuk. Yengil, mustahkam va xavfsiz.',
      [['Ekran', '14″ IPS WUXGA'], ['Protsessor', 'Core i7-1360P'], ['Xotira', '1TB SSD / 32GB'], ['Batareya', '15 soat']]),
    P(8, 'Aspire Go 15', 'noutbuk', 6800000, null, 0, 4.2,
      "Kundalik ishlar uchun byudjet noutbuk. Hozircha omborda yo'q.",
      [['Ekran', '15.6″ FHD'], ['Protsessor', 'Core i5'], ['Xotira', '512GB SSD / 8GB'], ['Batareya', '9 soat']]),
    P(9, 'AirPods Pro 2', 'quloqchin', 3290000, null, 20, 4.8,
      'Faol shovqin bostirish, adaptiv audio va USB-C zaryadlash keysi.',
      [['Turi', 'TWS'], ['ANC', 'Ha, adaptiv'], ['Batareya', '6+24 soat'], ['Himoya', 'IP54']]),
    P(10, 'Sony WH-1000XM5', 'quloqchin', 4590000, 5290000, 7, 4.9,
      'Sinfidagi eng yaxshi shovqin bostirish. Yumshoq quloq yostiqchalari va toza ovoz.',
      [['Turi', 'Over-ear'], ['ANC', 'Ha'], ['Batareya', '30 soat'], ['Ulanish', 'Bluetooth 5.2']]),
    P(11, 'JBL Tune 760NC', 'quloqchin', 990000, 1290000, 15, 4.4,
      'Arzon narxdagi shovqin bostiruvchi quloqchin. Chuqur bass va uzoq batareya.',
      [['Turi', 'Over-ear'], ['ANC', 'Ha'], ['Batareya', '35 soat'], ['Vazn', '220g']]),
    P(12, 'Buds Air Pro', 'quloqchin', 1890000, null, 0, 4.3,
      'Ixcham TWS quloqchin. Hozircha omborda tugagan.',
      [['Turi', 'TWS'], ['ANC', 'Ha'], ['Batareya', '5+20 soat'], ['Himoya', 'IPX4']]),
    P(13, 'Anker 65W adapter', 'aksessuar', 390000, null, 30, 4.7,
      'Uch portli GaN quvvat adapteri. Noutbuk va telefonni bir vaqtda zaryadlaydi.',
      [['Quvvat', '65W'], ['Portlar', '2×USB-C, 1×USB-A'], ['Texnologiya', 'GaN'], ['Himoya', 'Ha']]),
    P(14, '20000mAh Power Bank', 'aksessuar', 450000, 590000, 18, 4.6,
      "Katta sig'imli tashqi batareya. Tez quvvatlash va raqamli displey.",
      [["Sig'im", '20000mAh'], ['Chiqish', '22.5W'], ['Portlar', '2×USB, 1×Type-C'], ['Displey', 'Ha']]),
    P(15, 'MX Master 3S', 'aksessuar', 1290000, null, 9, 4.8,
      'Professional simsiz sichqoncha. Aniq skroll va ergonomik dizayn.',
      [['Ulanish', 'Bluetooth/USB'], ['DPI', '8000'], ['Batareya', '70 kun'], ['Tugmalar', '7']]),
    P(16, '45W Type-C charger', 'aksessuar', 520000, null, 12, 4.5,
      'Super tez quvvatlash adapteri. Smartfon va planshetlar uchun.',
      [['Quvvat', '45W'], ['Port', 'USB-C'], ['Standart', 'PD 3.0'], ['Kabel', 'Ha']]),
  ];
}

// Boshlang'ich buyurtmalar (admin panelida ko'rinadi)
export function seedOrders(): Order[] {
  return [
    { id: '#MP-1042', customer: 'Jasur Karimov', phone: '+998 90 123 45 67', address: 'Toshkent, Chilonzor 12-kvartal, 45-uy', date: '05.07.2026, 14:22', items: [{ name: 'Galaxy S24 Ultra', qty: 1, price: 15990000 }, { name: 'AirPods Pro 2', qty: 1, price: 3290000 }], delivery: 0, total: 19280000, status: 'yangi', pay: 'Karta' },
    { id: '#MP-1041', customer: 'Malika Yusupova', phone: '+998 93 555 12 00', address: "Samarqand, Registon ko'chasi 8", date: '05.07.2026, 11:08', items: [{ name: 'MacBook Air 13 M3', qty: 1, price: 16490000 }], delivery: 50000, total: 16540000, status: 'tayyorlanmoqda', pay: 'Naqd' },
    { id: '#MP-1040', customer: 'Bekzod Rahimov', phone: '+998 97 888 44 22', address: 'Toshkent, Yunusobod 4-mavze', date: '04.07.2026, 18:45', items: [{ name: 'Sony WH-1000XM5', qty: 1, price: 4590000 }, { name: 'Anker 65W adapter', qty: 2, price: 390000 }], delivery: 30000, total: 5400000, status: 'yetkazildi', pay: 'Karta' },
    { id: '#MP-1039', customer: 'Nodira Islomova', phone: '+998 91 234 56 78', address: 'Buxoro, Mustaqillik 21', date: '04.07.2026, 09:30', items: [{ name: 'MX Master 3S', qty: 1, price: 1290000 }], delivery: 30000, total: 1320000, status: 'yetkazildi', pay: 'Karta' },
    { id: '#MP-1038', customer: 'Sarvar Tosh', phone: '+998 94 111 22 33', address: "Toshkent, Mirzo Ulug'bek 15", date: '03.07.2026, 16:12', items: [{ name: 'ThinkPad X1 Carbon', qty: 1, price: 19900000 }], delivery: 0, total: 19900000, status: 'bekor', pay: 'Karta' },
  ];
}
