import reilly from "./reilly";

it("exports reilly", () => {
  expect(require("./index")).toStrictEqual(reilly);
});
