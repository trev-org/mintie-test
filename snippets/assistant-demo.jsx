export const MintlifyAssistant = () => {
  const initialMessages = [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Enter your assistant key and Mintlify subdomain, then ask a question to test the assistant.",
    },
  ];

  const [assistantKey, setAssistantKey] = useState("");
  const [subdomain, setSubdomain] = useState("morsemicrodemo");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const enterHandledRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const canSubmit = Boolean(
    assistantKey.trim() && subdomain.trim() && query.trim() && !isLoading,
  );

  if (!isMounted) {
    return (
      <div className="not-prose mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
        Loading assistant demo...
      </div>
    );
  }

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
    <div className="not-prose mt-6 grid gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="m-0 text-3xl font-bold leading-tight">
            Morse Micro Assistant Demo
          </h2>
        </div>
      </div>

      <div className="grid w-full gap-4">
        <form className="grid content-start gap-4" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <label className="grid min-w-0 flex-1 gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              Assistant Key
              <input
                className="w-full box-border rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-500"
                value={assistantKey}
                onChange={(event) => setAssistantKey(event.target.value)}
                placeholder="mint_dsc_..."
                type="text"
              />
            </label>

            <label className="grid min-w-0 flex-1 gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              Subdomain
              <input
                className="w-full box-border rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-500"
                value={subdomain}
                onChange={(event) => setSubdomain(event.target.value)}
                placeholder="your-docs-subdomain"
                type="text"
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-800 dark:border-red-400 dark:bg-red-950 dark:text-red-100">
              {error}
            </div>
          ) : null}

          <div
            aria-busy={isLoading}
            aria-live="polite"
            className="grid max-h-96 min-h-80 content-start gap-4 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900"
          >
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-3xl rounded-2xl bg-purple-700 px-4 py-3 text-white">
                    <span className="mb-1 block text-xs font-extrabold uppercase opacity-75">
                      You
                    </span>
                    <p className="m-0 whitespace-pre-wrap break-words leading-relaxed">
                      {message.content || "Thinking..."}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex justify-start">
                  <div className="max-w-3xl rounded-2xl bg-white px-4 py-3 text-slate-950 dark:bg-slate-800 dark:text-slate-50">
                    <span className="mb-1 block text-xs font-extrabold uppercase opacity-75">
                      Assistant
                    </span>
                    <p className="m-0 whitespace-pre-wrap break-words leading-relaxed">
                      {message.content || "Thinking..."}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-3 focus-within:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-slate-500">
            <textarea
              aria-label="Ask a question"
              className="min-h-9 flex-1 resize-none appearance-none rounded-none border-0 bg-transparent pr-2 text-slate-950 shadow-none outline-none ring-0 placeholder:text-slate-400 !border-0 !shadow-none !outline-none !ring-0 focus:!border-0 focus:!shadow-none focus:!outline-none focus:!ring-0 focus-visible:!border-0 focus-visible:!shadow-none focus-visible:!outline-none focus-visible:!ring-0 dark:text-slate-50 dark:placeholder:text-slate-500"
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
            />

            <div className="flex shrink-0 items-center gap-3">
              <button
                aria-label="Send query"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-700 text-xl font-extrabold leading-none text-white transition hover:-translate-y-px hover:bg-purple-800 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:bg-purple-300 disabled:opacity-70 dark:disabled:bg-purple-950"
                disabled={!canSubmit}
                onClick={handleComposerSend}
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
