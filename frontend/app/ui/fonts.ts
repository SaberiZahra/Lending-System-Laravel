import { Inter, Lusitana } from 'next/font/google';
import { Vazirmatn } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });

export const lusitana700 = Lusitana( { weight: '700'});

export const lusitana400 = Lusitana( { weight: '400'});

export const lusitana = Lusitana( { weight: '400'});

export const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});