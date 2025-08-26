// Corrected JSON Schema for Structured Outputs (OpenAI Responses API)

export const ArticleListSchema = {
    type: "object",
    properties: {
        articles: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: false,
                properties: {
                    title: { type: "string" },
                    articleId: { type: "number" },
                },
                required: ["title", "articleId"],
            },
        },
    },
    required: ["articles"],
    additionalProperties: false,
};