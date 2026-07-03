---
id: attachment-you-are-the-principal-software-architect-and-senior-typescript-engineer-06271a72
title: "You are the principal software architect and senior TypeScript engineer..."
source: attachment
createdAt: 2026-07-03T00:00:00.000Z
---

You are the principal software architect and senior TypeScript engineer for
this repository.

Build the first working vertical slice of a professional AI-assisted lead
qualification and deposit workflow for a vinyl decal and vehicle-wrap business.

Do not stop after producing a plan or documentation. Plan first, then implement
the application, run it, test it, and correct failures.

PROJECT NAME

wrap-lead-os

PRIMARY BUSINESS GOAL

Build an application that:

1. Receives a new customer inquiry through a web conversation.
2. Uses AI to understand what vinyl, decal, lettering, storefront, fleet, or
   vehicle-wrap work the customer wants.
3. Collects structured information and required photos.
4. Places the lead in an owner dashboard.
5. Shows the owner what information is complete or missing.
6. Allows the owner to prepare and approve a quote.
7. Presents the approved quote to the customer.
8. Records explicit customer acceptance.
9. Generates a secure deposit checkout link.
10. Marks the lead Deposit Paid only after a verified payment event.
11. Synchronizes relevant lead information to Zoho CRM through a replaceable
    integration adapter.
12. Preserves an audit trail of every important action.

IMPORTANT SCOPE LIMIT

Build one complete vertical slice before adding more communication channels.

Phase 1 must include:

- Public website lead intake and conversational interface
- Customer photo uploads
- AI-assisted lead qualification
- Owner lead dashboard
- Human quote approval
- Customer quote acceptance
- Deposit workflow
- Payment event handling
- Zoho CRM synchronization abstraction
- Complete local demo mode
- Automated tests

Do not implement live phone calls, SMS, WhatsApp, Instagram, Facebook Messenger,
or autonomous scheduling in Phase 1.

Create clean adapter interfaces for those future channels, but do not add their
SDKs yet.

OPERATING INSTRUCTIONS

1. Inspect the repository before making changes.
2. If the repository is empty, initialize it.
3. Use Git for source control.
4. Do not push to any remote repository.
5. Do not deploy anything.
6. Do not make live Zoho, Stripe, OpenAI, email, SMS, or other external API
   calls during development or testing.
7. Do not require paid services for the local demo.
8. Never put real credentials in source code.
9. Never print secrets in logs.
10. Make reasonable technical assumptions rather than stopping to ask broad
    architectural questions.
11. Record every assumption in docs/assumptions.md.
12. Record unresolved business configuration questions in
    docs/business-questions.md.
13. Use current stable package versions that are compatible with one another.
14. Check official vendor documentation before implementing external APIs.
15. Never invent API endpoints, webhook formats, OAuth scopes, or provider
    behavior.
16. When current official documentation cannot be accessed, implement the
    interface and fake provider, document the blocker, and do not guess.
17. Create small, reviewable Git checkpoint commits when practical.
18. Keep the application runnable after each major checkpoint.
19. Continue until linting, type checking, unit tests, integration tests, and
    the production build all pass.
20. At the end, provide a concise implementation report with commands,
    completed features, assumptions, test results, and remaining integration
    steps.

CREATE AGENTS.MD FIRST

Create a repository-root AGENTS.md containing durable engineering rules for
future Codex work, including:

- TypeScript strict mode is mandatory.
- Domain logic must not depend directly on external SDKs.
- External providers must implement internal interfaces.
- Business-critical transitions must be deterministic.
- AI output is untrusted input and must be schema validated.
- Never collect or store card data.
- Never expose secrets to client code.
- Never make production calls during automated tests.
- Every payment event must be idempotent.
- Every privileged mutation must be authenticated and audited.
- Every feature must include tests.
- Do not weaken tests merely to make them pass.
- Do not silently replace production security with demo shortcuts.
- Development-only behavior must be visibly labeled and must fail closed in
  production.
- Do not add dependencies without a concrete reason.
- Keep README.md and architecture documentation synchronized with the code.

TECHNICAL STACK

Use a maintainable TypeScript application with:

- Current supported Node.js LTS
- TypeScript with strict mode
- pnpm
- Current stable Next.js using the App Router
- React
- PostgreSQL
- Drizzle ORM and migrations
- Zod for runtime validation
- Official OpenAI JavaScript SDK
- OpenAI Responses API for text-based qualification
- Stripe Checkout for the eventual hosted deposit page
- Vitest for unit and integration tests
- Playwright for critical browser workflows
- ESLint
- Prettier
- Docker and Docker Compose for local PostgreSQL
- Structured server-side logging
- Server-rendered pages where appropriate

