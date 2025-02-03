import React, { useState, useEffect, useRef } from "react";
import { Send, Copy, Check, Play, Pause, RotateCcw } from "lucide-react";

// JSON Stream Parser from previous implementation
function* parseJsonStream(streamData) {
  let buffer = "";
  let bracketCount = 0;
  let inString = false;
  let escapeNext = false;

  for (let char of streamData) {
    buffer += char;

    if (char === '"' && !escapeNext) {
      inString = !inString;
    }

    if (char === "\\" && !escapeNext) {
      escapeNext = true;
      continue;
    }
    escapeNext = false;

    if (!inString) {
      if (char === "{") {
        bracketCount++;
      } else if (char === "}") {
        bracketCount--;

        if (bracketCount === 0) {
          try {
            const jsonObj = JSON.parse(buffer);
            yield jsonObj;
            buffer = "";
          } catch (e) {
            console.error("Failed to parse JSON object:", e);
          }
        }
      }
    }
  }
}

const JsonViewer = ({ data }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (path) => {
    setExpanded((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderValue = (value, path) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === "boolean")
      return <span className="text-purple-600">{value.toString()}</span>;
    if (typeof value === "number")
      return <span className="text-blue-600">{value}</span>;
    if (typeof value === "string")
      return <span className="text-green-600">"{value}"</span>;

    const isArray = Array.isArray(value);
    const isEmpty = isArray
      ? value.length === 0
      : Object.keys(value).length === 0;

    if (isEmpty) {
      return <span className="text-gray-500">{isArray ? "[]" : "{}"}</span>;
    }

    const isExpanded = expanded[path];

    return (
      <div className="ml-4">
        <div
          className="cursor-pointer inline-flex items-center hover:text-blue-500"
          onClick={() => toggleExpand(path)}
        >
          {isExpanded ? (
            <div className="transform rotate-90 transition-transform">▶</div>
          ) : (
            <div className="transition-transform">▶</div>
          )}
          <span className="text-gray-700">{isArray ? "[" : "{"}</span>
        </div>

        {isExpanded && (
          <div className="ml-4">
            {isArray
              ? value.map((item, idx) => (
                  <div key={idx} className="my-1">
                    {renderValue(item, `${path}.${idx}`)}
                  </div>
                ))
              : Object.entries(value).map(([key, val], idx) => (
                  <div key={idx} className="my-1">
                    <span className="text-red-600">"{key}"</span>:{" "}
                    {renderValue(val, `${path}.${key}`)}
                  </div>
                ))}
          </div>
        )}

        <div className="ml-4 text-gray-700">{isArray ? "]" : "}"}</div>
      </div>
    );
  };

  return <div className="font-mono text-sm">{renderValue(data, "root")}</div>;
};

export const ApiStreamClient = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [requestBody, setRequestBody] = useState("");
  const [responses, setResponses] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [copyStatus, setCopyStatus] = useState(false);
  const abortControllerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponses([]);
    setIsStreaming(true);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "text/event-stream;charset=UTF-8",
          Authorization:
            "Bearer 8e7fd8cba3442ce97ad644c92b86ffd6-1ea8735481-ed8049ff299a7236d7290c4f94fe444c49ce2c1a6c49c52458",
        },
        body: method !== "GET" ? requestBody : undefined,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        for (const jsonObj of parseJsonStream(buffer)) {
          setResponses((prev) => [...prev, jsonObj]);
        }
      }

      if (buffer) {
        for (const jsonObj of parseJsonStream(buffer)) {
          setResponses((prev) => [...prev, jsonObj]);
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request cancelled");
      } else {
        setError(err.message);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(responses, null, 2));
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleClear = () => {
    setResponses([]);
    setError(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 p-4">
      {/* Request Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            API Stream Client
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md w-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter API endpoint URL"
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {method !== "GET" && (
              <div>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder="Enter request body (JSON)"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isStreaming}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Send size={16} />
                Send Request
              </button>
              {isStreaming && (
                <button
                  type="button"
                  onClick={handleStop}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <Pause size={16} />
                  Stop
                </button>
              )}
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <RotateCcw size={16} />
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Response Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Response</h3>
          <div className="flex gap-2 items-center">
            {isStreaming && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Streaming...</span>
              </div>
            )}
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Copy to clipboard"
            >
              {copyStatus ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <Copy size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="p-6 overflow-auto max-h-96">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : responses.length > 0 ? (
            responses.map((item, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="text-xs text-gray-500 mb-1">
                  Response {index + 1}
                </div>
                <JsonViewer data={item} />
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No response data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiStreamClient;
