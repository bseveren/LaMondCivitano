import OpenAI from "openai";
import 'dotenv/config';
import { OPENAI_API_KEY} from "../../env";

export interface CallOptions<TSchema> {
  model?: string;
  system: string;
  user: string;
  jsonSchema: { name: string; schema: unknown; strict?: boolean };
  useWebSearchTool?: boolean; // default true
}

/**
 * Wraps the OpenAI Responses API call with:
 * - optional hosted web_search tool
 * - Structured Outputs (JSON Schema)
 * - safe extraction of the JSON payload
 */
export async function callStructuredJSON<TOut>(opts: CallOptions<TOut>): Promise<TOut> {
  const {
    model = "gpt-4.1",
    system,
    user,
    jsonSchema,
    useWebSearchTool = true,
  } = opts;

  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY in env.");

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const response = await client.responses.create({
    model,
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    tools: useWebSearchTool ? [{ type: "web_search" }] : undefined,
    text: {
        format: { name: "json_schema", type: "json_schema", schema: jsonSchema },
    }
  });

  // Try single consolidated text first
  const anyResp = response as any;
  const direct = anyResp.output_text as string | undefined;
  if (direct && direct.trim().startsWith("{")) {
    return JSON.parse(direct) as TOut;
  }

  // Otherwise, walk the segments
  for (const item of anyResp.output ?? []) {
    if (item?.type === "message") {
      for (const c of item.content ?? []) {
        if (c?.type === "output_text" && typeof c.text === "string" && c.text.trim().startsWith("{")) {
          return JSON.parse(c.text) as TOut;
        }
      }
    }
  }

  throw new Error(
    "OpenAI call did not return JSON matching the schema. Full response: " +
      JSON.stringify(response, null, 2),
  );
}