Use a single application repository with clear modular boundaries rather than
introducing a large microservice architecture.

Suggested source organization:

src/
  app/
  components/
  domain/
  application/
  infrastructure/
  integrations/
  security/
  jobs/
  prompts/
  test-support/

The domain and application layers must not import provider SDKs.

ARCHITECTURAL PRINCIPLES

Use a modular or hexagonal architecture.

Separate:

1. Domain entities and business rules
2. Application use cases
3. Database persistence
4. AI provider
5. CRM provider
6. Payment provider
7. Media storage provider
8. Notification provider
9. Communication-channel provider
10. Web user interface

Create interfaces such as:

- AiQualificationProvider
- CrmProvider
- PaymentProvider
- MediaStorageProvider
- OwnerNotificationProvider
- ChannelAdapter
- AuditLogRepository
- LeadRepository
- ConversationRepository
- QuoteRepository
- PaymentRepository
- JobRepository

Provide fake implementations for every external provider.

The application must run end to end in DEMO_MODE without OpenAI, Stripe, Zoho,
cloud storage, email, or messaging credentials.

APPLICATION USERS

There are two user experiences.

CUSTOMER EXPERIENCE

The customer must be able to:

- Start a lead conversation
- Enter their name, email, and phone
- Explain what they want in natural language
- Answer follow-up questions
- Upload photos
- See which requested items remain incomplete
- Review an owner-approved quote
- Explicitly accept the quote
- Accept the deposit terms
- Receive a hosted deposit action
- See payment status

OWNER EXPERIENCE

The owner must be able to:

- Sign in securely
- View all leads
- Filter leads by status
- View a Hot Leads queue
- See unread or recently active leads
- Open the complete conversation
- See an AI-generated summary
- See structured lead information
- See missing qualification information
- View uploaded photos
- Add internal notes
- mark a lead as requiring review
- Enter a quote total
- Enter or calculate a deposit amount
- Approve a quote
- Send or expose the quote to the customer
- See whether the customer accepted
- Create a deposit request only when allowed
- See payment status
- See CRM synchronization status
- See an audit timeline

Make the owner dashboard mobile responsive.

Do not build a generic cookie-cutter chatbot dashboard. Design the interface
around the actual vinyl and vehicle-wrap sales workflow.

LEAD SERVICE CATEGORIES

Support at least:

- Full vehicle wrap
- Partial vehicle wrap
- Vehicle color change
- Commercial vehicle graphics
- Fleet graphics
- Vehicle lettering
- Logo decals
- Stripes or accents
- Wrap removal
- Storefront window graphics
- Wall graphics
- Signs or panels
- Other custom vinyl work

STRUCTURED LEAD INFORMATION

Model and collect:

- Customer first name
- Customer last name
- Email
- Phone
- Preferred contact method
- Lead source
- Service category
- Residential or commercial customer
- Vehicle year
- Vehicle make
- Vehicle model
- Vehicle body style
- Vehicle current color
- Vehicle count
- Desired coverage
- Desired color or finish
- Desired material, when known
- Existing vinyl or wrap
- Wrap-removal requirement
- Paint, rust, dents, peeling clear coat, or other surface concerns
- Whether the customer has artwork
- Whether design work is required
- Desired completion date
- Customer or vehicle location
- Budget range
- Customer description
- Internal owner notes
- Uploaded media
- Missing requirements
- AI conversation summary
- Human-review reason
- Quote total
- Deposit amount
- Quote status
- Deposit status
- CRM synchronization status
- Last customer activity
- Last owner activity

Do not force vehicle-specific fields for storefront, wall, or sign inquiries.

QUALIFICATION CHECKLISTS

Create service-specific qualification requirements.

For vehicle wraps and graphics, support requirements such as:

- Vehicle year, make, and model
- Desired coverage
- Current vehicle color
- Front photo
- Rear photo
- Driver-side photo
- Passenger-side photo
- Photos of existing damage or vinyl
- Logo or artwork files for commercial graphics
- Desired deadline

For storefront and wall work, support:

- Approximate dimensions
- Surface type
- Location
- Straight-on photo
- Wider contextual photo
- Existing graphics or adhesive
- Artwork availability
- Installation deadline

