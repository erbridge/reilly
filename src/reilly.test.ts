import reilly, { ReillySettings } from "./reilly";

const getReillyMessages = async (
  text: string | string[],
  settings?: ReillySettings
): Promise<string[]> => {
  if (Array.isArray(text)) {
    text = text.join("\n");
  }

  const { messages } = await reilly(text, settings);

  return messages.map(message => message.message);
};

it("finds warnings in markdown", async () => {
  await expect(
    getReillyMessages([
      "The **boogeyman** is coming.",
      "_The boogeyman is coming._"
    ])
  ).resolves.toMatchInlineSnapshot(`
          Array [
            "\`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
            "\`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
          ]
        `);
});

it("ignores code blocks in markdown", async () => {
  await expect(
    getReillyMessages([
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
    getReillyMessages([
      "The **boogeyman** is coming.",
      "_The boogeyman is coming._"
    ])
  ).resolves.toMatchInlineSnapshot(`
          Array [
            "\`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
            "\`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
          ]
        `);
});

it("uses all rules when the enable setting is an empty list", async () => {
  await expect(
    getReillyMessages(
      ["The **boogeyman** is coming.", "_The boogeyman is coming._"],
      {
        enable: []
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            "\`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
            "\`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
          ]
        `);
});

it("ignores all rules except those in the enable setting's list", async () => {
  await expect(
    getReillyMessages(
      ["The **boogeyman** is coming.", "_The boogeyman is coming._"],
      {
        enable: ["boogeyman-boogeywoman"]
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            "\`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
            "\`boogeyman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
          ]
        `);
});

it("ignores rule violations matching phrases in the ignore setting's list", async () => {
  await expect(
    getReillyMessages(
      ["The **boogeyman** is coming.", "_The boogeywoman is coming._"],
      {
        enable: ["boogeyman-boogeywoman"],
        ignore: ["boogeyman"]
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            "\`boogeywoman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
          ]
        `);
});

it("ignores rule violations matching phrases in the ignore setting's list, case insensitively", async () => {
  await expect(
    getReillyMessages("He is coming.", {
      enable: ["he-she"],
      ignore: ["he"]
    })
  ).resolves.toMatchInlineSnapshot(`Array []`);
});

it("uses the presets in the preset setting's list", async () => {
  await expect(
    getReillyMessages(
      [
        "The **boogeyman** is coming.",
        "_The boogeywoman is coming._",
        "Better stay sane and avoid the bony bits!"
      ],
      {
        presets: ["ableism"]
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            "\`sane\` may be insensitive, use \`correct\`, \`adequate\`, \`sufficient\`, \`consistent\`, \`valid\`, \`coherent\`, \`sensible\`, \`reasonable\` instead",
          ]
        `);
});

it("combines the local settings with the presets in the preset setting's list", async () => {
  await expect(
    getReillyMessages(
      [
        "The **boogeyman** is coming.",
        "_The boogeywoman is coming._",
        "Better stay sane and avoid the bony bits!"
      ],
      {
        presets: ["ableism"],
        enable: ["boogeyman-boogeywoman"],
        ignore: ["boogeyman"]
      }
    )
  ).resolves.toMatchInlineSnapshot(`
          Array [
            "\`boogeywoman\` may be insensitive, use \`boogeymonster\`, \`boogey\` instead",
            "\`sane\` may be insensitive, use \`correct\`, \`adequate\`, \`sufficient\`, \`consistent\`, \`valid\`, \`coherent\`, \`sensible\`, \`reasonable\` instead",
          ]
        `);
});
