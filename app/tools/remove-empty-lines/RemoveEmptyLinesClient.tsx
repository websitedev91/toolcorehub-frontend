// app/tools/remove-empty-lines/RemoveEmptyLinesClient.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";

type ProcessingOptions = {
  removeWhitespaceOnly: boolean;
  trimLines: boolean;
  collapseBlankLines: boolean;
  removeDuplicates: boolean;
  ignorePrefix: string;
};

type Stats = {
  originalLines: number;
  cleanedLines: number;
  removedLines: number;
  inputChars: number;
  inputLines: number;
};

const DEFAULT_OPTIONS: ProcessingOptions = {
  removeWhitespaceOnly: true,
  trimLines: true,
  collapseBlankLines: false,
  removeDuplicates: false,
  ignorePrefix: "#",
};

function processText(input: string, options: ProcessingOptions) {
  const {
    removeWhitespaceOnly,
    trimLines,
    collapseBlankLines,
    removeDuplicates,
    ignorePrefix,
  } = options;

  if (!input) {
    const emptyStats: Stats = {
      originalLines: 0,
      cleanedLines: 0,
      removedLines: 0,
      inputChars: 0,
      inputLines: 0,
    };
    return { text: "", stats: emptyStats };
  }

  const lines = input.split("\n");
  const originalLinesCount = lines.length;

  const seen = new Set<string>();
  const cleaned: string[] = [];
  const trimmedIgnorePrefix = ignorePrefix.trim();
  let blankRunCount = 0;
  let removedLinesCount = 0;

  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];

    if (trimLines) {
      line = line.trimEnd();
      line = line.trimStart();
    }

    const isIgnoredLine =
      trimmedIgnorePrefix.length > 0 && line.startsWith(trimmedIgnorePrefix);
    const isWhitespaceOnly = line.trim().length === 0;

    if (isIgnoredLine) {
      cleaned.push(line);
      blankRunCount = 0;
      continue;
    }

    if (collapseBlankLines) {
      if (isWhitespaceOnly) {
        if (blankRunCount === 0) {
          cleaned.push("");
          blankRunCount = 1;
        } else {
          removedLinesCount += 1;
        }
        continue;
      }
    } else if (removeWhitespaceOnly && isWhitespaceOnly) {
      removedLinesCount += 1;
      continue;
    }

    blankRunCount = 0;

    if (removeDuplicates) {
      if (seen.has(line)) {
        removedLinesCount += 1;
        continue;
      }
      seen.add(line);
    }

    cleaned.push(line);
  }

  const cleanedText = cleaned.join("\n");
  const cleanedLinesCount =
    cleanedText.length > 0 ? cleanedText.split("\n").length : 0;

  const stats: Stats = {
    originalLines: originalLinesCount,
    cleanedLines: cleanedLinesCount,
    removedLines: Math.max(
      removedLinesCount +
        (originalLinesCount - cleanedLinesCount - removedLinesCount),
      0
    ),
    inputChars: input.length,
    inputLines: originalLinesCount,
  };

  return { text: cleanedText, stats };
}

