import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="flex items-center space-x-4 mx-4">
          <Link href="/" className="hover:text-gray-500 font-bold p-2 text-xl">
            TanStack Table Search Params
          </Link>
          <nav>
            <ul className="flex items-center">
              <li>
                <Link href="/" className="hover:text-gray-500 p-2">
                  Basic
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-param-name"
                  className="hover:text-gray-500 p-2"
                >
                  Custom query param name
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-encoder-decoder"
                  className="hover:text-gray-500 p-2"
                >
                  Custom encoder/decoder
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
