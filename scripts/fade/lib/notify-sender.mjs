// notify-sender.mjs — shared LG-036 mailbox sender for FADE patrol/detect scripts.
// Contract (precedent: scripts/fade/ledger-watchlist-patrol.mjs):
//   POST ${TRIMC_NOTIFY_SG_URL}/internal/v1/notify
//   headers: X-Internal-Token, Content-Type: application/json
//   body: { source_seat, target_daemon, targets[], urgent, title, body }
// Rules:
//   - Throws on failure (caller MUST NOT mark anything "notified" unless this resolves).
//   - Never logs token values (len + 4-char prefix fingerprint only).
//   - This is the M-plane local leg: it posts to the sg TriMMC mailbox endpoint
//     (bod target rides daemon='trimlc' per watchlist-patrol precedent).

const LOG_PREFIX = "[fade:notify-sender]";

function tokenFingerprint(v) {
  if (!v) return "(absent)";
  return `len${v.length} ${v.slice(0, 4)}****`;
}

export function resolveNotifyConfig(env = process.env) {
  const url = env.TRIMC_NOTIFY_SG_URL || "";
  const token = env.TRIMC_NOTIFY_SG_TOKEN || "";
  return { url: url.replace(/\/+$/, ""), token, hasToken: Boolean(token) };
}

/**
 * Send one mailbox message. Resolves {ok:true, status} or throws Error.
 * Caller contract (三钉②): treat throw as "not sent" — never record notified state.
 */
// source_seat note (2026-09-30 evening batch, CTO-ratified A-case): sg TriMMC 8710
// enforces a source-seat whitelist (outbox.ts SOURCE_SEAT_WHITELIST MVP =
// m-duty-cos/bod/m-cos/m-coo). Patrol/detect infra sends ride the duty-COS system
// channel identity (mechanism seat, not a personal seat).
//
// GUARDRAIL (CTO 升约, binding lib contract): any send riding a MECHANISM seat
// identity MUST carry real-name attribution — the `attribution` argument is
// mandatory for mechanism seats and is prepended to the body. Missing
// attribution throws (fail-closed) so future callers cannot borrow the
// mechanism channel anonymously.
const MECHANISM_SEATS = new Set(["m-duty-cos"]);

export async function sendNotify({
  targets,
  title,
  body,
  attribution,
  sourceSeat = "m-duty-cos",
  targetDaemon = "trimlc",
  urgent = "normal",
  env = process.env,
  timeoutMs = 10000,
}) {
  if (MECHANISM_SEATS.has(sourceSeat) && !attribution) {
    throw new Error(
      `${LOG_PREFIX} mechanism-seat send (${sourceSeat}) requires real-name 'attribution' (guardrail: no anonymous mechanism-channel sends)`,
    );
  }
  const fullBody = attribution ? `[来自: ${attribution}]\n${body}` : body;
  const { url, token } = resolveNotifyConfig(env);
  if (!url) throw new Error(`${LOG_PREFIX} TRIMC_NOTIFY_SG_URL not configured`);
  if (!token) throw new Error(`${LOG_PREFIX} TRIMC_NOTIFY_SG_TOKEN not configured (token=${tokenFingerprint(token)})`);
  if (!Array.isArray(targets) || targets.length === 0) {
    throw new Error(`${LOG_PREFIX} targets must be a non-empty array`);
  }

  const payload = {
    source_seat: sourceSeat,
    target_daemon: targetDaemon,
    targets,
    urgent,
    title: String(title).slice(0, 200),
    body: String(fullBody).slice(0, 4000),
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${url}/internal/v1/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${LOG_PREFIX} notify POST failed: HTTP ${res.status} ${text.slice(0, 200)}`);
    }
    return { ok: true, status: res.status };
  } finally {
    clearTimeout(timer);
  }
}
