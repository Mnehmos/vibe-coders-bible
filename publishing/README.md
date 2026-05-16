# Publishing

This directory defines the production plan for releasing the book as PDF, DOCX, ebook, and audiobook.

## Source of truth

- Manuscript source: `manuscript/`
- Build order: `manuscript/MANIFEST.md`
- Metadata: `manuscript/metadata.yml`
- Reusable templates: `templates/`

## Output targets

| Format | Intended use | Notes |
| --- | --- | --- |
| PDF | Print-style reading and distribution | Needs page layout, front matter, table of contents, links |
| DOCX | Editing, review, and publishing handoff | Useful for comments, redlines, copyedit workflow |
| EPUB | Ebook distribution | Needs clean headings, metadata, internal links |
| Audiobook | Spoken edition | Uses OpenAI text-to-speech with chapter-level QA |

## Production stages

1. Draft chapter scaffolds.
2. Expand chapters into full prose.
3. Copyedit for print and audio.
4. Generate PDF, DOCX, and EPUB from the manifest.
5. Convert chapters into narration scripts.
6. Generate TTS chapter audio.
7. QA audio against text.
8. Master final audio files.
9. Package release assets and checksums.

## Planned output tree

```text
dist/
  pdf/
  docx/
  ebook/
  audio/
    proof/
    mastered/
```

`dist/` is ignored by git. Release artifacts should be attached to GitHub releases or a publishing platform, not committed by default.
