"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  Video,
  Target,
  Image,
  FileText,
  DollarSign,
  FileType,
  Sparkles,
  Type,
  Scissors,
  Crop,
  FileBox,
  BookOpen,
  Link as LinkIcon,
  FileChartColumn,
  Calculator,
} from "lucide-react";

// Icon per tool
const toolIcons: Record<string, React.ElementType> = {
  // YouTube
  "YouTube Thumbnail Downloader": Image,
  "YouTube Video Title Extractor": Type,
  "YouTube Channel ID Finder": LinkIcon,
  "YouTube Description Generator": BookOpen,
  "YouTube Tag Extractor": FileBox,
  "YouTube Video Downloader": Video,
  "YouTube Embed Code Generator": FileType,
  "YouTube Timestamp Link Generator": LinkIcon,
  "YouTube Comment Scraper": FileChartColumn,

  // SEO
  "Meta Title Length Checker": Type,
  "Meta Description Analyzer": Type,
  "Bulk H1 Tag Checker": Type,
  "Canonical URL Validator": LinkIcon,
  "Robots.txt Generator": FileType,
  "XML Sitemap Validator": FileChartColumn,
  "Broken Link Checker": LinkIcon,
  "Redirect Chain Analyzer": LinkIcon,
  "Schema Markup Generator": FileText,

  // Image
  "Image Format Converter": Image,
  "Image Compressor": Image,
  "Image Resizer": Image,
  "Background Remover": Scissors,
  "Image to Base64 Converter": FileType,
  "Image Cropper": Crop,
  "Watermark Remover": Scissors,
  "Image Filter Editor": Sparkles,
  "Bulk Image Renamer": Type,

  // PDF
  "PDF to Word Converter": FileType,
  "Word to PDF Converter": FileType,
  "PDF Merger": FileType,
  "PDF Splitter": FileType,
  "PDF Compressor": FileType,
  "Image to PDF Converter": FileType,
  "PDF Password Remover": FileType,
  "PDF Page Extractor": FileBox,
  "PDF Rotator": FileType,

  // Finance
  "Freelance Hourly Rate Calculator": Calculator,
  "Mortgage Amortization Schedule Generator": Calculator,
  "Loan EMI Calculator": DollarSign,
  "Investment Return Calculator": DollarSign,
  "SIP Calculator": DollarSign,
  "Tax Calculator": DollarSign,
  "Compound Interest Calculator": DollarSign,
  "Retirement Planning Calculator": DollarSign,
  "Currency Converter": DollarSign,
  "Mortgage Calculator": DollarSign,
  "Budget Planner": DollarSign,
};

// Data
type Tool = {
  name: string;
  slug: string;
  category: string;
};

const toolsData: Tool[] = [
  // YouTube Tools
  { name: "YouTube Thumbnail Downloader", slug: "youtube-thumbnail-downloader", category: "youtube" },
  { name: "YouTube Video Title Extractor", slug: "youtube-video-title-extractor", category: "youtube" },
  { name: "YouTube Channel ID Finder", slug: "youtube-channel-id-finder", category: "youtube" },
  { name: "YouTube Description Generator", slug: "youtube-description-generator", category: "youtube" },
  { name: "YouTube Tag Extractor", slug: "youtube-tag-extractor", category: "youtube" },
  { name: "YouTube Video Downloader", slug: "youtube-video-downloader", category: "youtube" },
  { name: "YouTube Embed Code Generator", slug: "youtube-embed-code-generator", category: "youtube" },
  { name: "YouTube Timestamp Link Generator", slug: "youtube-timestamp-link-generator", category: "youtube" },
  { name: "YouTube Comment Scraper", slug: "youtube-comment-scraper", category: "youtube" },

  // SEO Tools
  { name: "Meta Title Length Checker", slug: "meta-title-length-checker", category: "seo" },
  { name: "Meta Description Analyzer", slug: "meta-description-analyzer", category: "seo" },
  { name: "Bulk H1 Tag Checker", slug: "bulk-h1-tag-checker", category: "seo" },
  { name: "Canonical URL Validator", slug: "canonical-url-validator", category: "seo" },
  { name: "Robots.txt Generator", slug: "robots-txt-generator", category: "seo" },
  { name: "XML Sitemap Validator", slug: "xml-sitemap-validator", category: "seo" },
  { name: "Broken Link Checker", slug: "broken-link-checker", category: "seo" },
  { name: "Redirect Chain Analyzer", slug: "redirect-chain-analyzer", category: "seo" },
  { name: "Schema Markup Generator", slug: "schema-markup-generator", category: "seo" },

  // Image Tools
  { name: "Image Format Converter", slug: "image-format-converter", category: "image" },
  { name: "Image Compressor", slug: "image-compressor", category: "image" },
  { name: "Image Resizer", slug: "image-resizer", category: "image" },
  { name: "Background Remover", slug: "background-remover", category: "image" },
  { name: "Image to Base64 Converter", slug: "image-to-base64-converter", category: "image" },
  { name: "Image Cropper", slug: "image-cropper", category: "image" },
  { name: "Watermark Remover", slug: "watermark-remover", category: "image" },
  { name: "Image Filter Editor", slug: "image-filter-editor", category: "image" },
  { name: "Bulk Image Renamer", slug: "bulk-image-renamer", category: "image" },

  // PDF Tools
  { name: "PDF to Word Converter", slug: "pdf-to-word-converter", category: "pdf" },
  { name: "Word to PDF Converter", slug: "word-to-pdf-converter", category: "pdf" },
  { name: "PDF Merger", slug: "pdf-merger", category: "pdf" },
  { name: "PDF Splitter", slug: "pdf-splitter", category: "pdf" },
  { name: "PDF Compressor", slug: "pdf-compressor", category: "pdf" },
  { name: "Image to PDF Converter", slug: "image-to-pdf-converter", category: "pdf" },
  { name: "PDF Password Remover", slug: "pdf-password-remover", category: "pdf" },
  { name: "PDF Page Extractor", slug: "pdf-page-extractor", category: "pdf" },
  { name: "PDF Rotator", slug: "pdf-rotator", category: "pdf" },

  // Finance Tools
  { name: "Freelance Hourly Rate Calculator", slug: "freelance-hourly-rate-calculator", category: "finance" },
  { name: "Loan EMI Calculator", slug: "loan-emi-calculator", category: "finance" },
  { name: "Investment Return Calculator", slug: "investment-return-calculator", category: "finance" },
  { name: "SIP Calculator", slug: "sip-calculator", category: "finance" },
  { name: "Tax Calculator", slug: "tax-calculator", category: "finance" },
  { name: "Compound Interest Calculator", slug: "compound-interest-calculator", category: "finance" },
  { name: "Retirement Planning Calculator", slug: "retirement-planning-calculator", category: "finance" },
  { name: "Currency Converter", slug: "currency-converter", category: "finance" },
  { name: "Mortgage Amortization Schedule Generator", slug: "mortgage-amortization-schedule-generator", category: "finance" },
  { name: "Budget Planner", slug: "budget-planner", category: "finance" },
];

