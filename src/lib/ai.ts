import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are Bugsy, a friendly and helpful support assistant for collecting bug reports and feature requests. Keep your responses concise (1-3 sentences). Ask clarifying questions to understand the issue better. Help categorize whether it's a bug, feature request, feedback, or question. When you have enough information, suggest the user submit their feedback by clicking the Submit button.`;

function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

interface Message {
  sender: string;
  content: string;
}

function getRuleBasedResponse(messages: Message[], visitorMessage: string): string {
  const visitorCount = messages.filter((m) => m.sender === "VISITOR").length;
  const lower = visitorMessage.toLowerCase();

  if (visitorCount <= 1) {
    if (lower.includes("bug") || lower.includes("error") || lower.includes("broken")) {
      return "That sounds like a bug. Can you describe what you expected to happen vs what actually happened?";
    } else if (lower.includes("feature") || lower.includes("wish") || lower.includes("would be nice")) {
      return "A feature request! Can you describe how you'd like this to work?";
    } else {
      return "Thanks for reaching out! Can you give me more details about what you're experiencing?";
    }
  } else if (visitorCount === 2) {
    return "Got it, that's helpful. Any additional context? When you're ready, click 'Submit' to send this to the team.";
  } else {
    return "Thanks for the details. Feel free to add more, or click 'Submit' when you're ready.";
  }
}

export async function generateBugsyResponse(
  conversationHistory: Message[],
  visitorMessage: string
): Promise<string> {
  const client = getClient();
  if (!client) {
    return getRuleBasedResponse(conversationHistory, visitorMessage);
  }

  try {
    const messages: Anthropic.MessageParam[] = conversationHistory.map((m) => ({
      role: m.sender === "VISITOR" ? "user" as const : "assistant" as const,
      content: m.content,
    }));

    // Add the new visitor message
    messages.push({ role: "user", content: visitorMessage });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages,
    });

    const textBlock = response.content.find((b: { type: string }) => b.type === "text") as { type: "text"; text: string } | undefined;
    return textBlock?.text ?? getRuleBasedResponse(conversationHistory, visitorMessage);
  } catch (error) {
    console.error("AI response generation failed, falling back to rule-based:", error);
    return getRuleBasedResponse(conversationHistory, visitorMessage);
  }
}

interface Categorization {
  type: "BUG" | "FEATURE" | "FEEDBACK" | "QUESTION";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

function keywordCategorize(text: string): Categorization {
  const lower = text.toLowerCase();

  let type: Categorization["type"] = "FEEDBACK";
  if (lower.includes("bug") || lower.includes("error") || lower.includes("broken") || lower.includes("crash")) {
    type = "BUG";
  } else if (lower.includes("feature") || lower.includes("wish") || lower.includes("would be nice") || lower.includes("add")) {
    type = "FEATURE";
  } else if (lower.includes("?") || lower.includes("how do") || lower.includes("how to")) {
    type = "QUESTION";
  }

  let priority: Categorization["priority"] = "MEDIUM";
  if (lower.includes("urgent") || lower.includes("critical") || lower.includes("crash") || lower.includes("data loss")) {
    priority = "URGENT";
  } else if (lower.includes("important") || lower.includes("blocking")) {
    priority = "HIGH";
  } else if (lower.includes("minor") || lower.includes("cosmetic") || lower.includes("nice to have")) {
    priority = "LOW";
  }

  return { type, priority };
}

export async function categorizeRequest(conversationText: string): Promise<Categorization> {
  const client = getClient();
  if (!client) {
    return keywordCategorize(conversationText);
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 100,
      system: `Analyze the following support conversation and categorize it. Respond with ONLY a JSON object with two fields:
- "type": one of "BUG", "FEATURE", "FEEDBACK", "QUESTION"
- "priority": one of "LOW", "MEDIUM", "HIGH", "URGENT"

No other text, just the JSON object.`,
      messages: [{ role: "user", content: conversationText }],
    });

    const textBlock = response.content.find((b: { type: string }) => b.type === "text") as { type: "text"; text: string } | undefined;
    if (textBlock?.text) {
      const parsed = JSON.parse(textBlock.text.trim());
      const validTypes = ["BUG", "FEATURE", "FEEDBACK", "QUESTION"];
      const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
      if (validTypes.includes(parsed.type) && validPriorities.includes(parsed.priority)) {
        return parsed as Categorization;
      }
    }
    return keywordCategorize(conversationText);
  } catch (error) {
    console.error("AI categorization failed, falling back to keyword-based:", error);
    return keywordCategorize(conversationText);
  }
}
