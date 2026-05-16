# Scripts

Planned scripts for production automation.

## Manuscript builds

- `build-pdf.ps1`: generate PDF from `manuscript/MANIFEST.md`.
- `build-docx.ps1`: generate DOCX from `manuscript/MANIFEST.md`.
- `build-epub.ps1`: generate EPUB from `manuscript/MANIFEST.md`.
- `check-manifest.ps1`: verify that manifest paths exist.

## Audiobook builds

- `prepare-narration-scripts.ps1`: convert manuscript chapters into narration script drafts.
- `generate-openai-tts.ps1`: generate proof audio with OpenAI text-to-speech.
- `check-audio-manifest.ps1`: verify expected audio files exist.

## Implementation notes

Do not add scripts that require credentials until the environment and secret handling policy are defined.

The OpenAI API key should be read from `OPENAI_API_KEY` and must never be committed.
