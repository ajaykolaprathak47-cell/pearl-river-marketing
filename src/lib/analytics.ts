/**
 * Event tracking hook.
 *
 * No analytics tool is installed, so this does nothing today and no tracking
 * cookies are set. Elements carry data-track="event_name" (phone_click,
 * email_click, cta_*, consultation_submit) so events are ready to wire up.
 *
 * To enable later:
 *  1. Install an analytics tool and add a consent banner if the tool needs one.
 *  2. Implement `send` below to forward { name } to that tool.
 *  3. Update the Privacy Policy to name the tool.
 * Never pass form field values or other personal data to analytics.
 */
export type TrackEvent =
  | 'phone_click'
  | 'email_click'
  | 'consultation_submit'
  | `cta_${string}`;

function send(_name: TrackEvent): void {
  // Intentionally empty until an analytics tool and consent are configured.
}

export function track(name: TrackEvent): void {
  try {
    send(name);
  } catch {
    // Tracking must never break the page.
  }
}

export function initTracking(): void {
  document.addEventListener('click', (event) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>('[data-track]');
    const name = el?.dataset.track;
    if (name) track(name as TrackEvent);
  });
}
