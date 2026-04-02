# Social Media Actors (55+ via osint-skill)

For the full catalog, read: `~/.claude/skills/osint/references/tools.md`

## Quick Reference -- Go-To Actors by Platform

| Platform | Primary Actor | Deep Dive |
|----------|--------------|-----------|
| Instagram | `apify/instagram-profile-scraper` | `apify/instagram-tagged-scraper` (who tags them) |
| Facebook | `apify/facebook-pages-scraper` | `apify/facebook-page-contact-information` |
| TikTok | `clockworks/tiktok-profile-scraper` | `clockworks/tiktok-user-search-scraper` (find by name) |
| YouTube | `streamers/youtube-channel-scraper` | `streamers/youtube-comments-scraper` |
| Google Maps | `compass/crawler-google-places` | `poidata/google-maps-email-extractor` |
| Contact enrichment | `vdrmota/contact-info-scraper` | Extracts emails/phones from any URL |

All require `fetch-actor-details` before `call-actor` (unless listed in SCHEMAS.md).
