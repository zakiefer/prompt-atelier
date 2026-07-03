---
id: attachment-act-as-an-autonomous-senior-full-stack-engineer-build-the-working-appl-899b26f1
title: "Act as an autonomous senior full-stack engineer. Build the working appl..."
source: attachment
createdAt: 2026-07-03T00:00:00.000Z
---

Act as an autonomous senior full-stack engineer. Build the working application described below. Do not only provide a plan: create the files, implement the application, run migrations, tests, linting, and production builds, and fix errors you encounter.

PROJECT NAME
StormLead Radar

PURPOSE
Create an internal lead-monitoring application for an emergency tree-removal company.

The application monitors authorized public data sources for recent reports of trees or large limbs that have fallen onto homes, roofs, garages, sheds, fences, carports, commercial buildings, or other insured structures within configured service areas.

This is a lead-triage tool. It must not state that an incident is definitely covered by insurance. Use the phrase “potential structure-damage opportunity” rather than “insurance-covered claim.”

IMPORTANT COMPLIANCE RULES
1. Do not scrape Facebook with Puppeteer, Playwright, Selenium, session cookies, saved passwords, or a personal Facebook account.
2. Do not attempt to bypass logins, CAPTCHAs, rate limits, privacy controls, or platform restrictions.
3. The Facebook connector must use only Meta’s official Graph API and only content the application is authorized to access.
4. Do not collect private posts, private groups, private messages, friends lists, profile data, phone numbers, or inferred home addresses.
5. Do not infer a person’s residence from their profile.
6. Do not automatically message, call, comment on, or contact anyone.
7. Every lead must be reviewed by a human before outreach.
8. Provide a generic signed-webhook connector so a licensed social-listening vendor can send results into the application.
9. Store the minimum data needed for lead review.
10. Add configurable data-retention and deletion features.
11. Do not identify faces, license plates, or people in images.

TECHNOLOGY
Create a pnpm TypeScript monorepo:

- apps/web: Next.js App Router dashboard
- apps/worker: Node.js TypeScript ingestion and classification worker
- packages/db: PostgreSQL schema and migrations using Drizzle ORM
- packages/core: shared types, Zod schemas, scoring, normalization, geofencing
- packages/connectors: source connector implementations
- PostgreSQL
- Redis and BullMQ
- Docker Compose for local development
- Tailwind and a clean component library for the dashboard
- Vitest for unit and integration tests
- Playwright only for testing our own dashboard, never for collecting social content

Use current stable package versions that are compatible with each other. Do not hardcode a particular LLM model name. Read it from LLM_MODEL.

APPLICATION WORKFLOW

authorized source connector
    -> normalize item
    -> reject old or irrelevant items
    -> deduplicate
    -> extract location
    -> classify incident
    -> calculate lead score
    -> match service area
    -> create reviewable lead
    -> send alert when threshold is met

SUPPORTED SOURCES

Implement these sources first:

1. Mock connector
   - Supplies realistic fixtures.
   - Allows the entire application to work without external credentials.

2. Manual intake
   - Form where an employee can paste a public post URL, text, source, approximate location, and optional image.
   - Also provide an authenticated POST /api/intake endpoint.
   - Make this endpoint suitable for Zapier, Make, an email parser, or a future phone share-sheet.

3. RSS/Atom
   - Monitor configured feeds from local news, fire departments, emergency management, police, municipalities, and public works.
   - Respect feed polling intervals and conditional request headers.

4. National Weather Service
   - Monitor active alerts for configured states, counties, or alert zones.
   - Use alerts such as severe thunderstorm, tornado, tropical storm, hurricane, high wind, ice storm, and similar damaging-weather alerts to activate Storm Mode.
   - Weather alerts do not themselves create property leads.
   - They increase polling frequency and adjust scoring for recent local reports.

5. Generic provider webhook
   - POST /api/webhooks/provider/:providerName
   - Require an HMAC signature.
   - Normalize provider payloads to the common RawItem format.
   - Document the payload schema.

