# OpenAI TTS Narration Plan

This project will use OpenAI text-to-speech for audiobook narration.

Docs checked: 2026-05-16.

Official references:

- Text-to-speech guide: https://developers.openai.com/api/docs/guides/text-to-speech
- Speech API reference: https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create

## Current default

Use the Audio API speech endpoint with `gpt-4o-mini-tts` unless production testing selects another supported model.

OpenAI's current text-to-speech guide identifies `gpt-4o-mini-tts` as the newest and most reliable TTS model and lists `tts-1` and `tts-1-hd` as other TTS models. The API reference lists supported built-in voices and output formats.

## Voice direction

Desired voice:

- Calm.
- Clear.
- Serious but not academic.
- Field-manual cadence.
- No hype.
- Good for long-form listening.

Candidate voices to test:

- `marin`
- `cedar`
- `coral`
- `onyx`

The production voice should be selected after listening to full chapter proofs, not short samples only.

## Audio disclosure

The audiobook release must clearly disclose that the narration is AI-generated.

Suggested disclosure:

```text
This audiobook is narrated using AI-generated voice technology.
```

## Narration script preparation

Before TTS generation, convert manuscript chapters into narration scripts:

- Replace tables with spoken summaries.
- Summarize code blocks unless exact wording matters.
- Expand abbreviations on first use.
- Add pronunciation notes for product names.
- Remove file paths that do not help audio listeners.
- Keep key lines verbatim.

## Suggested request shape

Use structured per-chapter generation settings:

```json
{
  "model": "gpt-4o-mini-tts",
  "voice": "marin",
  "response_format": "wav",
  "instructions": "Narrate in a calm, precise field-manual style. Avoid theatrical delivery. Emphasize short manifesto lines with a brief pause.",
  "input_file": "audio/narration-scripts/01-vibe-coding-is-real.md",
  "output_file": "dist/audio/proof/01-vibe-coding-is-real.wav"
}
```

## Production format

Recommended workflow:

1. Generate proof audio as `wav` for review.
2. Listen through and mark corrections.
3. Regenerate corrected chapters.
4. Master final audio.
5. Export distribution files as required by the target platform.

## QA checklist

- [ ] Chapter title matches manuscript.
- [ ] Key lines are spoken cleanly.
- [ ] No table is read as a confusing grid.
- [ ] Code blocks are handled intentionally.
- [ ] Product names are pronounced consistently.
- [ ] There are no duplicated paragraphs.
- [ ] There are no missing sections.
- [ ] Audio disclosure is present in the release package.
