/**
 * server/utils/validateSnapshot.js
 * Simple validation for incoming snapshot payloads.
 * Returns { valid: boolean, errors: [] }.
 */

export function validateSnapshotPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== "object") {
    errors.push("payload_required");
    return { valid: false, errors };
  }

  const { filename, path, language, content } = payload;

  if (!filename || typeof filename !== "string") {
    errors.push("filename_required_string");
  }
  if (!path || typeof path !== "string") {
    errors.push("path_required_string");
  }
  if (!language || typeof language !== "string") {
    errors.push("language_required_string");
  }
  // content can be empty string but must be present
  if (typeof content === "undefined") {
    errors.push("content_required");
  }

  return { valid: errors.length === 0, errors };
}
