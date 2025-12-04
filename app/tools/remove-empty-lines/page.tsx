// app/tools/remove-empty-lines/page.tsx
import type { Metadata } from "next";
import RemoveEmptyLinesClient from "./RemoveEmptyLinesClient";
import { getToolSeo, getToolFullUrl } from "@/seo/toolsHub";

const seo = getToolSeo("remove-empty-lines");
const toolUrl = getToolFullUrl("remove-empty-lines");

export const metadata: Metadata = {
  title: seo.metaTitle,
  description: seo.metaDescription,
  openGraph: {
    title: seo.metaTitle,
    description: seo.metaDescription,
    url: toolUrl,
    type: "website",   
  },
  twitter: {
    card: "summary_large_image",
    title: seo.metaTitle,
    description: seo.metaDescription,    
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: seo.name,
  url: toolUrl,
  applicationCategory: "BrowserApplication",
  operatingSystem: "Windows, Mac, Linux, Android, iOS",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: seo.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <RemoveEmptyLinesClient />
    </>
  );
}
