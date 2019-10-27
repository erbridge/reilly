import { VFileMessage } from "vfile-message";

import robin, { RobinSettings } from "./index";

const getRobinMessages = async (
  text: string | string[],
  settings?: RobinSettings
): Promise<VFileMessage[]> => {
  if (Array.isArray(text)) {
    text = text.join("\n");
  }

  const { messages } = await robin(text, settings);

  return messages;
};

it("finds warnings in markdown", async () => {
  await expect(
    getRobinMessages([
      "The **boogeyman** is coming.",
      "_The boogeyman is coming._"
    ])
  ).resolves.toMatchInlineSnapshot(`
          Array [
            [1:7-1:16: \`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
            [2:6-2:15: \`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
          ]
        `);
});

it("ignores code blocks in markdown", async () => {
  await expect(
    getRobinMessages([
      "The `boogeyman` is coming.",
      "",
      "```",
      "The boogeyman is coming.",
      "```"
    ])
  ).resolves.toMatchInlineSnapshot(`Array []`);
});

it("uses all rules when the enable setting is absent", async () => {
  await expect(
    getRobinMessages([
      "The **boogeyman** is coming.",
      "_The boogeyman is coming._"
    ])
  ).resolves.toMatchInlineSnapshot(`
          Array [
            [1:7-1:16: \`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
            [2:6-2:15: \`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
          ]
        `);
});

it("uses all rules when the enable setting is an empty list", async () => {
  await expect(
    getRobinMessages(
      ["The **boogeyman** is coming.", "_The boogeyman is coming._"],
      {
        enable: []
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            [1:7-1:16: \`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
            [2:6-2:15: \`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
          ]
        `);
});

it("ignores all rules except those in the enable setting's list", async () => {
  await expect(
    getRobinMessages(
      ["The **boogeyman** is coming.", "_The boogeyman is coming._"],
      {
        enable: ["boogeyman-boogeywoman"]
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            [1:7-1:16: \`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
            [2:6-2:15: \`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
          ]
        `);
});

it("ignores rule violations matching phrases in the ignore setting's list", async () => {
  await expect(
    getRobinMessages(
      ["The **boogeyman** is coming.", "_The boogeywoman is coming._"],
      {
        enable: ["boogeyman-boogeywoman"],
        ignore: ["boogeyman"]
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            [2:6-2:17: \`boogeywoman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
          ]
        `);
});

it("ignores rule violations matching phrases in the ignore setting's list, case insensitively", async () => {
  await expect(
    getRobinMessages("He is coming.", {
      enable: ["he-she"],
      ignore: ["he"]
    })
  ).resolves.toMatchInlineSnapshot(`Array []`);
});

it("uses the presets in the preset setting's list", async () => {
  await expect(
    getRobinMessages(
      [
        "The **boogeyman** is coming.",
        "_The boogeywoman is coming._",
        "Better stay sane and avoid the bony bits!"
      ],
      {
        presets: ["ablism"]
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            [3:13-3:17: \`sane\` may be insensitive, use \`correct\`, \`adequate\`, \`sufficient\`, \`consistent\`, \`valid\`, \`coherent\`, \`sensible\`, \`reasonable\` instead],
          ]
        `);
});

it("combines the local settings with the presets in the preset setting's list", async () => {
  await expect(
    getRobinMessages(
      [
        "The **boogeyman** is coming.",
        "_The boogeywoman is coming._",
        "Better stay sane and avoid the bony bits!"
      ],
      {
        presets: ["ablism"],
        enable: ["boogeyman-boogeywoman"],
        ignore: ["boogeyman"]
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            [2:6-2:17: \`boogeywoman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead],
            [3:13-3:17: \`sane\` may be insensitive, use \`correct\`, \`adequate\`, \`sufficient\`, \`consistent\`, \`valid\`, \`coherent\`, \`sensible\`, \`reasonable\` instead],
          ]
        `);
});
