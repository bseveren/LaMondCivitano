// schema.ts
// JSON Schema for Structured Outputs (OpenAI Responses API)

export const NewsSourceListSchema = {
  name: "NewsSourceList",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      country: { type: "string" },
      requested_count: { type: "integer", minimum: 1, maximum: 200 },
      sites: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            homepage: { type: "string", format: "uri" },
            country: { type: "string" },
            language: { type: "string" },
            category: {
              type: "string",
              enum: [
                "national",
                "regional/local",
                "tabloid",
                "business",
                "sports",
                "tech",
                "culture/arts",
                "investigative",
                "other",
              ],
            },
            free_access: { type: "boolean" },
            robots_txt: { type: "string", format: "uri" },
            robots_status: {
              type: "string",
              enum: ["allowed", "likely_allowed", "unclear", "disallowed"],
            },
            rss_feeds: {
              type: "array",
              items: { type: "string", format: "uri" },
            },
            popularity_hint: { type: "string" },
            evidence: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  url: { type: "string", format: "uri" },
                  note: { type: "string" },
                },
                required: ["url"],
              },
            },
            notes: { type: "string" },
          },
          required: [
            "name",
            "homepage",
            "country",
            "category",
            "free_access",
            "robots_txt",
            "robots_status",
            "rss_feeds",
            "evidence",
          ],
        },
      },
    },
    required: ["country", "requested_count", "sites"],
  },
  strict: true,
} as const;