Then implement optional connectors behind feature flags:

6. Facebook Pages
   - Use only the official Meta Graph API.
   - Read configured public Page IDs that the application is authorized to access.
   - Optionally support Pages Search only when the Meta app has the required approved access.
   - Use cursors, pagination, rate-limit handling, and exponential backoff.
   - Never access personal timelines or groups.
   - Disable gracefully when credentials or approval are unavailable.
   - Create docs/meta-setup.md explaining that app review and business verification may be required and approval is not guaranteed.

7. Reddit
   - Use only approved official API access.
   - Monitor configured local subreddits and search phrases.
   - Respect API rate limits and content-deletion requirements.
   - Do not collect private user data.

8. Bluesky
   - Monitor public search results through its documented public API.
   - Search for incident phrases combined with configured location aliases.

Design a SourceConnector interface so other authorized sources can be added later.

SERVICE AREA CONFIGURATION

Allow an administrator to create multiple service areas with:

- Name
- State
- Counties
- Cities and towns
- ZIP codes
- Neighborhood aliases
- Optional latitude/longitude and radius
- Optional GeoJSON polygon
- Enabled/disabled
- Alert threshold
- Normal polling interval
- Storm Mode polling interval

Location matching should use, in descending order of confidence:

1. Explicit source coordinates
2. Explicit street, city, ZIP, county, or neighborhood in the post
3. A location stated by the source Page or feed item
4. Configured city/neighborhood aliases in the text
5. General source locality, marked as low confidence

Never use an author’s profile location to infer the incident location.

DATABASE

Create at least these tables:

users
service_areas
service_area_aliases
sources
connector_cursors
raw_items
incidents
incident_sources
alerts
classification_feedback
audit_events
app_settings

Suggested RawItem fields:

- id
- sourceType
- sourceId
- externalId
- canonicalUrl
- sourceDisplayName
- publicAuthorLabel, nullable
- text
- postedAt
- fetchedAt
- explicitLatitude, nullable
- explicitLongitude, nullable
- locationText, nullable
- contentHash
- mediaPresent
- rawMetadata JSONB containing only necessary non-sensitive metadata
- processingStatus
- expiresAt

Suggested Incident fields:

- id
- incidentType
- structureTypes
- summary
- evidence
- locationText
- latitude
- longitude
- locationConfidence
- serviceAreaId
- currentEventConfidence
- structureDamageConfidence
- urgencyScore
- totalScore
- classifierConfidence
- status
- firstSeenAt
- lastSeenAt
- createdAt
- updatedAt

Incident statuses:

- new
- needs_review
- verified
- contacted
- dispatched
- won
- duplicate
- not_relevant
- expired

CLASSIFICATION

Implement two classification layers.

Layer 1: deterministic rules

Positive phrases should include variations of:

- tree fell on house
- tree fell on home
- tree on roof
- tree through roof
- limb through roof
- branch through roof
- tree on garage
- tree on shed
- tree on fence
- tree on building
- tree on carport
- uprooted tree hit house
- storm knocked a tree onto
- crushed roof
- damaged roof
- tree leaning on house
- large limb on structure
- emergency tree removal
- need a tree removed from house

Negative or lower-value phrases should include:

- tree down in road only
- tree blocking road
- tree on power line only
- tree in park
- tree in woods
- tree fell in yard with no structure damage
- tree-trimming advertisement
- firewood sale
- landscaping promotion
- old storm anniversary
- historical photograph
- repost from another state
- joke, meme, game, movie, or figurative use
- generic storm forecast with no reported incident

Use stemming, phrase variants, spelling-tolerant matching, and negation handling.

Layer 2: optional LLM structured classification

Support:

LLM_PROVIDER=anthropic|openai|none
LLM_MODEL=<environment value>

When no LLM key exists, the rules classifier must still work.

Require the LLM to return validated JSON matching this schema:

