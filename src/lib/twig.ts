import path from "node:path";
import { fileURLToPath } from "node:url";

import Twig from "twig";

type TwigContext = Record<string, unknown>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIEWS_ROOT = path.resolve(__dirname, "../views");

const TEMPLATE_NAME_REGEX = /^[A-Za-z0-9/_-]+$/;

function resolveTemplatePath(templateName: string): string {
  if (!TEMPLATE_NAME_REGEX.test(templateName)) {
    throw new Error(`Nieprawidłowa nazwa szablonu Twig: "${templateName}"`);
  }

  const safePath = path.resolve(VIEWS_ROOT, `${templateName}.twig`);

  if (!safePath.startsWith(VIEWS_ROOT)) {
    throw new Error("Próba dostępu do szablonu poza katalogiem views");
  }

  return safePath;
}

export async function renderTwig(templateName: string, context: TwigContext = {}): Promise<string> {
  const templatePath = resolveTemplatePath(templateName);

  return await new Promise<string>((resolve, reject) => {
    Twig.renderFile(templatePath, context, (error, html) => {
      if (error) {
        reject(new Error(`Błąd renderowania szablonu Twig (${templateName}): ${error.message}`));
        return;
      }

      if (typeof html !== "string") {
        reject(new Error(`Szablon Twig (${templateName}) nie zwrócił poprawnego HTML`));
        return;
      }

      resolve(html);
    });
  });
}

export function getTwigViewsRoot(): string {
  return VIEWS_ROOT;
}
