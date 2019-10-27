import english from "retext-english";
import equality from "retext-equality";
import unified from "unified";
import vfile, { VFile } from "vfile";

const robin = async (text: string): Promise<VFile> => {
  const processor = unified()
    .use(english)
    .use(equality);
  const file = vfile(text);
  const tree = processor.parse(file);

  await processor.run(tree, file);

  return file;
};

export default robin;
