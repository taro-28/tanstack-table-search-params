import { NavLink, Outlet } from "react-router";

type Menu = { title: string; href: string };

const menus = [
  { title: "Basic", href: "/" },
  { title: "Custom query param name", href: "/custom-param-name" },
  { title: "Custom default value", href: "/custom-default-value" },
  { title: "Custom encoder/decoder", href: "/custom-encoder-decoder" },
  { title: "Debounce", href: "/debounce" },
  { title: "Push(instead of replace)", href: "/push" },
] as const satisfies Menu[];

export default function Layout() {
  return (
    <>
      <header className="flex items-center space-x-4 mx-4">
        <NavLink to="/" className="hover:text-gray-500 font-bold p-2 text-xl">
          TanStack Table Search Params
        </NavLink>
        <nav>
          <ul className="flex items-center">
            {menus.map((menu) => (
              <li key={menu.href}>
                <NavLink to={menu.href} className="hover:text-gray-500 p-2">
                  {menu.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
