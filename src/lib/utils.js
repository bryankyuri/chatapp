import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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


export const processMarkdown = (content) => {
  // Common markdown patterns
  const patterns = {
    // Headers
    h1: { pattern: /^# (.*$)/gm, replace: '<h1 class="text-2xl font-bold mb-4">$1</h1>' },
    h2: { pattern: /^## (.*$)/gm, replace: '<h2 class="text-xl font-bold mb-3">$1</h2>' },
    h3: { pattern: /^### (.*$)/gm, replace: '<h3 class="text-lg font-bold mb-2">$1</h3>' },
    
    // Lists
    bulletList: { 
      pattern: /^\* (.*$)/gm, 
      replace: '<li class="ml-4 mb-1 list-disc">$1</li>' 
    },
    numberList: { 
      pattern: /^\d\. (.*$)/gm, 
      replace: '<li class="ml-4 mb-1 list-decimal">$1</li>' 
    },
    
    // Code blocks
    codeBlock: { 
      pattern: /```([\s\S]*?)```/g, 
      replace: '<pre class="bg-gray-100 p-3 rounded-lg mb-4 overflow-x-auto"><code>$1</code></pre>' 
    },
    inlineCode: { 
      pattern: /`([^`]+)`/g, 
      replace: '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>' 
    },
    
    // Links
    links: { 
      pattern: /\[([^\]]+)\]\(([^)]+)\)/g, 
      replace: '<a href="$2" class="text-blue-500 hover:text-blue-600 underline">$1</a>' 
    },
    
    // Emphasis
    bold: { 
      pattern: /\*\*(.*?)\*\*/g, 
      replace: '<strong class="font-bold">$1</strong>' 
    },
    italic: { 
      pattern: /\*(.*?)\*/g, 
      replace: '<em class="italic">$1</em>' 
    },
    
    // Blockquotes
    blockquote: { 
      pattern: /^> (.*$)/gm, 
      replace: '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic">$1</blockquote>' 
    },

    // Paragraphs (process last)
    paragraphs: { 
      pattern: /^(?!<[a-z]|\s*$)(.*$)/gm, 
      replace: '<p class="mb-4">$1</p>' 
    }
  };

  let processed = content;
  
  // Apply each pattern
  Object.values(patterns).forEach(({ pattern, replace }) => {
    processed = processed.replace(pattern, replace);
  });

  // Clean up empty paragraphs and multiple line breaks
  processed = processed
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\n{2,}/g, '\n');

  return processed;
};