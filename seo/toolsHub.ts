// seo/toolsHub.ts

export type ToolFaqItem = {
  question: string;
  answer: string;
};

export type ToolSeoConfig = {
  slug: string;
  path: string;
  name: string;
  metaTitle: string;
  metaDescription: string; 
  faq: ToolFaqItem[];
};

const baseUrl = "https://toolcorehub.com";

export const toolsSeo: Record<string, ToolSeoConfig> = {
  "remove-empty-lines": {
    slug: "remove-empty-lines",
    path: "/tools/remove-empty-lines",
    name: "Remove Empty Lines",
    metaTitle: "Remove Empty Lines tool for clean text | Toolcorehub",
    metaDescription:
      "Use this Remove Empty Lines tool to delete blank lines, clean messy text, and copy a tidy version ready for your editor or CMS.",
    
    
    faq: [
      {
        question:
          "Does this Remove Empty Lines tool change my text content?",
        answer:
          "No. It only removes empty or whitespace only lines and trims spaces at the start and end of each line. Your actual words stay the same.",
      },
      {
        question: "Is this Remove Empty Lines tool safe for large text blocks?",
        answer:
          "Yes. It runs in your browser and can comfortably handle long plain text, logs, and copied content. For extremely huge files, you can download the cleaned text and continue in a desktop editor.",
      },
    ],
  },

  // add more tools here later...
};

export function getToolSeo(slug: string): ToolSeoConfig {
  const config = toolsSeo[slug];
  if (!config) {
    throw new Error(`No SEO config found for tool: ${slug}`);
  }
  return config;
}

export function getToolFullUrl(slug: string): string {
  const tool = getToolSeo(slug);
  return `${baseUrl}${tool.path}`;
}
