import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

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
              <li>
                <Link to="/" className="hover:text-gray-500 p-2">
                  Basic
                </Link>
              </li>
              <li>
                <Link
                  to="/custom-param-name"
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
        <Outlet />
      </body>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
