import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'מערכת ניהול אירועי רכיבה',
  description: 'מערכת לניהול אירועי רכיבה ופרסום תוצאות',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>
        <nav className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-foreground">מערכת ניהול אירועים</h1>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <a href="/" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">בית</a>
                <a href="/admin" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">לוח מנהל</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