Keep these requirements configurable in code and seeded database data rather
than scattering them across UI components.

DOMAIN MODEL

At minimum create domain models for:

- Lead
- Customer
- Conversation
- Message
- MediaAsset
- QualificationRequirement
- QualificationSnapshot
- Quote
- QuoteAcceptance
- DepositRequest
- PaymentEvent
- AuditEvent
- IntegrationSyncAttempt
- InternalNote
- BackgroundJob

Use identifiers that do not expose sequential database IDs publicly.

Use signed or sufficiently random customer-access tokens for customer-facing
lead and quote pages.

LEAD STATE MACHINE

Implement an explicit state machine with states similar to:

- NEW
- QUALIFYING
- WAITING_FOR_CUSTOMER
- WAITING_FOR_PHOTOS
- NEEDS_HUMAN_REVIEW
- READY_FOR_QUOTE
- QUOTE_DRAFT
- QUOTE_APPROVED
- QUOTE_SENT
- CUSTOMER_ACCEPTED
- DEPOSIT_READY
- DEPOSIT_REQUESTED
- DEPOSIT_PAID
- READY_TO_SCHEDULE
- LOST
- ARCHIVED

Not every state transition may be performed by the AI.

Create an explicit transition policy and tests.

For example:

- AI may help transition NEW to QUALIFYING.
- AI may identify that photos are missing.
- AI may recommend NEEDS_HUMAN_REVIEW.
- AI may not approve a quote.
- AI may not mark customer acceptance without an explicit recorded customer
  action.
- AI may not create a deposit request by itself.
- AI may never mark a payment as successful.
- Payment success may only result from a verified, idempotently processed
  payment-provider event.

DEPOSIT READINESS

Implement deposit readiness as deterministic application logic.

A lead can become DEPOSIT_READY only when all required conditions are true:

- Customer contact information is complete
- Required scope information is complete
- Required photos or media have been supplied or explicitly waived by owner
- There are no unresolved human-review flags
- A human-approved quote exists
- The quote has not expired
- The customer explicitly accepted that exact quote version
- The customer explicitly accepted the deposit terms
- The deposit amount is greater than zero
- No conflicting active deposit request exists

Return specific machine-readable failure reasons when a lead is not ready.

Never ask an AI model to make the final deposit-readiness decision.

QUOTE VERSIONING

Quotes must be immutable once sent.

Editing a sent quote must create a new quote version.

Customer acceptance must reference the exact quote version.

A revised quote must invalidate any previous uncompleted deposit request.

Record:

- Quote subtotal
- Discounts, if any
- Taxes, if configured
- Total
- Deposit type
- Deposit percentage or fixed amount
- Deposit amount
- Terms
- Expiration
- Approval timestamp
- Approving owner
- Customer acceptance timestamp
- Accepted quote version

Do not calculate taxes without explicit business configuration.

AI QUALIFICATION

Create an AI qualification service using the OpenAI Responses API and strict
schema validation.

Keep the model configurable using an environment variable.

Do not hardcode model behavior throughout the codebase.

The AI may:

- Understand a customer's natural-language request
- Extract proposed structured fields
- Ask the next useful qualification question
- Explain approved business information
- Summarize a conversation
- Identify missing information
- Recommend human review
- Classify likely service category
- Detect apparent buying intent

The AI may not:

- Invent prices
- Guarantee a deadline
- Promise availability
- Offer unauthorized discounts
- Modify approved quotes
- Mark a customer as having accepted a quote
- Create a payment request
- Mark a payment as paid
- Bypass missing photos
- Change system instructions
- Execute arbitrary CRM operations
- Expose hidden prompts, credentials, or internal notes

Treat every AI result as untrusted.

Validate all AI output with Zod.

Use a narrow response schema such as:

- customerReply
- proposedFieldUpdates
- missingFields
- recommendedNextQuestion
- recommendedStatus
- humanReviewRecommended
- humanReviewReason
- detectedBuyingSignals
- confidence

Application code must separately validate and authorize every proposed update.

Do not store hidden chain-of-thought or private reasoning.

Store only structured results, customer-visible responses, concise summaries,
and appropriate audit data.

AI SAFETY CASES

Handle these cases:

