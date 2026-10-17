import './globals.css';

export const metadata = {
  title: 'VALDES PRO',
  description: 'Assistant expert en pronostics sportifs',
  icons: {
    icon: '/pp.jpeg',
    apple: '/pp.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
