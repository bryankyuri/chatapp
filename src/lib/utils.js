import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, parse } from "date-fns";
import {
  Send,
  FileText,
  Download,
  Eye,
  FileSpreadsheet,
  FileImage,
  File,
} from "lucide-react";
import DOMPurify from "dompurify";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const debugVariant = (name, params, result) => {
  console.group(`Variant Debug: ${name}`);
  console.log("Parameters:", params);
  console.log("Generated Classes:", result);
  console.groupEnd();
  return result;
};
const getFileIcon = (extension) => {
  switch (extension.toLowerCase()) {
    case "doc":
    case "docx":
      return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-blue-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>';
    case "ppt":
    case "pptx":
      return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-orange-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6"/><path d="M8 18h8"/></svg>';
    case "xls":
    case "xlsx":
      return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-green-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M8 17h2"/><path d="M14 13h2"/><path d="M14 17h2"/></svg>';
    case "pdf":
      return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-red-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>';
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-gray-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>';
  }
};

export const getFileNameFromUrl = (url) =>{
  // Split the URL by '/' and get the last part
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];

  // Remove any query parameters or fragments (e.g., '?foo=bar' or '#section')
  return fileName.split('?')[0].split('#')[0];
}


const isDocumentUrl = (url) => /\.(doc|docx|ppt|pptx|xls|xlsx|pdf)$/i.test(url);
const getFileExtension = (url) => url.split(".").pop().toLowerCase();

const parseDocumentText = (text) => {
  const match = text.match(/Download format (\w+)\s*\(([\d.]+\s*\w+)\)/i);
  return match ? { format: match[1], size: match[2] } : null;
};

const patterns = {
  // Headings
  h1: {
    pattern: /^# (.*$)/gm,
    replace: '<h1 class="text-2xl font-bold mb-4">$1</h1>',
  },
  h2: {
    pattern: /^## (.*$)/gm,
    replace: '<h2 class="text-xl font-bold mb-3">$1</h2>',
  },
  h3: {
    pattern: /^### (.*$)/gm,
    replace: '<h3 class="text-lg font-bold mb-2">$1</h3>',
  },
  h4: {
    pattern: /^#### (.*$)/gm,
    replace: '<h4 class="text-base font-bold mb-2">$1</h4>',
  },

  // Lists
  bulletList: {
    pattern: /^\* (.*$)/gm,
    replace: '<li class="ml-4 list-disc">$1</li>',
  },
  numberList: {
    pattern: /^\d\. (.*$)/gm,
    replace: '<li class="ml-4 list-decimal">$1</li>',
  },

  // Text styling
  bold: {
    pattern: /\*\*(.*?)\*\*/g,
    replace: '<strong class="font-bold">$1</strong>',
  },
  italic: {
    pattern: /\*(.*?)\*/g,
    replace: '<em class="italic">$1</em>',
  },
  strikethrough: {
    pattern: /~~(.*?)~~/g,
    replace: '<del class="line-through">$1</del>',
  },

  // Code
  codeBlock: {
    pattern: /```([\s\S]*?)```/g,
    replace:
      '<pre class="bg-gray-100 p-3 rounded-lg mb-4 overflow-x-auto"><code>$1</code></pre>',
  },
  inlineCode: {
    pattern: /`([^`]+)`/g,
    replace:
      '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>',
  },

  // Blockquotes
  blockquote: {
    pattern: /^> (.*$)/gm,
    replace:
      '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic">$1</blockquote>',
  },
};

export const processMarkdown = (content) => {
  if (!content) return "";

  // Split content into lines for better processing
  let lines = content;
  Object.entries(patterns).forEach(([key, { pattern, replace }]) => {
    if (typeof replace === "string") {
      lines = lines.replace(pattern, replace);
    } else if (typeof replace === "function") {
      lines = lines.replace(pattern, replace);
    }
  });
  lines = lines.split("\n");
  let processed = [];
  let inList = false;
  let listItems = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines unless they're between paragraphs
    if (!line) {
      if (inList) {
        // End list if we encounter empty line
        if (listItems.length) {
          processed.push(
            `<ul class="list-disc pl-6 space-y-2 mb-4">${listItems.join(
              ""
            )}</ul>`
          );
          listItems = [];
          inList = false;
        }
      }
      continue;
    }

    // Process different markdown elements
    if (line.startsWith("![")) {
      // Image
      const imageMatch = line.match(
        /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/
      );
      if (imageMatch) {
        const [, alt, url, title = alt] = imageMatch;
        processed.push(`
          <div class="mb-4 bg-gray-50 p-3 rounded-lg">
            <div class="mb-2">
              <img src="${url}" alt="${alt}" class="rounded-lg max-h-64 object-contain w-full" />
            </div>
            <div class="flex items-center justify-between flex-col">
              <span class="text-sm text-gray-600 mt-2">${title}</span>
              <div class="my-4 flex gap-2">
                <button 
                  class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Preview
                </button>
                <a href="${url}" download class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download
                </a>
            </div>
          </div>
        `);
      }
    } else if (line.startsWith("- [")) {
      // Document link list item
      inList = true;
      const linkMatch = line.match(/- \[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const [, text, url] = linkMatch;
        if (isDocumentUrl(url)) {
          const extension = getFileExtension(url);
          const docInfo = parseDocumentText(text);
          const safeTitle = text.replace(/"/g, "&quot;");

          listItems.push(`
            <li>
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">${getFileIcon(extension)}</div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-base mb-1 truncate" title="${getFileNameFromUrl(url)}">${
                      docInfo ? getFileNameFromUrl(url) : text
                    }</h4>
                    <p class="text-sm text-gray-500 mb-2">${extension.toUpperCase()} Document ${
            docInfo ? `• ${docInfo.size}` : ""
          }</p>
                    <div class="flex flex-wrap gap-2">
                      <a
                        href="${extension === "pdf" ? url : `https://view.officeapps.live.com/op/embed.aspx?src=${url}`}" 
                        class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        target="_blank"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Preview
                      </a>
                      <a 
                        href="${url}" 
                        download
                        class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          `);
        }
      }
    } else if (line.startsWith("**") && line.endsWith("**")) {
      // Bold text
      const text = line.replace(/\*\*/g, "");
      processed.push(`<strong class="block text-base mb-4">${text}</strong>`);
    } else {
      // Regular text
      if (inList) {
        if (listItems.length) {
          processed.push(
            `<ul class="list-disc pl-6 space-y-2 mb-4">${listItems.join(
              ""
            )}</ul>`
          );
          listItems = [];
        }
        inList = false;
      }
      processed.push(`<p class="mb-4">${line}</p>`);
    }
  }

  // Add any remaining list items
  if (listItems.length) {
    processed.push(
      `<ul class="list-disc pl-6 space-y-2 mb-4">${listItems.join("")}</ul>`
    );
  }

  return processed.join("\n");
};
export const formatDate = (dateString) => {
  // Parse the custom date format
  const date = parse(dateString, "yyyy-MM-dd HH:mm:ss.SSS", new Date());

  if (isToday(date)) {
    return `Today at ${format(date, "HH:mm")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "HH:mm")}`;
  } else {
    return `${format(date, "dd MM yyyy")} at ${format(date, "HH:mm")}`;
  }
};
