import './globals.css';

export const metadata = {
  title: 'Florian_TC Assistant',
  description: 'Assistant expert en pronostics sportifs',
  icons: {
    icon: '/florian.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
