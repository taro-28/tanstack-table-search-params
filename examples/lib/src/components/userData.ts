import { faker } from "@faker-js/faker";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";

const createUser = () => ({
  id: faker.string.uuid(),
  name: faker.internet.username(),
  age: faker.number.int({ min: 18, max: 100 }),
});

export type User = ReturnType<typeof createUser>;

const columnHelper = createColumnHelper<User>();
export const userColumns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("age", { header: "Age" }),
];

export const useUserData = () => {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    setData(faker.helpers.multiple(createUser, { count: 100 }));
  }, []);

  return data;
};
