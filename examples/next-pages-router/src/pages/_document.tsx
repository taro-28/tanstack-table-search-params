import { Head, Html, Main, NextScript } from "next/document";
import Link from "next/link";

type Menu = {
  title: string;
  href: string;
};

const menus = [
  {
    title: "Basic",
    href: "/",
  },
  {
    title: "Custom query param name",
    href: "/custom-param-name",
  },
  {
    title: "Custom default value",
    href: "/custom-default-value",
  },
  {
    title: "Custom encoder/decoder",
    href: "/custom-encoder-decoder",
  },
  {
    title: "Debounce",
    href: "/debounce",
  },
] as const satisfies Menu[];

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <header className="flex items-center space-x-4 mx-4">
          <Link href="/" className="hover:text-gray-500 font-bold p-2 text-xl">
            TanStack Table Search Params
          </Link>
          <nav>
            <ul className="flex items-center">
              {menus.map((menu) => (
                <li key={menu.href}>
                  <Link href={menu.href} className="hover:text-gray-500 p-2">
                    {menu.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
