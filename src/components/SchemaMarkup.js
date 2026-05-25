"use client";

import React from "react";

export default function SchemaMarkup({ type, data }) {
  if (!data) return null;

  let schemaObj = null;

  try {
    if (type === "product" || type === "software") {
      const isSoftware = type === "software";
      schemaObj = {
        "@context": "https://schema.org",
        "@type": isSoftware ? "SoftwareApplication" : "Product",
        "name": data.name,
        "description": data.shortDescription || data.description,
        "image": "https://auraai.directory/logos/" + data.id + ".svg", // mock absolute url for seo validation
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": data.pricing === "Free" ? "0.00" : "19.99",
          "valueAddedTaxIncluded": "false",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "priceType": "https://schema.org/Subscription",
            "billingIncrement": "1",
            "price": data.pricing === "Free" ? "0.00" : "19.99",
            "priceCurrency": "USD"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": data.avgRating,
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": data.totalReviewsCount || 10
        }
      };

      if (isSoftware) {
        schemaObj.operatingSystem = "Web, macOS, Windows, Linux";
        schemaObj.applicationCategory = "BusinessApplication";
      }

      if (data.reviews && data.reviews.length > 0) {
        schemaObj.review = data.reviews.map((rev) => ({
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": rev.username
          },
          "datePublished": rev.date || "2026-05-20",
          "reviewBody": rev.comment,
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": rev.rating,
            "bestRating": "5",
            "worstRating": "1"
          }
        }));
      }
    } else if (type === "faq") {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      };
    } else if (type === "breadcrumb") {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.map((item, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": item.name,
          "item": "https://auraai.directory" + item.path
        }))
      };
    } else if (type === "itemList") {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": data.map((item, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "url": "https://auraai.directory/tool/" + item.id,
          "name": item.name
        }))
      };
    }
  } catch (e) {
    console.error("Failed to generate JSON-LD schema:", e);
    return null;
  }

  if (!schemaObj) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
    />
  );
}
