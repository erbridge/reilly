import robin from "./index";

const parseRobinMessagesAsStrings = async (
  text: string | string[]
): Promise<string[]> => {
  if (Array.isArray(text)) {
    text = text.join("\n");
  }

  const { messages } = await robin(text);

  return messages.map(String);
};

it("finds warnings in markdown", async () => {
  const messages = await parseRobinMessagesAsStrings([
    "The **boogeyman** is coming.",
    "_The boogeyman is coming._"
  ]);

  expect(messages).toEqual([
    "1:7-1:16: `boogeyman` may be insensitive, use `boogeymonster`, " +
      "`boogey` instead",
    "2:6-2:15: `boogeyman` may be insensitive, use `boogeymonster`, " +
      "`boogey` instead"
  ]);
});

it("ignores code blocks in markdown", async () => {
  const messages = await parseRobinMessagesAsStrings([
    "The `boogeyman` is coming.",
    "",
    "```",
    "The boogeyman is coming.",
    "```"
  ]);

  expect(messages).toEqual([]);
});