{
  "is_current_incident": boolean,
  "incident_type": "tree_on_structure" | "limb_on_structure" | "tree_near_structure" | "road_or_utility_only" | "cleanup_ad" | "unrelated" | "unclear",
  "structure_types": [
    "home",
    "roof",
    "garage",
    "shed",
    "fence",
    "carport",
    "commercial_building",
    "other_structure"
  ],
  "location_mentions": [
    {
      "text": "string",
      "type": "address" | "city" | "county" | "zip" | "neighborhood" | "landmark" | "unknown"
    }
  ],
  "requesting_help": boolean,
  "damage_visible_or_described": boolean,
  "urgency": 0,
  "confidence": 0.0,
  "evidence": ["short quotation or observation"],
  "false_positive_reason": "string or null",
  "summary": "one sentence"
}

Do not let the classifier determine actual insurance coverage.

OPTIONAL IMAGE CLASSIFICATION

When an authorized source provides an image and the connector permits image processing:

- Download it temporarily.
- Validate content type and maximum size.
- Ask the vision classifier only whether:
  - a tree or large limb is visible
  - it is touching or penetrating a structure
  - the apparent structure type
  - visible structural damage
  - confidence
- Do not identify people, faces, addresses, or license plates.
- Delete temporary image files after analysis.
- Keep image processing behind VISION_CLASSIFICATION_ENABLED=false by default.
- Manual uploads can be retained according to the configured retention period.

DEDUPLICATION

Deduplicate using:

- source plus external ID
- canonical URL
- normalized content hash
- high text similarity
- same approximate location and similar timestamp
- repost detection

Multiple posts about the same incident should become one Incident with multiple IncidentSources.

SCORING

Create a configurable 0–100 score.

Default formula:

- Up to 35 points: confidence that a tree or limb is contacting a structure
- Up to 20 points: explicit home, roof, garage, fence, shed, carport, or building damage
- Up to 20 points: service-area location confidence
- Up to 10 points: report is recent
- Up to 10 points: urgency or request for help
- Up to 5 points: corroborating image or second independent source

Penalties:

- Minus 40: road or utility only
- Minus 35: no structure involved
- Minus 50: old, historical, or unrelated repost
- Minus 50: contractor advertisement
- Minus 25: location is outside the configured service area
- Minus 20: location cannot be established

Default behavior:

- 75–100: immediate alert and New lead
- 50–74: Needs Review
- Below 50: retain as low-confidence or mark Not Relevant
- Do not alert twice for the same incident unless the score materially increases.

Make all scoring weights configurable in the admin UI.

STORM MODE

Storm Mode can be activated manually or automatically by matching weather alerts.

During Storm Mode:

- Increase polling frequency within API limits.
- Give a modest recency boost to reports within the affected area.
- Show the active alert and expiration time in the dashboard.
- Never classify a post as an incident solely because a weather alert exists.
- Automatically return to normal mode when alerts expire, unless manually locked on.

DASHBOARD

Create a responsive internal dashboard with:

1. Lead inbox
   - Score
   - Incident summary
   - Structure type
   - Location and location confidence
   - Age
   - Source
   - Reasons for score
   - Direct link to original public item
   - Review status
   - Assignment
   - Notes

2. Incident detail
   - All matching source posts
   - Classification evidence
   - Score breakdown
   - Location evidence
   - Timeline
   - Audit history
   - Buttons for Verified, Not Relevant, Duplicate, Contacted, Dispatched, Won

3. Map
   - Plot only incidents with suitable location confidence.
   - Visually distinguish New, Needs Review, and Verified.
   - Do not expose the map publicly.

4. Service-area administration
   - Manage locations, aliases, polygons, thresholds, and polling intervals.

5. Source administration
   - Enable/disable connectors
   - Configure Page IDs, subreddits, feeds, and search phrases
   - Display last successful run, cursor, errors, and rate-limit state
   - Test connector button

6. Storm Mode panel
   - Current weather alerts
   - Automatic/manual state
   - Polling status

