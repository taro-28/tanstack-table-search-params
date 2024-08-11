import { Suspense } from "react";
import { Table } from "./table";

export default function Page() {
  return (
    <main className="space-y-2 mx-6">
      <h1 className="text-lg font-semibold">Custom query param name</h1>
      <Suspense>
        <Table />
      </Suspense>
    </main>
  );
}