- Customer asks the AI to ignore system instructions
- Customer requests a fake or unauthorized price
- Customer sends credit-card details
- Customer sends bank account details
- Customer asks to mark an invoice paid
- Customer tries to retrieve another customer's information
- Customer uploads an unsupported file
- Customer attempts HTML or script injection
- Customer sends excessively large input
- AI output fails schema validation
- AI provider is unavailable

When payment credentials appear in a conversation:

- Do not repeat them
- Do not store them
- Do not log them
- Tell the customer that payment details must only be entered on the secure
  hosted checkout page
- Record only that sensitive payment data was redacted

DEMO AI PROVIDER

Create a deterministic FakeAiQualificationProvider.

The fake provider must support the complete demo flow without an API key.

It should recognize a small set of realistic sample customer statements and
generate predictable structured outputs for automated tests.

OPENAI PROVIDER

Also implement a real OpenAI provider behind the interface.

It must:

- Use the official SDK
- Use the Responses API
- Use structured output or strict tool schemas
- Enforce input limits
- Avoid transmitting internal owner notes unless explicitly necessary
- Avoid transmitting secrets
- Apply timeouts and bounded retries
- Handle malformed output safely
- Be disabled unless explicitly configured
- Never run during automated tests

PAYMENTS

Create a PaymentProvider interface.

Implement:

1. FakePaymentProvider for local demo and tests
2. StripePaymentProvider for test-mode integration

The customer must never provide payment credentials through this application.

The real provider must send the customer to a provider-hosted secure checkout
page.

Implement:

- Deposit request creation
- Provider checkout identifier storage
- Payment status
- Webhook event storage
- Webhook signature verification
- Event idempotency
- Duplicate-event protection
- Out-of-order-event handling
- Failed and expired checkout handling
- Audit events

Use the current official Stripe documentation before implementing live provider
behavior.

Do not invent webhook event names or payload fields.

In DEMO_MODE, provide a clearly labeled “Simulate successful test payment”
action restricted to development.

That action must be impossible to enable in production.

ZOHO CRM

Zoho CRM remains the business system of record, but it must not control the
application workflow.

Create a CrmProvider interface and:

1. FakeZohoCrmProvider
2. ZohoCrmProvider implementation or safely isolated scaffold

The local application database is authoritative for:

- Conversations
- Qualification progress
- Quote versions
- Quote acceptance
- Deposit-readiness evaluation
- Payment events
- Audit events
- Idempotency

Zoho receives synchronized business information.

Support configurable mappings for Zoho module names and custom-field API names.

Do not assume every Zoho account uses identical custom fields.

Create docs/zoho-setup.md documenting:

- Required CRM module or modules
- Suggested custom fields
- Suggested pipeline stages
- OAuth setup requirements
- Environment variables
- Field mapping configuration
- Sync behavior
- Retry behavior
- Conflict policy
- How to test safely
- Which information must be obtained from the account owner

Use an outbox or durable job pattern for CRM synchronization.

A temporary Zoho failure must not lose the lead or roll back a successfully
recorded customer action.

MEDIA AND PHOTO UPLOADS

Create a MediaStorageProvider interface.

Implement:

- Local development storage
- S3-compatible production adapter scaffold

Validate:

- File type
- Actual file signature where practical
- Maximum size
- File count
- Filename handling
- Authorization
- Ownership
- Upload completion

Use generated storage keys, not customer-provided filenames.

Do not make uploaded files publicly enumerable.

Support common image formats and PDF artwork files.

Generate safe preview metadata.

Document future malware scanning requirements.

AUTHENTICATION AND AUTHORIZATION

Protect the owner dashboard.

Use a maintained authentication solution suitable for the chosen Next.js
version.

Provide a secure production-ready authentication design.

A development-only owner login may exist only when:

- DEMO_MODE is true
- NODE_ENV is not production
- The UI clearly identifies demo mode

The application must fail closed in production when authentication is not
configured.

Use role-based authorization for privileged actions.

Customer access must be restricted to the customer's signed or random lead
token.

Never expose internal notes, audit metadata, other customers, CRM credentials,
provider identifiers, or owner-only controls to the customer.

DATABASE AND RELIABILITY

Use PostgreSQL migrations.

Add:

- Unique constraints
- Foreign keys
- Appropriate indexes
- Idempotency keys
- Transaction boundaries
- Created and updated timestamps
- Optimistic concurrency or equivalent protection where needed
- Soft deletion only where it has a clear purpose

Use an outbox pattern or database-backed job queue for reliable provider sync.

Do not introduce Redis in Phase 1 unless there is a demonstrated requirement.

