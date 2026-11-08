import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SOURCE, TIMEOUT_MS, validateCalendar, loadGitHubActivity, calendarLayout, formatDate } from '../src/lib/github-activity.mjs';

const collectedAt = '2026-11-08T14:00:00.000Z';
const now = () => new Date(collectedAt);
const DAY = 86_400_000;
function fixture({ start = '2025-11-09', length = 365, count = 2 } = {}) {
  const startMs = Date.parse(`${start}T00:00:00Z`);
  return {
    total: { lastYear: length * count },
    contributions: Array.from({ length }, (_, index) => ({
      date: new Date(startMs + index * DAY).toISOString().slice(0, 10), count, level: count ? 1 : 0,
    })),
  };
}
const snapshot = () => ({ source: SOURCE, collectedAt, data: fixture() });
const offline = async () => { throw new Error('Offline'); };
const ok = data => async () => ({ ok: true, json: async () => data });

test('valid data is sorted, counted and summarized without changing the input', () => {
  const data = fixture();
  data.contributions.reverse();
  const result = validateCalendar(data, collectedAt);
  assert.equal(result.total, 730);
  assert.equal(result.activeDays, 365);
  assert.equal(result.start, '2025-11-09');
  assert.equal(result.end, '2026-11-08');
  assert.equal(data.contributions[0].date, '2026-11-08');
});

test('a complete year of real zeros is valid', () => {
  const result = validateCalendar(fixture({ count: 0 }), collectedAt);
  assert.equal(result.total, 0);
  assert.equal(result.activeDays, 0);
  assert.equal(result.days.length, 365);
});

test('leap years and Feb 29 are handled using calendar dates', () => {
  for (const [start, end] of [['2023-03-01', '2024-02-29'], ['2023-03-04', '2024-03-03']]) {
    const result = validateCalendar(fixture({ start, length: 366 }), `${end}T12:00:00.000Z`);
    assert.equal(result.start, start);
    assert.equal(result.end, end);
  }
});

test('malformed response shapes, values, dates and inconsistent totals are rejected', async t => {
  const cases = [
    ['null', () => null],
    ['error response', () => ({ error: 'Not found' })],
    ['missing total', data => { delete data.total; return data; }],
    ['string total', data => { data.total.lastYear = '730'; return data; }],
    ['different total', data => { data.total.lastYear++; return data; }],
    ['negative total', data => { data.total.lastYear = -1; return data; }],
    ['non-array days', data => { data.contributions = {}; return data; }],
    ['null day', data => { data.contributions[0] = null; return data; }],
    ['negative count', data => { data.contributions[0].count = -1; return data; }],
    ['fractional count', data => { data.contributions[0].count = 1.5; return data; }],
    ['string count', data => { data.contributions[0].count = '2'; return data; }],
    ['unsafe count', data => { data.contributions[0].count = Number.MAX_SAFE_INTEGER + 1; return data; }],
    ['missing count', data => { delete data.contributions[0].count; return data; }],
    ['invalid level', data => { data.contributions[0].level = 5; return data; }],
    ['negative level', data => { data.contributions[0].level = -1; return data; }],
    ['fractional level', data => { data.contributions[0].level = 0.5; return data; }],
    ['string level', data => { data.contributions[0].level = '1'; return data; }],
    ['contradictory zero', data => { data.contributions[0].level = 0; return data; }],
    ['invalid date', data => { data.contributions[0].date = '2025-11-31'; return data; }],
    ['non-ISO date', data => { data.contributions[0].date = '11/09/2025'; return data; }],
    ['impossible leap day', data => { data.contributions[0].date = '2026-02-29'; return data; }],
  ];
  for (const [name, mutate] of cases) {
    await t.test(name, () => assert.throws(() => validateCalendar(mutate(fixture()), collectedAt)));
  }
});

test('partial, duplicate and wrong-boundary calendars never become zero-filled graphs', () => {
  for (const index of [0, 180, 364]) {
    const data = fixture();
    data.contributions.splice(index, 1);
    assert.throws(() => validateCalendar(data, collectedAt));
  }
  const duplicate = fixture();
  duplicate.contributions[180] = { ...duplicate.contributions[179] };
  assert.throws(() => validateCalendar(duplicate, collectedAt), /Missing or duplicate/);
  const missingLeapBoundary = fixture({ start: '2023-03-02', length: 365 });
  assert.throws(() => validateCalendar(missingLeapBoundary, '2024-02-29T12:00:00.000Z'), /Incomplete/);
  const extra = fixture({ start: '2025-11-08', length: 366 });
  assert.throws(() => validateCalendar(extra, collectedAt), /Incomplete/);
});

