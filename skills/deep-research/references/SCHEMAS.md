# Pre-Built Actor Input Schemas

Use these directly with `call-actor`. No `fetch-actor-details` needed.

## 1. Google SERP Scraper (`apify/google-search-scraper`)
```json
{"queries": "query 1\nquery 2\nquery 3", "maxPagesPerQuery": 1, "resultsPerPage": 10, "languageCode": "en", "mobileResults": false}
```
Best for: Bulk discovery. Put multiple queries on separate lines.

## 2. Website Content Crawler (`apify/website-content-crawler`)
```json
{"startUrls": [{"url": "https://example.com"}], "maxCrawlPages": 20, "crawlerType": "cheerio", "maxCrawlDepth": 2}
```
Best for: Scraping entire site to markdown. Use "playwright" crawlerType for JS-heavy sites.

## 3. Google News Scraper (`easyapi/google-news-scraper`)
```json
{"query": "search terms", "language": "en", "country": "US", "maxItems": 100}
```
Best for: Finding media coverage. Note: maxItems minimum is 100.

## 4. Website Email/Phone Finder (`caprolok/website-email-phone-finder`)
```json
{"startUrls": [{"url": "https://example.com"}], "maxDepth": 2, "maxPages": 10}
```
Best for: Extracting staff contact info from org websites.

## 5. Playwright Scraper (`apify/playwright-scraper`)
```json
{"startUrls": [{"url": "https://example.com"}], "pageFunction": "async function pageFunction(context) {\n  const { page, request } = context;\n  const title = await page.title();\n  const content = await page.content();\n  return { url: request.url, title, content };\n}", "maxRequestsPerCrawl": 5}
```
Best for: Anti-bot bypass, JS rendering, login-required sites.

## 6. PDF Text Extractor (`jirimoravcik/pdf-text-extractor`)
```json
{"urls": ["https://example.com/document.pdf"]}
```
Best for: Free. Government PDFs, court documents.

## 7. LinkedIn Profile Scraper (`harvestapi/linkedin-profile-scraper`)
```json
{"profileUrls": ["https://www.linkedin.com/in/username"]}
```
Best for: Career history, employer, connections. Costs ~$0.01/profile.

## 8. Court Records Scraper (`automation-lab/court-records-scraper`)
```json
{"searchQuery": "person or entity name", "state": "Oregon"}
```
Best for: Civil/criminal case history. Costs ~$0.002/record.

## 9. Skip Trace (`one-api/skip-trace`)
```json
{"name": "First Last", "state": "OR"}
```
Best for: Addresses, phones, relatives. VERIFY findings with official sources.

## 10. Watson Username Search (`lofomachines/watson`)
```json
{"username": "handle"}
```
Best for: Social media presence across platforms. Alternative to Sherlock MCP tool.