7. Analytics
   - Leads by day
   - Leads by service area
   - Relevance rate
   - Source performance
   - Verified-to-won conversion
   - False-positive reasons

8. Settings
   - Alert thresholds
   - Data retention
   - Notification channels
   - Classifier configuration
   - Keyword weights

ALERTING

Implement:

- Email through SMTP
- SMS through an optional Twilio adapter
- Slack-compatible webhook
- Generic outbound webhook with HMAC signing

Alerts should contain:

- Score
- One-sentence incident summary
- Approximate location
- Incident age
- Structure type
- Reason it qualified
- Link to the internal incident page
- Link to the original public source when permitted

Do not include unnecessary personal data.

PRIVACY AND SECURITY

- Authentication is required for every dashboard route.
- Implement a simple credentials-based local auth mode and document how to replace it with an identity provider.
- Role types: admin, dispatcher, reviewer.
- Encrypt platform access tokens at rest.
- Never log access tokens or full webhook secrets.
- Validate all incoming payloads with Zod.
- Use CSRF protections and secure cookies.
- Add request rate limiting.
- Escape and sanitize source text before displaying it.
- Protect against server-side request forgery when fetching feeds or images.
- Allowlist URL protocols and reject private/internal IP addresses.
- Add an audit record for status changes, settings changes, data exports, and deletions.
- Default raw-content retention: 30 days.
- Default reviewed-incident retention: 180 days.
- Provide scheduled deletion jobs.
- Add a delete-now function for administrators.
- Create PRIVACY.md, SECURITY.md, and COMPLIANCE.md.

FEEDBACK LOOP

When reviewers mark an item Relevant or Not Relevant:

- Store the label and reason.
- Show false-positive categories.
- Produce an exportable JSONL training/evaluation dataset.
- Do not automatically retrain a model.
- Provide a command that evaluates classifier precision and recall against reviewed fixtures.

SEED DATA

Create at least 25 realistic sample items, including:

Positive examples:
- A current tree through a house roof in a configured city
- A large limb on a detached garage
- An uprooted tree resting on a fence and shed
- A brief post with little text but authorized image-classification evidence
- Two posts describing the same incident

Negative examples:
- Tree blocking a county road
- Tree on power lines with no structure
- Landscaping company advertisement
- Old hurricane memory
- Tree fell in an empty yard
- News report from outside the service area
- Figurative phrase such as “fell like a tree”
- Duplicate repost
- Generic severe-weather warning
- Firewood listing

DEVELOPER EXPERIENCE

Provide:

- docker-compose.yml
- .env.example
- database migrations
- seed command
- development command
- worker command
- test command
- lint command
- production build command
- README with exact setup steps
- connector-development guide
- Meta setup guide
- provider-webhook guide
- deployment guide
- troubleshooting section

The project must boot locally without any social-platform credentials by using mock data.

TESTS AND ACCEPTANCE CRITERIA

Add unit and integration tests proving:

1. “A huge oak just came through our roof in Springfield” scores at least 75 when Springfield is in the service area.
2. “Tree down across Route 6” scores no more than 35 without evidence of a structure.
3. A landscaping advertisement is rejected.
4. An old storm anniversary post is rejected.
5. An incident outside the service area does not trigger an immediate alert.
6. Duplicate posts merge into one incident.
7. A matching weather alert activates Storm Mode.
8. A weather alert alone creates no property incident.
9. A webhook with an invalid signature is rejected.
10. Raw items expire according to the retention setting.
11. The application functions when LLM_PROVIDER=none.
12. Facebook collection cannot run without an authorized Graph API configuration.
13. No connector imports Playwright, Puppeteer, Selenium, or browser-cookie libraries.
14. A high-score incident generates exactly one notification.
15. Reviewer feedback is stored and included in the evaluation export.

At completion:

- Run all migrations.
- Seed the database.
- Run tests.
- Run linting.
- Run TypeScript type checking.
- Run the production build.
- Fix all failures.
- Summarize what was created, commands to start it, remaining credential-dependent integrations, and any assumptions.
