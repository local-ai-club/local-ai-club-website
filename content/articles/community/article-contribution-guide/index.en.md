---
title: How to contribute an article to Local AI Club
summary: Submit bilingual articles as a Markdown pair. Paths, frontmatter and body must stay aligned, and unverifiable claims stay out.
tags:
  - Beginner
  - Contribution guide
difficulty: beginner
readTime: 8
author: Local AI Club
publishedAt: 2026-09-15
updatedAt: 2026-09-15
reproStatus: pending
version: "0.1"
license: CC-BY-4.0
status: published
---

Local AI Club articles live in Git and compile into static pages at build time. Chinese is the default site language; English lives under `/en`. A complete submission is both languages, saying the same thing.

This guide covers **website articles** only. It does not open chat groups, event signup, or any channel that is not already public.

## Where articles live

Files must arrive as a pair and share one section plus one slug:

```text
content/articles/{section}/{slug}/index.zh.md
content/articles/{section}/{slug}/index.en.md
```

Three rules:

1. `{section}` must be one of `learn`, `benchmarks`, `projects`, `agents`, `bounties`, `community`.
2. `{slug}` is English kebab-case and identical in both files.
3. Do not put the language in the folder name or slug. Language comes only from the filename.

This guide's own path is the example:

```text
content/articles/community/article-contribution-guide/index.zh.md
content/articles/community/article-contribution-guide/index.en.md
```

Use the published starter [Run your first local model on an ordinary computer](/en/learn/run-first-local-model) as a second reference.

## Which fields to translate

Keep these values identical. **Do not translate them:**

- `difficulty`, `readTime`, `author`, `publishedAt`, `updatedAt`
- `reproStatus`, `version`, `license`, `status`
- `environment.os`, `environment.engine`

Translate these, and keep the meaning aligned:

- `title`, `summary`, `tags`
- `environment.model` (when present)

`tags` must have the same count and meaning. Chinese uses labels such as 入门 / 进阶 / 高级; English uses `Beginner` / `Intermediate` / `Advanced`. `status` is paired: one file cannot be `published` while the other is `draft`. Keep both on `draft` until the pair is ready. Only a pair with `published` on both sides appears in section lists and static routes.

A minimal frontmatter block can look like this. Start on `draft`:

```yaml
title: Your title in this language
summary: One-sentence summary in this language
tags:
  - Beginner
difficulty: beginner
readTime: 8
author: Your name
publishedAt: 2026-09-15
reproStatus: pending
version: "0.1"
license: CC-BY-4.0
status: draft
```

## How the body must line up

Idiomatic translation is fine. Literal word-for-word translation is not. Do not add, remove, or weaken a fact, step, limit, or conclusion that the other language already states.

Both versions must also keep:

- The same heading levels and order
- The same list length and step numbers
- The same outbound URLs, and those URLs must exist
- The same code fences: language tag, commands, flags, model IDs and paths stay byte-for-byte identical. Translate only the prose around them

Do not invent projects, docs, chat groups, events, partnerships, benchmark numbers, or product capabilities. If a number, ranking, or “official result” cannot be checked from the article or a public source, delete it. The brand is **Local AI Club**, with `Local AI` written as two words. This community is not part of the [LocalAI](https://localai.io/) open-source project.

## How to submit

The repository is [local-ai-club/local-ai-club-website](https://github.com/local-ai-club/local-ai-club-website). There is no separate article admin.

1. Fork or clone the repo and branch from the current default branch.
2. Add both Markdown files on the path above.
3. Leave `status` as `draft` until the pair is aligned, then switch both to `published`.
4. Run the project checks from the repo root:

```bash
npm test
```

5. Open a pull request that includes both language files in the same change.

Review looks for a complete pair, aligned claims, unmoved code and links, and no unverifiable statements.

## Checklist before you send

1. Both files exist, with the same section and slug.
2. Titles, summaries, claims and steps match one-to-one.
3. Code blocks and links have not drifted apart.
4. Shared frontmatter was not translated by mistake.
5. Nothing landed that cannot be checked from the article or a public source.
