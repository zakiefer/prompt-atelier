# Prompt Corpus Markdown Export

These files are generated from `public/attachment-prompts.json` with:

```bash
npm run export:prompts
```

The curated source corpus lives under `src/prompts/`. This folder is only a human-readable export of explicitly allowlisted attachment imports.

`public/attachment-prompts.json` is an optional generated import file. It must only contain explicitly allowlisted website prompts, never broad historical Codex attachments from unrelated projects.
