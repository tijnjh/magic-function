import OpenAI from "openai";
import dedent from "dedent";

/**
 *
 * @param query A short description of that the function should do
 * @returns A function that (hopefully) does what you asked for
 */
export default async function (query: string, ...rest: any[]) {
  const paramDescriptors = rest.map((param, i) => ({
    name: `param${i + 1}`,
    type: typeof param,
    value: param,
  }));

  const paramList = paramDescriptors
    .map((p) => `${p.name}: ${p.type}`)
    .join(",\n");

  const instructions = dedent`
    You are a code generator.
    Respond ONLY with a single, complete, and valid JavaScript function definition, with no extra text, comments, or code blocks.
        
    The function should accept the following parameters, in this order:
    ${paramList}
        
    The function should implement the following behavior:
    "${query}"
  `;

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_AI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.responses.create({
    model: "gpt-4.1-nano",
    instructions,
    input: query,
  });

  console.log(response.output_text);

  return eval(`(${response.output_text})(${rest})`);
}
