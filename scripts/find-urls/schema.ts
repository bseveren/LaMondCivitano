// JSON Schema for Structured Outputs (OpenAI Responses API)

export const NewsSourceListSchema = {
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
            homepage: { type: "string" },
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
            robots_status: {
              type: "string",
              enum: ["allowed", "likely_allowed", "unclear", "disallowed"],
            },
            rss_feeds: {
              type: "array",
              items: { type: "string" },
            },
            popularity_hint: { type: "string" },
          },
          required: [
            "homepage",
            "country",
          "language",
              "popularity_hint",
            "category",
            "free_access",
            "robots_status",
            "rss_feeds",
          ],
        },
      },
    },
    required: ["country", "requested_count", "sites"],
};
