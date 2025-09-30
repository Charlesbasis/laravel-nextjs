import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata: Metadata = {
  title: "My Next App",
  description: "CRUD based Next.js app with Laravel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <h1>Hello World</h1>
        {/* {children} */}
      </body>
    </html>
  );
}
