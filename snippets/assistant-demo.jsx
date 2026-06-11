export const MintlifyAssistant = () => {
  const styles = {
    shell: {
      border: "1px solid rgba(148, 163, 184, 0.35)",
      borderRadius: 20,
      display: "grid",
      gap: 20,
      marginTop: 24,
      overflow: "hidden",
      padding: 20,
    },
    header: {
      alignItems: "center",
      display: "flex",
      gap: 16,
      justifyContent: "space-between",
    },
    content: {
      display: "grid",
      gap: 16,
      width: "100%",
    },
    configRow: {
      display: "flex",
      gap: 14,
      width: "100%",
    },
    configField: {
      boxSizing: "border-box",
      flex: "1 1 0",
      minWidth: 0,
    },
    assistantPanel: {
      background: "#ffffff",
      border: "1px solid rgba(148, 163, 184, 0.28)",
      borderRadius: 18,
      boxSizing: "border-box",
      display: "grid",
      gap: 14,
      padding: 16,
    },
    eyebrow: {
      color: "#7719AA",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.08em",
      margin: 0,
      textTransform: "uppercase",
    },
    title: {
      fontSize: 28,
      lineHeight: 1.1,
      margin: "6px 0",
    },
    description: {
      color: "#64748b",
      margin: 0,
    },
    controls: {
      display: "grid",
      alignContent: "start",
      gap: 16,
    },
    label: {
      color: "#334155",
      display: "grid",
      fontSize: 14,
      fontWeight: 700,
      gap: 8,
    },
    input: {
      border: "1px solid rgba(148, 163, 184, 0.55)",
      borderRadius: 12,
      boxSizing: "border-box",
      font: "inherit",
      outline: "none",
      padding: "10px 12px",
      width: "100%",
    },
    textarea: {
      minHeight: 96,
      resize: "vertical",
    },
    composerInput: {
      border: 0,
      boxSizing: "border-box",
      flex: "1 1 auto",
      font: "inherit",
      minHeight: 34,
      outline: "none",
      padding: "0 8px 0 0",
      resize: "none",
      width: "100%",
    },
    button: {
      alignItems: "center",
      background: "#7719AA",
      border: 0,
      borderRadius: 12,
      color: "#ffffff",
      cursor: "pointer",
      display: "inline-flex",
      fontWeight: 700,
      justifyContent: "center",
      padding: "12px 16px",
    },
    error: {
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: 12,
      color: "#991b1b",
      padding: 12,
    },
    chat: {
      background: "#f8fafc",
      border: "1px solid rgba(148, 163, 184, 0.28)",
      borderRadius: 14,
      display: "grid",
      gap: 14,
      alignContent: "start",
      minHeight: 320,
      maxHeight: 480,
      overflowY: "auto",
      padding: 18,
    },
    composer: {
      alignItems: "center",
      border: "1px solid rgba(148, 163, 184, 0.45)",
      borderRadius: 15,
      display: "flex",
      gap: 10,
      padding: "12px 12px 12px 18px",
    },
    composerActions: {
      alignItems: "center",
      display: "flex",
      flex: "0 0 auto",
      gap: 10,
    },
    shortcut: {
      color: "#94a3b8",
      fontSize: 13,
      whiteSpace: "nowrap",
    },
    sendButton: {
      alignItems: "center",
      background: "#7719AA",
      border: 0,
      borderRadius: 16,
      color: "#ffffff",
      cursor: "pointer",
      display: "inline-flex",
      fontSize: 20,
      fontWeight: 800,
      height: 38,
      justifyContent: "center",
      lineHeight: 1,
      padding: 0,
      transition:
        "background 160ms ease, opacity 160ms ease, transform 160ms ease",
      width: 38,
    },
    messageRow: {
      display: "flex",
    },
    message: {
      borderRadius: 16,
      maxWidth: "92%",
      minWidth: 0,
      padding: "12px 14px",
    },
    userMessage: {
      background: "#7719AA",
      color: "#ffffff",
    },
    assistantMessage: {
      background: "#ffffff",
      color: "#0f172a",
    },
    messageLabel: {
      display: "block",
      fontSize: 12,
      fontWeight: 800,
      marginBottom: 4,
      opacity: 0.78,
      textTransform: "uppercase",
    },
    messageText: {
      lineHeight: 1.55,
      margin: 0,
      overflowWrap: "anywhere",
      whiteSpace: "pre-wrap",
      wordBreak: "normal",
    },
  };

  const initialMessages = [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Enter your assistant key and Mintlify subdomain, then ask a question to test the assistant.",
    },
  ];

  const [assistantKey, setAssistantKey] = useState("");
  const [subdomain, setSubdomain] = useState("morsemicro");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const enterHandledRef = useRef(false);

  const canSubmit = Boolean(
    assistantKey.trim() && subdomain.trim() && query.trim() && !isLoading,
  );

  const makeMessage = (role, content) => {
    return {
      id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role,
      content,
    };
  };

  const readChunkText = (chunk) => {
    if (!chunk) {
      return "";
    }

    if (chunk.type === "text-delta") {
      return chunk.delta || chunk.textDelta || chunk.text || "";
    }

    if (chunk.type === "text") {
      return chunk.text || "";
    }

    if (chunk.type === "message" && Array.isArray(chunk.parts)) {
      return chunk.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");
    }

    if (chunk.message) {
      return readChunkText(chunk.message);
    }

    if (typeof chunk.content === "string") {
      return chunk.content;
    }

    return "";
  };

  const parseStreamLine = (line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine === "data: [DONE]") {
      return "";
    }

    const payload = trimmedLine.startsWith("data:")
      ? trimmedLine.slice(5).trim()
      : trimmedLine;

    if (!payload || payload === "[DONE]") {
      return "";
    }

    try {
      return readChunkText(JSON.parse(payload));
    } catch {
      // AI SDK data streams can also emit prefixed lines like 0:"hello".
    }

    const separatorIndex = payload.indexOf(":");
    if (separatorIndex > 0) {
      const prefix = payload.slice(0, separatorIndex);
      const value = payload.slice(separatorIndex + 1);

      if (prefix === "0") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
    }

    return "";
  };

  const readAssistantResponse = async (response, onText) => {
    if (!response.body) {
      const body = await response.text();
      onText(body);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const text = parseStreamLine(line);
        if (text) {
          onText(text);
        }
      }
    }

    const remainingText = parseStreamLine(buffer);
    if (remainingText) {
      onText(remainingText);
    }
  };

  const sendQuery = async (queryText) => {
    const trimmedAssistantKey = assistantKey.trim();
    const trimmedSubdomain = subdomain.trim();
    const trimmedQuery = queryText.trim();

    if (isLoading) {
      return;
    }

    if (!trimmedAssistantKey || !trimmedSubdomain || !trimmedQuery) {
      setError("Enter an assistant key, subdomain, and question first.");
      return;
    }

    const userMessage = makeMessage("user", trimmedQuery);
    const assistantMessage = makeMessage("assistant", "");
    const nextMessages = [...messages, userMessage, assistantMessage];

    setMessages(nextMessages);
    setQuery("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.mintlify.com/discovery/v2/assistant/${encodeURIComponent(
          trimmedSubdomain,
        )}/message`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${trimmedAssistantKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fp: "docs-demo",
            retrievalPageSize: 5,
            messages: nextMessages
              .filter((message) => message.id !== "welcome" && message.content)
              .map((message) => ({
                id: message.id,
                role: message.role,
                parts: [{ type: "text", text: message.content }],
              })),
            currentPath:
              typeof window === "undefined"
                ? undefined
                : window.location.pathname,
          }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          body || `Request failed with status ${response.status}`,
        );
      }

      await readAssistantResponse(response, (text) => {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: `${message.content}${text}` }
              : message,
          ),
        );
      });
    } catch (requestError) {
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== assistantMessage.id),
      );
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The assistant request failed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendQuery(query);
  };

  const handleComposerSend = async () => {
    await sendQuery(query);
  };

  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Morse Micro Assistant Demo</h2>
        </div>
      </div>

      <div style={styles.content}>
        <form onSubmit={handleSubmit} style={styles.controls}>
          <div style={styles.configRow}>
            <label style={{ ...styles.label, ...styles.configField }}>
              Assistant Key
              <input
                value={assistantKey}
                onChange={(event) => setAssistantKey(event.target.value)}
                placeholder="mint_dsc_..."
                style={styles.input}
                type="text"
              />
            </label>

            <label style={{ ...styles.label, ...styles.configField }}>
              Subdomain
              <input
                value={subdomain}
                onChange={(event) => setSubdomain(event.target.value)}
                placeholder="your-docs-subdomain"
                style={styles.input}
                type="text"
              />
            </label>
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}

          <div aria-live="polite" style={styles.chat}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageRow,
                  justifyContent:
                    message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.message,
                    ...(message.role === "user"
                      ? styles.userMessage
                      : styles.assistantMessage),
                  }}
                >
                  <span style={styles.messageLabel}>
                    {message.role === "user" ? "You" : "Assistant"}
                  </span>
                  <p style={styles.messageText}>
                    {message.content || "Thinking..."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.composer}>
            <textarea
              aria-label="Ask a question"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  enterHandledRef.current = true;
                  sendQuery(event.currentTarget.value);
                }
              }}
              onKeyUp={(event) => {
                if (event.key !== "Enter") {
                  enterHandledRef.current = false;
                  return;
                }

                if (event.shiftKey) {
                  enterHandledRef.current = false;
                  return;
                }

                if (!enterHandledRef.current) {
                  event.preventDefault();
                  sendQuery(event.currentTarget.value);
                }

                enterHandledRef.current = false;
              }}
              placeholder="Ask a question..."
              rows={1}
              style={styles.composerInput}
            />

            <div style={styles.composerActions}>
              <button
                aria-label="Send query"
                onClick={handleComposerSend}
                style={{
                  ...styles.sendButton,
                  background:
                    query.trim() && !isLoading ? "#7719AA" : "#D9A9EF",
                  cursor: isLoading ? "wait" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                  transform:
                    query.trim() && !isLoading ? "translateY(-1px)" : "none",
                }}
                type="button"
              >
                ↑
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
