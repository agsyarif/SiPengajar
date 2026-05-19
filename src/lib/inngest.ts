import { Inngest } from "inngest";
import { generateModulAjar, type ModulInput } from "./ai";
import { prisma } from "./prisma";

export const inngest = new Inngest({ id: "ajarai" });

export const generateModulJob = inngest.createFunction(
  {
    id: "generate-modul-ajar",
    retries: 2,
    triggers: [{ event: "modul/generate.requested" }],
  },
  async ({ event, step }) => {
    const { modulId, input } = event.data as { modulId: string; input: ModulInput };

    const content = await step.run("generate-ai-content", async () => {
      return generateModulAjar(input);
    });

    await step.run("save-to-db", async () => {
      await prisma.modul.update({
        where: { id: modulId },
        data: { content, status: "DONE" },
      });
    });

    return { modulId, success: true };
  },
);