const categories = [
  { value: "all", label: "All Categories", icon: Search },
  { value: "youtube", label: "YouTube Tools", icon: Video },
  { value: "seo", label: "SEO Tools", icon: Target },
  { value: "image", label: "Image Tools", icon: Image },
  { value: "pdf", label: "PDF Tools", icon: FileText },
  { value: "finance", label: "Finance Tools", icon: DollarSign },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    let filtered = toolsData;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    if (q) {
      filtered = filtered.filter((tool) =>
        tool.name.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [query, selectedCategory]);

  const groupedTools = useMemo(() => {
    const groups: { [key: string]: Tool[] } = {
      youtube: [],
      seo: [],
      image: [],
      pdf: [],
      finance: [],
    };

    filteredTools.forEach((tool) => {
      if (groups[tool.category]) {
        groups[tool.category].push(tool);
      }
    });

    return groups;
  }, [filteredTools]);

  const getCategoryInfo = (cat: string) => {
    return categories.find((c) => c.value === cat) || categories[0];
  };

  const currentCategoryLabel =
    categories.find((c) => c.value === selectedCategory)?.label ||
    "All Categories";

  return (
    <div className="px-12 py-12 pb-16">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
          Free Online Tools
        </h1>
        <p className="text-base text-[#94A3B8] max-w-2xl leading-relaxed">
          46+ powerful tools across 5 categories to boost your productivity.
          No logins, no limits, just instant results.
        </p>
      </section>

      {/* Search + Category */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row gap-3 max-w-3xl">
          {/* Search field */}
          <div className="flex-1 h-11 bg-[#1E293B] border border-[#334155] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#2563EB] transition-colors">
            <Search className="h-4 w-4 text-[#94A3B8] shrink-0" />
            <Input
              placeholder="Search for any tool..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-[#94A3B8] text-[#F8FAFC]"
            />
          </div>

          {/* Category dropdown */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px] h-11 bg-[#1E293B] border border-[#334155] rounded-lg text-sm px-4 text-[#F8FAFC] focus:ring-0 focus:border-[#2563EB]">
              <SelectValue placeholder="Category">
                {currentCategoryLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#1E293B] border-[#334155] text-[#F8FAFC]">
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="focus:bg-[#334155]">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search button */}
          <Button className="h-11 px-6 text-sm bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-colors">
            Search
          </Button>
        </div>
      </section>

      {/* Category clusters */}
      {Object.entries(groupedTools).map(([categoryKey, tools]) => {
        if (tools.length === 0) return null;

        const categoryInfo = getCategoryInfo(categoryKey);
        const CategoryIcon = categoryInfo.icon;

        return (
          <section key={categoryKey} className="mb-12">
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shrink-0">
                <CategoryIcon className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-[#F8FAFC]">
                {categoryInfo.label}
              </h2>
              <span className="text-xs text-[#94A3B8] bg-[#1E293B] border border-[#334155] px-2 py-0.5 rounded-full">
                {tools.length} tool{tools.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Tools grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => {
                const Icon = toolIcons[tool.name] || Sparkles;

                return (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                    <Card className="group bg-[#1E293B] border border-[#334155] rounded-[12px] hover:border-[#2563EB] transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.2)]">
                      <CardHeader className="flex flex-row items-center gap-4 py-[24px] px-[24px]">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-[0_4px_12px_rgba(37,99,235,0.35)]">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-sm font-medium text-[#F8FAFC] leading-snug group-hover:text-[#38BDF8] transition-colors">
                          {tool.name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
