const { buildKnowledgePrompt, answerFromKnowledge } = require("./chat-knowledge");

function sanitizeText(value, limit = 2000) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, limit);
}

function getOpenRouterText(result) {
  const content = result?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item?.text === "string" ? item.text : ""))
      .join("\n")
      .trim();
  }

  return "";
}

async function requestOpenRouterChat({ apiKey, siteUrl, siteTitle, model, messages }) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": siteUrl,
      "X-Title": siteTitle,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 350,
    }),
  });

  const result = await response.json();
  return { response, result };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const message = sanitizeText(req.body?.message, 800);
  const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
  const history = rawHistory
    .slice(-10)
    .map((item) => ({
      role: item?.role === "assistant" ? "assistant" : "user",
      content: sanitizeText(item?.content, 800),
    }))
    .filter((item) => item.content);

  if (!message) {
    return res.status(400).json({ message: "Please provide a chat message." });
  }

  const fallbackReply = answerFromKnowledge(message);
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model =
    process.env.OPENROUTER_MODEL || "qwen/qwen3-next-80b-a3b-instruct:free";
  const fallbackModel = process.env.OPENROUTER_FALLBACK_MODEL || "openrouter/free";
  const siteUrl =
    process.env.OPENROUTER_SITE_URL || "https://www.lifestylereset.com.pk";
  const siteTitle = process.env.OPENROUTER_SITE_TITLE || "Lifestyle Reset";

  const systemPrompt = [
    "You are the Lifestyle Reset website assistant for a gym in Lahore, Pakistan.",
    "Answer only with details supported by the verified website context provided to you.",
    "Be friendly, concise, and practical.",
    "Do not invent schedules, policies, offers, class slots, trainer credentials, or pricing details.",
    "If the website information is missing or pricing appears inconsistent, say that clearly and suggest confirming by phone at 0323-4222747 or by email at lifestylereset747@gmail.com.",
    buildKnowledgePrompt(message),
  ].join("\n\n");

  if (!apiKey) {
    return res.status(200).json({
      message: fallbackReply,
      provider: "demo",
      model: "knowledge-base-demo",
    });
  }

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...history.map((item) => ({
      role: item.role,
      content: item.content,
    })),
    {
      role: "user",
      content: message,
    },
  ];

  try {
    const attemptedModels = [];
    let activeModel = model;
    let { response, result } = await requestOpenRouterChat({
      apiKey,
      siteUrl,
      siteTitle,
      model: activeModel,
      messages,
    });
    attemptedModels.push(activeModel);

    const shouldRetryWithFallback =
      !response.ok &&
      fallbackModel &&
      fallbackModel !== activeModel &&
      [429, 502, 503, 504].includes(response.status);

    if (shouldRetryWithFallback) {
      activeModel = fallbackModel;
      ({ response, result } = await requestOpenRouterChat({
        apiKey,
        siteUrl,
        siteTitle,
        model: activeModel,
        messages,
      }));
      attemptedModels.push(activeModel);
    }

    if (!response.ok) {
      return res.status(200).json({
        message: fallbackReply,
        provider: "demo",
        model: "knowledge-base-demo",
        warning:
          result?.error?.message ||
          "OpenRouter is unavailable right now, so demo knowledge mode was used.",
        attemptedModels,
      });
    }

    const reply = getOpenRouterText(result);

    if (!reply) {
      return res.status(200).json({
        message: fallbackReply,
        provider: "demo",
        model: "knowledge-base-demo",
        warning: "OpenRouter returned an empty reply, so demo knowledge mode was used.",
        attemptedModels,
      });
    }

    return res.status(200).json({
      message: reply,
      provider: "openrouter",
      model: activeModel,
      attemptedModels,
    });
  } catch (error) {
    return res.status(200).json({
      message: fallbackReply,
      provider: "demo",
      model: "knowledge-base-demo",
      warning:
        error instanceof Error
          ? error.message
          : "OpenRouter is temporarily unavailable, so demo knowledge mode was used.",
    });
  }
};
