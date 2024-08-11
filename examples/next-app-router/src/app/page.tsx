import { Suspense } from "react";
import { BasicTable } from "./table";

export default function Page() {
  return (
    <main className="space-y-2 mx-6">
      <h1 className="text-lg font-semibold">Basic</h1>
      <Suspense>
        <BasicTable />
      </Suspense>
    </main>
  );
}
