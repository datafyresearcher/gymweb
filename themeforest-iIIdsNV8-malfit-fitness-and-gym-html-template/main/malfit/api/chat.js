function sanitizeText(value, limit = 2000) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, limit);
}

function getOutputText(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const output = Array.isArray(response?.output) ? response.output : [];
  const textParts = [];

  output.forEach((item) => {
    if (!Array.isArray(item?.content)) {
      return;
    }

    item.content.forEach((contentItem) => {
      if (contentItem?.type === "output_text" && typeof contentItem.text === "string") {
        textParts.push(contentItem.text);
      }
    });
  });

  return textParts.join("\n").trim();
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5.2";

  if (!apiKey) {
    return res.status(500).json({
      message: "Chatbot is not configured yet. Please add OPENAI_API_KEY in Vercel.",
    });
  }

  const message = sanitizeText(req.body?.message, 800);
  const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
  const history = rawHistory
    .slice(-12)
    .map((item) => ({
      role: item?.role === "assistant" ? "assistant" : "user",
      content: sanitizeText(item?.content, 800),
    }))
    .filter((item) => item.content);

  if (!message) {
    return res.status(400).json({ message: "Please provide a chat message." });
  }

  const businessContext = [
    "You are the Lifestyle Reset website assistant for a gym in Lahore, Pakistan.",
    "Business name: Lifestyle Reset.",
    "Address: 6th Avenue Commercial Plaza, LDA Avenue-01, 2nd Floor, Raiwind Rd, Lahore.",
    "Phone: 0323-4222747.",
    "Email: lifestylereset747@gmail.com.",
    "Opening hours: Monday-Friday 9 AM - 8 PM. Saturday-Sunday 10 AM - 4 PM.",
    "Programs mentioned on the website include gym training, strength, HIIT class, CrossFit, yoga, pilates, cardio, and nutrition coaching.",
    "Primary goal: help visitors understand the gym, encourage them to contact or join, and answer only with information supported by the provided context.",
    "If the website does not provide a specific answer, say so plainly and suggest contacting the gym by phone or email.",
    "Keep replies concise, friendly, and practical. Avoid making up prices, schedules, trainer biographies, or policies.",
  ].join(" ");

  const input = [
    {
      role: "developer",
      content: businessContext,
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
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        reasoning: { effort: "low" },
        input,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const apiMessage =
        result?.error?.message || "We could not get a chatbot response right now.";
      return res.status(response.status).json({ message: apiMessage });
    }

    const reply = getOutputText(result);

    if (!reply) {
      return res.status(500).json({
        message: "The chatbot returned an empty response. Please try again.",
      });
    }

    return res.status(200).json({ message: reply });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "The chatbot is temporarily unavailable. Please try again later.",
    });
  }
};
