import { createInterface } from "readline";

export default async function ask(question: string): Promise<string> {
  const line = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    line.question(question, (answer) => {
      line.close();
      resolve(answer);
    })
  );
}
