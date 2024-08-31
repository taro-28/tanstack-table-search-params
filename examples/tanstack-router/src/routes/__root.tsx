import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

type Menu = {
  title: string;
  to: string;
};

const menus = [
  {
    title: "Basic",
    to: "/",
  },
  {
    title: "Custom query param name",
    to: "/custom-param-name",
  },
  {
    title: "Custom encoder/decoder",
    to: "/custom-encoder-decoder",
  },
  {
    title: "Custom default value",
    to: "/custom-default-value",
  },
  {
    title: "Debounce",
    to: "/debounce",
  },
  {
    title: "Replace(instead of push)",
    to: "/replace",
  },
] as const satisfies Menu[];

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <body>
        <header className="flex items-center space-x-4 mx-4">
          <Link to="/" className="hover:text-gray-500 font-bold p-2 text-xl">
            TanStack Table Search Params
          </Link>
          <nav>
            <ul className="flex items-center">
              {menus.map((menu) => (
                <li key={menu.to}>
                  <Link to={menu.to} className="hover:text-gray-500 p-2">
                    {menu.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <Outlet />
      </body>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