test('collection timestamps must be valid and match the calendar, with one day cache tolerance', () => {
  for (const timestamp of [null, 'bad', '2026-11-08', '2026-11-31T14:00:00.000Z', '2026-11-07T14:00:00.000Z', '2026-11-10T14:00:00.000Z']) {
    assert.throws(() => validateCalendar(fixture(), timestamp));
  }
  assert.equal(validateCalendar(fixture(), '2026-11-09T00:10:00.000Z').total, 730);
});

test('live loading makes exactly one request to the approved endpoint and uses an injected clock', async () => {
  let calls = 0;
  const result = await loadGitHubActivity({ now, snapshot: snapshot(), transport: async (url, options) => {
    calls++;
    assert.equal(url, SOURCE);
    assert.ok(options.signal instanceof AbortSignal);
    return { ok: true, json: async () => fixture({ count: 0 }) };
  } });
  assert.equal(calls, 1);
  assert.equal(result.status, 'live');
  assert.equal(result.total, 0);
  assert.equal(result.collectedAt, collectedAt);
});

test('network, HTTP, invalid JSON and invalid data failures use the previous snapshot', async t => {
  for (const [name, transport] of [
    ['network', offline],
    ['HTTP', async () => ({ ok: false, status: 503, json: async () => { throw new Error('Must not read'); } })],
    ['JSON', async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } })],
    ['invalid data', ok({ total: { lastYear: 0 }, contributions: [] })],
  ]) {
    await t.test(name, async () => {
      const previous = snapshot();
      const before = JSON.stringify(previous);
      const result = await loadGitHubActivity({ transport, now: () => new Date('2027-01-01T00:00:00Z'), snapshot: previous });
      assert.equal(result.status, 'cached');
      assert.equal(result.total, 730);
      assert.equal(result.collectedAt, collectedAt);
      assert.equal(result.start, '2025-11-09');
      assert.equal(JSON.stringify(previous), before);
    });
  }
});

test('timeout aborts the only request and falls back, even if transport ignores abort', async () => {
  assert.equal(TIMEOUT_MS, 8000);
  let signal;
  let calls = 0;
  const result = await loadGitHubActivity({ now, snapshot: snapshot(), timeoutMs: 5, transport: async (_, options) => {
    calls++;
    signal = options.signal;
    return new Promise(() => {});
  } });
  assert.equal(signal.aborted, true);
  assert.equal(calls, 1);
  assert.equal(result.status, 'cached');
});

test('the timeout also covers a stalled response body, with no fallback yielding unavailable', async () => {
  const result = await loadGitHubActivity({ now, timeoutMs: 5, transport: async () => ({ ok: true, json: () => new Promise(() => {}) }) });
  assert.deepEqual(result, { status: 'unavailable' });
});

test('missing, corrupt, future or unrelated fallback metadata yields unavailable without totals', async () => {
  const badData = snapshot();
  badData.data.contributions.pop();
  for (const cached of [undefined, null, {}, badData,
    { ...snapshot(), source: 'https://example.com' },
    { ...snapshot(), collectedAt: 'bad' },
    { ...snapshot(), collectedAt: '2026-11-08T16:00:00.000Z' },
  ]) {
    assert.deepEqual(await loadGitHubActivity({ transport: offline, now, snapshot: cached }), { status: 'unavailable' });
  }
});

test('a bad snapshot cannot suppress valid live data', async () => {
  const result = await loadGitHubActivity({ transport: ok(fixture()), now, snapshot: {} });
  assert.equal(result.status, 'live');
});

test('calendar padding is blank space outside the period, with correct Sunday alignment', () => {
  const days = fixture({ start: '2023-03-04', length: 366 }).contributions;
  const layout = calendarLayout(days);
  assert.equal(layout.cells.length, 366);
  assert.equal(layout.weeks, 54);
  assert.equal(layout.cells[0].weekday, 6);
  assert.equal(layout.cells[0].week, 0);
  assert.equal(layout.cells[1].weekday, 0);
  assert.equal(layout.cells[1].week, 1);
  assert.equal(layout.cells.at(-1).date, '2024-03-03');
  assert.equal(layout.months[0].label, 'Mar');
  assert.ok(layout.months.every(month => month.week <= layout.weeks - 3));
  assert.equal(formatDate('2026-11-08T00:10:00.000Z'), '8 Nov 2026');
});

test('the real checked-in public snapshot remains valid and usable offline', async () => {
  const cached = JSON.parse(await readFile(new URL('../src/data/github-activity.snapshot.json', import.meta.url), 'utf8'));
  const result = await loadGitHubActivity({ transport: offline, now: () => new Date(cached.collectedAt), snapshot: cached });
  assert.equal(result.status, 'cached');
  assert.equal(result.total, cached.data.total.lastYear);
  assert.equal(result.days.length, 365);
});