const RemoveEmptyLinesClient: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [stats, setStats] = useState<Stats>({
    originalLines: 0,
    cleanedLines: 0,
    removedLines: 0,
    inputChars: 0,
    inputLines: 0,
  });

  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Debounced processing
  useEffect(() => {
    setIsProcessing(true);

    const handle = window.setTimeout(() => {
      const result = processText(inputText, DEFAULT_OPTIONS);
      setOutputText(result.text);
      setStats(result.stats);
      setIsProcessing(false);
    }, 200);

    return () => {
      window.clearTimeout(handle);
    };
  }, [inputText]);

  const handleCopy = useCallback(async () => {
    if (!outputText) {
      setCopyMessage("Nothing to copy yet. Paste some text first.");
      window.setTimeout(() => setCopyMessage(null), 2600);
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(outputText);
        setCopyMessage("Cleaned text copied to clipboard.");
      } else {
        setCopyMessage(
          "Clipboard not available in this browser. Please select and copy manually."
        );
      }
    } catch {
      setCopyMessage(
        "Clipboard access failed. Please select the output and copy it yourself."
      );
    }

    window.setTimeout(() => setCopyMessage(null), 2600);
  }, [outputText]);

  const handleDownload = useCallback(() => {
    const textToDownload = outputText || "";
    const blob = new Blob([textToDownload], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "clean-text-lines.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [outputText]);

  const handleClearInput = useCallback(() => {
    setInputText("");
    setOutputText("");
    setStats({
      originalLines: 0,
      cleanedLines: 0,
      removedLines: 0,
      inputChars: 0,
      inputLines: 0,
    });
    setCopyMessage(null);
  }, []);

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter triggers copy
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleCopy();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCopy]);

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8 mt-6">
        <h1 className="text-3xl md:text-2xl font-semibold text-white mb-3">
          Remove Empty Lines
        </h1>
        <p className="text-sm md:text-base font-medium text-slate-100">
          Paste messy text, delete blank lines, clean text lines on the fly, and
          copy a tidy version in seconds without touching a single regex.
        </p>
      </div>

      {/* Tool layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input card */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl shadow-lg shadow-black/30 p-4 md:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm md:text-base font-medium text-slate-100">
              Input text
            </div>
            <div className="text-xs md:text-sm text-slate-400">
              Characters:{" "}
              <span className="text-slate-100 font-medium">
                {stats.inputChars}
              </span>{" "}
              · Lines:{" "}
              <span className="text-slate-100 font-medium">
                {stats.inputLines}
              </span>
            </div>
          </div>

          <textarea
            className="w-full min-h-[260px] bg-slate-950/70 border border-slate-700/60 rounded-xl px-3 py-2 text-sm md:text-base text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70 placeholder:text-slate-500 resize-y"
            placeholder={
              "Paste your text here. The tool will remove empty or whitespace only lines, clean text lines, and show the results on the right."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Output card */}
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl shadow-lg shadow-black/30 p-4 md:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm md:text-base font-medium text-slate-100">
              Cleaned output
            </div>
            <div className="text-[11px] md:text-xs text-slate-400">
              Original:{" "}
              <span className="text-slate-100 font-semibold">
                {stats.originalLines}
              </span>{" "}
              · Cleaned:{" "}
              <span className="text-emerald-300 font-semibold">
                {stats.cleanedLines}
              </span>{" "}
              · Removed:{" "}
              <span className="text-rose-300 font-semibold">
                {stats.removedLines}
              </span>
            </div>
          </div>

          <div className="relative">
            {isProcessing && (
              <div className="absolute inset-0 rounded-xl bg-slate-950/40 pointer-events-none" />
            )}
            {inputText.trim().length === 0 && !outputText ? (
              <div className="w-full min-h-[260px] bg-slate-950/70 border border-slate-700/60 rounded-xl px-3 py-3 text-sm md:text-base text-slate-400 font-mono flex items-center">
                Cleaned text will appear here after you paste something on the
                left. This is where you will see the text without empty or
                duplicate lines.
              </div>
            ) : (
              <textarea
                className="w-full min-h-[260px] bg-slate-950/70 border border-slate-700/60 rounded-xl px-3 py-2 text-sm md:text-base text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500/70 resize-y"
                value={outputText}
                readOnly
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center px-4 py-2 text-sm md:text-sm font-medium rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-500/30 transition-colors"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center px-4 py-2 text-sm md:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600/80 transition-colors"
              >
                Download as .txt
              </button>
              <button
                type="button"
                onClick={handleClearInput}
                className="inline-flex items-center justify-center px-4 py-2 text-sm md:text-sm font-medium rounded-lg bg-transparent border border-slate-600/80 text-slate-300 hover:bg-slate-800/60 transition-colors"
              >
                Clear input
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[11px] md:text-xs text-slate-400">
                Shortcut:{" "}
                <span className="font-semibold text-slate-200">
                  Ctrl + Enter
                </span>{" "}
                on Windows or{" "}
                <span className="font-semibold text-slate-200">
                  Cmd + Enter
                </span>{" "}
                on Mac will instantly copy the cleaned text.
              </p>
              {copyMessage && (
                <p className="text-[11px] md:text-xs text-emerald-300">
                  {copyMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveEmptyLinesClient;
