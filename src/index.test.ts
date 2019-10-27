import { VFileMessage } from "vfile-message";

import robin, { RobinSettings } from "./index";

const getObjectMessagesViaRobin = async (
  text: string | string[],
  settings?: RobinSettings
): Promise<VFileMessage[]> => {
  if (Array.isArray(text)) {
    text = text.join("\n");
  }

  const { messages } = await robin(text, settings);

  return messages;
};

const getStringMessagesViaRobin = async (
  text: string | string[],
  settings?: RobinSettings
): Promise<string[]> => {
  const messages = await getObjectMessagesViaRobin(text, settings);

  return messages.map(String);
};

it("finds warnings in markdown", async () => {
  const messages = await getStringMessagesViaRobin([
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
  const messages = await getStringMessagesViaRobin([
    "The `boogeyman` is coming.",
    "",
    "```",
    "The boogeyman is coming.",
    "```"
  ]);

  expect(messages).toEqual([]);
});

it("uses all rules when the enable setting is absent", async () => {
  const messages = await getStringMessagesViaRobin([
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

it("uses all rules when the enable setting is an empty list", async () => {
  const messages = await getStringMessagesViaRobin(
    ["The **boogeyman** is coming.", "_The boogeyman is coming._"],
    {
      enable: []
    }
  );

  expect(messages).toEqual([
    "1:7-1:16: `boogeyman` may be insensitive, use `boogeymonster`, " +
      "`boogey` instead",
    "2:6-2:15: `boogeyman` may be insensitive, use `boogeymonster`, " +
      "`boogey` instead"
  ]);
});

it("ignores all rules except those in the enable setting's list", async () => {
  const messages = await getStringMessagesViaRobin(
    ["The **boogeyman** is coming.", "_The boogeyman is coming._"],
    {
      enable: ["boogeyman-boogeywoman"]
    }
  );

  expect(messages).toEqual([
    "1:7-1:16: `boogeyman` may be insensitive, use `boogeymonster`, " +
      "`boogey` instead",
    "2:6-2:15: `boogeyman` may be insensitive, use `boogeymonster`, " +
      "`boogey` instead"
  ]);
});

it("ignores rule violations matching phrases in the ignore setting's list", async () => {
  const messages = await getStringMessagesViaRobin(
    ["The **boogeyman** is coming.", "_The boogeywoman is coming._"],
    {
      enable: ["boogeyman-boogeywoman"],
      ignore: ["boogeyman"]
    }
  );

  expect(messages).toEqual([
    "2:6-2:17: `boogeywoman` may be insensitive, use `boogeymonster`, " +
      "`boogey` instead"
  ]);
});

it("ignores rule violations matching phrases in the ignore setting's list, case insensitively", async () => {
  const messages = await getStringMessagesViaRobin("He is coming.", {
    enable: ["he-she"],
    ignore: ["he"]
  });

  expect(messages).toEqual([]);
});
