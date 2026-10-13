# Native app architecture

The native app is independent of the marketing website. AppModel coordinates a single recording or processing job. Capture callbacks copy PCM into serial file writers; each source keeps its own chunks and timeline. Stopping flushes writers before recovering disk metadata. Models load sequentially to limit peak memory. The app releases the speech model before loading the notes model.

WhisperKit transcribes each completed audio part. Persisted part IDs are checkpoints. MLX writes topic notes for bounded transcript sections, then reduces those section summaries to an overview. Detailed sections remain available even when the overview cannot fit. Transcript labels denote microphone/system/import, not people. No custom model-serving backend.

Known engineering limits: audio callbacks allocate copies; disk buffering is not bounded under slow storage; microphone route changes need real-device validation; CAF recovery depends on a readable header; notes editing rewrites the manifest; timestamps from generated notes are not validated citations. Long-session reliability and Mac compilation are release gates, not assumed successes.