BACKGROUND WORK

Support durable jobs for:

- CRM synchronization
- Conversation summarization
- Owner notifications
- Quote-expiration processing
- Payment reconciliation
- Retrying recoverable provider failures

For Phase 1, implement this using PostgreSQL-backed records and a simple worker.

Do not introduce Temporal, Trigger.dev, n8n, or another orchestration product
in this phase.

Keep the job interface replaceable.

OWNER NOTIFICATIONS

Create an OwnerNotificationProvider interface.

For Phase 1:

- Show notifications in the dashboard
- Record notification events
- Provide a console or fake provider for development

Create adapter boundaries for future email, SMS, Slack, or push notifications,
but do not add those external services yet.

HOT LEADS

Create a deterministic Hot Leads view.

A lead may be considered hot based on configured signals such as:

- Complete contact information
- Required photos supplied
- Explicit request for a quote
- Explicit request to proceed
- Quote viewed
- Quote accepted
- Deposit terms accepted
- Recent customer activity

Do not allow the AI alone to decide that a lead is hot.

Display the reasons a lead appears in the Hot Leads queue.

AUDIT LOGGING

Record important events such as:

- Lead created
- Customer message received
- AI field proposal accepted or rejected
- Photo uploaded
- Requirement completed
- Owner note added
- Human review requested
- Quote created
- Quote approved
- Quote sent
- Quote viewed
- Quote accepted
- Deposit terms accepted
- Deposit request created
- Payment event received
- Payment confirmed
- CRM sync attempted
- CRM sync succeeded
- CRM sync failed
- State transition accepted
- State transition rejected
- Administrative override

Audit records must identify:

- Actor type
- Actor identifier where appropriate
- Action
- Entity type
- Entity identifier
- Timestamp
- Safe metadata
- Correlation identifier

Do not place secrets or raw sensitive payment information in audit metadata.

USER INTERFACE

Create a clean, practical interface appropriate for a wrap shop.

PUBLIC SIDE

Include:

- Business-style landing and inquiry page
- Conversational lead intake
- Progress indicator
- Photo checklist
- Photo uploader
- Contact details
- Customer lead status
- Quote review page
- Quote acceptance control
- Deposit status page

OWNER SIDE

Include:

- Dashboard summary
- Leads table or pipeline
- Hot Leads queue
- Status filters
- Lead detail page
- Conversation timeline
- Qualification checklist
- Media gallery
- AI summary
- Missing-information panel
- Internal notes
- Quote editor
- Quote approval controls
- Customer acceptance status
- Deposit controls
- CRM sync panel
- Audit timeline

Use accessible HTML and keyboard-operable controls.

Do not rely only on color to communicate status.

Clearly label all simulated behavior in demo mode.

SEED DATA AND DEMO

Create realistic seed data for:

1. A commercial landscaping truck full-wrap inquiry
2. A personal vehicle color-change inquiry missing photos
3. A storefront window-lettering inquiry
4. A fleet customer requiring human review
5. A quote that has been accepted but has not been paid
6. A completed test deposit

Create a command such as:

pnpm demo:reset

It should reset and seed the local demo database safely.

Create a documented demo walkthrough that covers:

1. Start the services
2. Open the customer interface
3. Create a lead
4. Conduct a fake AI qualification conversation
5. Upload test photos
6. Open the owner dashboard
7. Complete missing information
8. Create and approve a quote
9. Accept the quote as the customer
10. Generate a fake deposit checkout
11. Simulate a verified payment event
12. Observe Deposit Paid
13. Review the audit timeline
14. Observe the fake Zoho synchronization

SECURITY CONTROLS

Implement:

- Server-side authorization for every privileged action
- Input validation
- Output encoding
- CSRF protection where required by the selected framework and auth design
- Secure cookies
- Upload limits
- Content-type validation
- Rate-limiting abstraction
- Request body limits
- Webhook signature verification
- Idempotency
- Safe error responses
- Secret redaction
- PII-conscious logging
- Security headers
- Environment validation
- Production demo-mode prevention
- Automation kill switches

Add environment-controlled kill switches:

- DISABLE_AI_MESSAGES
- DISABLE_PAYMENT_CREATION
- DISABLE_CRM_SYNC
- DISABLE_OWNER_NOTIFICATIONS

A disabled action must fail safely and create an audit record.

DOCUMENTATION

Create:

