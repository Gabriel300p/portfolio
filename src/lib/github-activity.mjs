export const SOURCE = 'https://github-contributions-api.jogruber.de/v4/Gabriel300p?y=last';
export const PROFILE = 'https://github.com/Gabriel300p';
export const TIMEOUT_MS = 8000;
const DAY_MS = 86_400_000;

/** @typedef {{ date: string, count: number, level: number }} Contribution */
/** @typedef {{ total: number, days: Contribution[], start: string, end: string, activeDays: number }} Calendar */
/** @typedef {{ source: string, collectedAt: string, data: unknown }} Snapshot */
/** @typedef {({ status: 'live' | 'cached', collectedAt: string } & Calendar) | { status: 'unavailable' }} Activity */

function dateMs(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('Invalid contribution date');
  }
  const ms = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 10) !== value) {
    throw new Error('Invalid contribution date');
  }
  return ms;
}

function nonnegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

/** Validate a complete rolling year without filling gaps or trusting the total alone.
 * GitHub's window can cross a leap day. Dates and calendar layout always use UTC.
 * @param {unknown} input
 * @param {string} collectedAt
 * @returns {Calendar}
 */
export function validateCalendar(input, collectedAt) {
  if (typeof collectedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(collectedAt)
    || !Number.isFinite(Date.parse(collectedAt)) || new Date(collectedAt).toISOString() !== collectedAt) {
    throw new Error('Invalid collection timestamp');
  }
  const data = /** @type {{ total?: { lastYear?: unknown }, contributions?: unknown }} */ (input);
  if (!data || !nonnegativeInteger(data.total?.lastYear) || !Array.isArray(data.contributions)
    || data.contributions.length < 365 || data.contributions.length > 366) {
    throw new Error('Invalid or incomplete contribution response');
  }
  /** @type {Contribution[]} */
  const days = data.contributions.map(day => {
    dateMs(day?.date);
    if (!nonnegativeInteger(day.count) || !Number.isInteger(day.level) || day.level < 0 || day.level > 4
      || (day.count === 0) !== (day.level === 0)) {
      throw new Error('Invalid contribution values');
    }
    return { date: day.date, count: day.count, level: day.level };
  }).sort((a, b) => a.date.localeCompare(b.date));
  const start = days[0].date;
  const end = days.at(-1).date;
  const endMs = dateMs(end);
  const collectionDay = dateMs(collectedAt.slice(0, 10));
  // The public API caches responses; allow the preceding UTC day at midnight.
  if (endMs > collectionDay || endMs < collectionDay - DAY_MS) {
    throw new Error('Contribution period does not match collection date');
  }
  const previousYear = new Date(endMs);
  previousYear.setUTCFullYear(previousYear.getUTCFullYear() - 1);
  // Clamp Feb 29 to Feb 28 when the previous year is not a leap year.
  if (previousYear.getUTCMonth() !== new Date(endMs).getUTCMonth()) previousYear.setUTCDate(0);
  const expectedStart = previousYear.getTime() + DAY_MS;
  if (dateMs(start) !== expectedStart || days.length !== (endMs - expectedStart) / DAY_MS + 1) {
    throw new Error('Incomplete contribution period');
  }
  let sum = 0;
  for (let index = 0; index < days.length; index++) {
    if (dateMs(days[index].date) !== expectedStart + index * DAY_MS) {
      throw new Error('Missing or duplicate contribution day');
    }
    sum += days[index].count;
  }
  if (!Number.isSafeInteger(sum) || sum !== data.total.lastYear) {
    throw new Error('Contribution total does not match daily counts');
  }
  return { total: sum, days, start, end, activeDays: days.filter(day => day.count > 0).length };
}

/** One request per call, bounded through body parsing as well as connection time.
 * The homepage calls this once during static rendering. Never writes the snapshot.
 * @param {{ snapshot?: unknown, transport?: typeof fetch, now?: () => Date, timeoutMs?: number }} options
 * @returns {Promise<Activity>}
 */
export async function loadGitHubActivity({ snapshot, transport = fetch, now = () => new Date(), timeoutMs = TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  let timer;
  try {
    const expired = new Promise((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error('GitHub activity request timed out'));
      }, timeoutMs);
    });
    const request = async () => {
      const response = await transport(SOURCE, { signal: controller.signal });
      if (!response.ok) throw new Error(`GitHub activity HTTP ${response.status}`);
      return response.json();
    };
    const data = await Promise.race([request(), expired]);
    const collectedAt = now().toISOString();
    return { status: 'live', collectedAt, ...validateCalendar(data, collectedAt) };
  } catch {
    try {
      const cached = /** @type {Snapshot} */ (snapshot);
      if (cached?.source !== SOURCE || Date.parse(cached.collectedAt) > now().getTime()) {
        throw new Error('Invalid snapshot provenance');
      }
      return { status: 'cached', collectedAt: cached.collectedAt, ...validateCalendar(cached.data, cached.collectedAt) };
    } catch {
      return { status: 'unavailable' };
    }
  } finally {
    clearTimeout(timer);
  }
}

/** Calendar weeks include blank padding outside the period, never zero-filled days.
 * @param {Contribution[]} days
 */
export function calendarLayout(days) {
  const offset = new Date(dateMs(days[0].date)).getUTCDay();
  const weeks = Math.ceil((offset + days.length) / 7);
  const cells = days.map((day, index) => ({ ...day, week: Math.floor((offset + index) / 7), weekday: (offset + index) % 7 }));
  const months = cells.filter((day, index) => (index === 0 || day.date.slice(8) === '01') && day.week <= weeks - 3)
    .map(day => ({ week: day.week, label: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(new Date(`${day.date}T00:00:00Z`)) }));
  return { cells, months, weeks };
}

/** @param {string} date */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
}
