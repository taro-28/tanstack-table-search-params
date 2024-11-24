import { faker } from "@faker-js/faker";
import { createColumnHelper } from "@tanstack/react-table";

const createUser = () => ({
  id: faker.string.uuid(),
  name: faker.internet.username(),
  age: faker.number.int({ min: 18, max: 100 }),
});

type User = ReturnType<typeof createUser>;

const columnHelper = createColumnHelper<User>();
export const testDataColumns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("age", { header: "Age" }),
];

export const testData = faker.helpers.multiple(createUser, { count: 100 });
