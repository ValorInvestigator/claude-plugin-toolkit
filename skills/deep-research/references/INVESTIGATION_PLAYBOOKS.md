# Investigation Playbooks

## Investigating a PERSON

1. Username enumeration -- `sherlock_username_search` + `maigret_username_search` in parallel (MCP tools)
2. Email platform check -- `holehe_email_search` (MCP tool) if email known
3. Skip trace (`one-api/skip-trace`) -- addresses, phones, relatives (see SCHEMAS.md)
4. LinkedIn profile (`harvestapi/linkedin-profile-scraper`) -- career history (see SCHEMAS.md)
5. Google SERP (`apify/google-search-scraper`) -- bulk name search (see SCHEMAS.md)
6. Court records (`automation-lab/court-records-scraper`) -- lawsuits (see SCHEMAS.md)
7. Social media deep dive -- Instagram/Facebook/TikTok actors (see SOCIAL_MEDIA_ACTORS.md)
8. Contact enrichment -- `vdrmota/contact-info-scraper` on any personal website found
9. VERIFY skip trace findings with official sources before reporting
10. Apply confidence grades (A/B/C/D) to every finding

## Investigating an ORGANIZATION

1. Domain enumeration -- `theharvester_domain_search` (MCP tool) for emails, subdomains, employees
2. Website crawl (`apify/website-content-crawler`) -- entire site to Markdown (see SCHEMAS.md)
3. Sitemap extract (`cerebral_aluminum/sitemap-extractor`) -- find hidden pages
4. Google SERP (`apify/google-search-scraper`) -- bulk keyword sweep (see SCHEMAS.md)
5. Contact enrichment -- `caprolok/website-email-phone-finder` for emails/phones (see SCHEMAS.md)
6. Google Maps -- `compass/crawler-google-places` for business verification
7. PDF extractor (`jirimoravcik/pdf-text-extractor`) -- any PDFs found (see SCHEMAS.md)
8. ProPublica API (Python urllib) for IRS 990 XML if nonprofit
9. Facebook page -- `apify/facebook-pages-scraper` + `apify/facebook-page-contact-information`

## Investigating a DOCUMENT

1. PDF text extraction (`jirimoravcik/pdf-text-extractor`) -- see SCHEMAS.md
2. OCR if scanned (`vivid_astronaut/ocr-pdf-extractor`)
3. Python pdfplumber for local files
4. Python xml.etree for IRS 990 XML
