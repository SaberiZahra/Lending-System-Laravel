import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import { vazirmatn } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <body className={vazirmatn.className}>{children}</body>
    </html>
  );
}
