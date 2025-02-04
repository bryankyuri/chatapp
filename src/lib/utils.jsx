import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, parse } from "date-fns";
import { Send, FileText, Download, Eye, FileSpreadsheet, FileImage, File } from 'lucide-react';
import DOMPurify from 'dompurify';

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

const isDocumentUrl = (url) => {
  return /\.(doc|docx|ppt|pptx|xls|xlsx|pdf)$/i.test(url);
};

const getFileExtension = (url) => {
  return url.split('.').pop().toLowerCase();
};

const getFileIcon = (extension) => {
  switch(extension) {
    case 'doc':
    case 'docx':
      return <File className="w-8 h-8 text-blue-600" />;
    case 'ppt':
    case 'pptx':
      return <FileImage className="w-8 h-8 text-orange-600" />;
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    case 'pdf':
      return <FileText className="w-8 h-8 text-red-600" />;
    default:
      return <File className="w-8 h-8 text-gray-600" />;
  }
};

const DocumentPreview = ({ url, title, extension }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (isPreviewOpen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
              className="w-full h-full border-0"
              title={title}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const processMarkdown = (content) => {
  // Common markdown patterns

  const patterns = {
    // Headers
    h1: { pattern: /^# (.*$)/gm, replace: '<h1 class="text-2xl font-bold mb-4">$1</h1>' },
    h2: { pattern: /^## (.*$)/gm, replace: '<h2 class="text-xl font-bold mb-3">$1</h2>' },
    h3: { pattern: /^### (.*$)/gm, replace: '<h3 class="text-lg font-bold mb-2">$1</h3>' },
    
    // Images with download button
    images: {
      pattern: /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      replace: (match, alt, url, title = alt) => `
        <div class="mb-4 bg-gray-50 p-3 rounded-lg">
          <div class="mb-2">
            <img src="${url}" alt="${alt}" class="rounded-lg max-h-64 object-contain w-full" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">${title}</span>
          </div>
        </div>`
    },
    
    // Regular links
    links: { 
      pattern: /\[([^\]]+)\]\(([^)]+)\)/g,
      replace: '<a href="$2" class="text-blue-500 hover:text-blue-600 underline">$1</a>'
    },
    
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
    },
    
    documents: {
      pattern: /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      replace: (match, text, url, title = text) => {
        if (isDocumentUrl(url)) {
          const extension = getFileExtension(url);
          return `
            <div class="mb-4 bg-gray-50 p-3 rounded-lg">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  ${getFileIcon(extension).outerHTML}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-base mb-1 truncate">${title}</h4>
                  <p class="text-sm text-gray-500 mb-2">${extension.toUpperCase()} Document</p>
                  <div class="flex flex-wrap gap-2">
                    <button 
                      onclick="window.previewDocument('${url}', '${title}')"
                      class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Preview
                    </button>
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
            </div>`;
        }
        return `<a href="${url}" class="text-blue-500 hover:text-blue-600 underline">${text}</a>`;
      }
    },
  };

  let processed = content;
  
  // Process the content
  Object.entries(patterns).forEach(([key, { pattern, replace }]) => {
    if (typeof replace === 'string') {
      processed = processed.replace(pattern, replace);
    } else if (typeof replace === 'function') {
      processed = processed.replace(pattern, replace);
    }
  });

  // Clean up extra paragraph tags and line breaks
  processed = processed
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/<p>\s*<div/g, '<div')
    .replace(/<\/div>\s*<\/p>/g, '</div>')
    .replace(/<p>\s*(<a[^>]*>)\s*<\/p>/g, '$1')
    .replace(/<p>\s*(<\/a>)\s*<\/p>/g, '$1');

  return processed;
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
