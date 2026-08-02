# Music Service Integration Boundary — Crystal Code Quest

> **Status:** verified by local HTTP discovery only. No new audio generated during this verification.  
> **Scope:** this document records the boundary for future integration; it does not implement any audio hooks, components, or assets.

## Verified service

| Property | Value |
| --- | --- |
| API title | ACE-Step API |
| Version | 1.0 |
| Local host | `127.0.0.1:8001` |
| Process command | `acestep-api --host 127.0.0.1 --port 8001` *(exact local path redacted)* |
| Loaded model | `acestep-v15-turbo` — confirmed by `/health` and `/v1/models` |
| Model ID in `/v1/models` | `acestep/acestep-v15-turbo` |

The exact model identity is proven by the service’s own health and model inventory responses. The `/v1/audio?path=...` query alone is **not** treated as proof of model identity.

## Verified localhost endpoints

| Endpoint | Method | Purpose | Notes |
| --- | --- | --- | --- |
| `/health` | GET | Service health and loaded model | No authentication required |
| `/v1/models` | GET | OpenRouter-compatible model list | No authentication required |
| `/v1/stats` | GET | Job queue statistics | No authentication required |
| `/release_task` | POST | Create a queued music generation job | Optional `authorization` header |
| `/query_result` | POST | Query results for one or more task IDs | Optional `authorization` header |
| `/v1/audio` | GET | Retrieve a generated audio file by server-local path | Optional `authorization` header; path restricted to allowed directory |
| `/v1/chat/completions` | POST | OpenRouter-compatible chat completions for music generation | Optional `authorization` header |

Authentication is **not required** for local use. All endpoints accept an optional `authorization` header but respond without it.

The service is callable through plain HTTP and does not require a Python client.

## Generation vs retrieval

- `/release_task` creates a generation job. The observed response is:

  ```json
  {
    "data": {
      "task_id": "<uuid>",
      "status": "queued",
      "queue_position": 1
    },
    "code": 200,
    "error": null,
    "timestamp": <unix-ms>
  }
  ```

- `/query_result` queries the status or result of one or more task IDs. The response is wrapped in the same `{data, code, error, timestamp}` envelope.

- `/v1/audio` does **not** generate audio. It serves a previously generated audio file by a server-local `path` parameter. Access is restricted to a configured allowed directory; paths outside that directory return `403 Forbidden`.

  Example denial response:

  ```json
  {"detail": "Access denied: path outside allowed directory"}
  ```

- `/v1/chat/completions` is an OpenRouter-compatible endpoint that can also submit music generation requests and wait for completion.

## Observed audio properties

From the previous bounded probe (file already removed):

| Property | Value |
| --- | --- |
| HTTP status | 200 |
| Format | MP3 (MPEG Layer III) |
| ID3 version | v2.4 |
| Bit rate | 128 kbps |
| Sample rate | 48 kHz |
| Channels | stereo |
| Approximate size | 2,640,813 bytes |

## Integration rules for Crystal Code Quest

- Phase 1 makes **no audio calls**. No sound file is generated or played in this milestone.
- Future audio integration must be implemented through a **server-side boundary** inside Crystal Code Quest, not directly from the browser.
- The browser must **never** call the music service host or paths directly.
- No music or sound may autoplay on the initial dashboard load.
- Music cues are allowed only for selected interactions (for example, Parent Guide attention/success/warning and Crystal Builder start/thinking/success/safe-failure), not on every animation.
- The service path parameter must be treated as an internal server value; any filesystem path must be redacted before logging or exposing to the child.

## Audio format decision

The service emits MP3. Crystal Code Quest’s future design reference specifies approved `.ogg` music files. Therefore, **OGG conversion will be required** before the generated audio is used as a production asset in the app.

## Python requirement

- A **Python client is not required** to call the service from the application; HTTP is sufficient.
- The service itself is a Python process running locally. The application server can call it using any HTTP client (Node.js `fetch`, undici, etc.).
- The Crystal Code Quest repository must **not** include a Python/uv project or music generation scripts.

## Security and privacy notes

- Keep the local service bound to `127.0.0.1` only.
- Do not expose `/v1/audio` path parameters to the child UI or to client-side code.
- Do not log task IDs or audio paths alongside child identity or quest data.
- Do not store generated audio in the repository unless it becomes a reviewed production asset.

## Related files

- `docs/assets/character-specs.md` — music cue rules and character animation states
- `docs/assets/parent-guide.md` — Parent Guide asset specification
- `docs/assets/crystal-builder.md` — Crystal Builder asset specification
- `docs/design/concept-art/crystal-code-quest-master-visual-direction.png` — canonical visual reference

## Open questions

- The exact JSON schema for `/release_task` and `/query_result` request bodies is not fully documented in the OpenAPI response; request bodies are accepted as JSON but the available fields are not exposed in `/openapi.json`.
- The exact server-local allowed directory for `/v1/audio` is configured in the service and should not be hard-coded in Crystal Code Quest.
- Whether a CORS or proxy configuration will be needed for future local development is deferred until the audio integration phase begins.
