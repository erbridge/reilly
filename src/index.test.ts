import robin from "./index";

it("parses text", async () => {
  const { messages } = await robin("boogeyman");

  expect(messages.map(String)).toEqual([
    "1:1-1:10: `boogeyman` may be insensitive, use `boogeymonster`, " +
      "`boogey` instead"
  ]);
});