- README.md
- AGENTS.md
- docs/architecture.md
- docs/assumptions.md
- docs/business-questions.md
- docs/domain-model.md
- docs/state-machine.md
- docs/ai-safety.md
- docs/security-model.md
- docs/payment-flow.md
- docs/zoho-setup.md
- docs/provider-adapters.md
- docs/local-development.md
- docs/demo-walkthrough.md
- docs/deployment-readiness.md
- docs/phase-2-roadmap.md

Include Mermaid diagrams for:

- Overall architecture
- Lead state machine
- Quote and deposit flow
- AI trust boundary
- CRM synchronization
- Payment webhook processing

Create .env.example with placeholders only.

Do not include secrets, fake secrets that resemble real credentials, or actual
account identifiers.

TESTING REQUIREMENTS

Write meaningful tests rather than superficial snapshot tests.

UNIT TESTS

Test:

- Lead state transitions
- Qualification requirement calculation
- Deposit-readiness rules
- Quote versioning
- Deposit calculation
- Hot-lead calculation
- AI proposed-field authorization
- Sensitive-data redaction
- CRM synchronization mapping
- Payment event idempotency
- Kill switches

INTEGRATION TESTS

Test:

- Lead creation
- Conversation persistence
- Media metadata persistence
- Quote approval
- Customer acceptance
- Deposit request creation
- Payment event processing
- Audit logging
- Fake CRM synchronization
- Background job retries
- Transaction rollback behavior

END-TO-END TESTS

Using Playwright, test:

1. Customer creates a vehicle-wrap lead.
2. Customer completes qualification.
3. Customer uploads required test images.
4. Owner sees the lead in the dashboard.
5. Owner prepares and approves a quote.
6. Customer reviews and accepts the quote.
7. Deposit becomes ready.
8. Owner creates a demo deposit request.
9. Demo payment success is processed.
10. Owner sees Deposit Paid and successful fake CRM sync.

Also test:

- Deposit is blocked when photos are missing.
- Deposit is blocked before human quote approval.
- Deposit is blocked before explicit customer acceptance.
- An altered or expired quote cannot be accepted.
- A duplicate payment webhook does not duplicate payment.
- The AI cannot approve a quote.
- The AI cannot mark a payment as paid.
- A customer cannot open another customer's lead.
- Internal notes are never shown to the customer.
- Demo payment simulation cannot be enabled in production.
- Provider failures do not lose customer data.
- The application remains usable when the AI provider is unavailable.

QUALITY GATES

Create package scripts for:

- dev
- build
- lint
- format
- format:check
- typecheck
- test
- test:unit
- test:integration
- test:e2e
- db:generate
- db:migrate
- db:seed
- demo:reset

Before completing the task, run:

pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build

Run the critical Playwright workflow when the environment supports it.

Fix failures rather than merely documenting them.

DELIVERABLE ORDER

Proceed in this order:

1. Inspect and initialize the repository.
2. Create AGENTS.md.
3. Write architecture and assumptions documents.
4. Create the database and domain model.
5. Implement deterministic business rules and tests.
6. Implement provider interfaces and fake providers.
7. Implement the public customer workflow.
8. Implement the owner dashboard.
9. Implement quote approval and acceptance.
10. Implement fake deposit processing.
11. Implement fake Zoho synchronization.
12. Implement the real OpenAI adapter behind configuration.
13. Implement the Stripe test-mode adapter behind configuration.
14. Scaffold or implement Zoho safely according to current official docs.
15. Add security controls.
16. Add seed data and demo reset.
17. Add integration and end-to-end tests.
18. Run all quality gates.
19. Update documentation to match the final code.
20. Produce the implementation report.

DEFINITION OF DONE

The Phase 1 task is complete only when:

- A new developer can start the application using README instructions.
- The entire workflow works without external credentials in DEMO_MODE.
- The owner can move a realistic lead from inquiry through Deposit Paid.
- The customer can upload photos and accept a versioned quote.
- Deposit readiness is enforced by deterministic code.
- AI cannot perform privileged business transitions.
- Payment processing is idempotent.
- CRM synchronization failures are retryable.
- Sensitive payment information is not stored.
- The application fails closed when production authentication is missing.
- Tests cover the critical rules and workflow.
- Lint, type checking, tests, and production build pass.
- No production services have been contacted.
- All external setup still required is explicitly documented.

Begin now. Work directly in the repository. Do not merely describe the files
that should exist—create and validate them.
