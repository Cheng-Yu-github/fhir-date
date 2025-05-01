// dateHelpers.js

const FHIR_DATE_PATTERNS = {
  year: /^\d{4}$/,
  yearMonth: /^\d{4}-\d{2}$/,
  fullDate: /^\d{4}-\d{2}-\d{2}$/,
  dateTime: /^\d{4}-\d{2}-\d{2}T.*/,
};

const END_OF_DAY = 'T23:59:59.999Z';
const START_OF_DAY = 'T00:00:00.000Z';

export function getImplicitRangeFromDateTime(value) {
  if (!value) return [null, null];

  const date = new Date(value);
  if (isNaN(date.getTime())) return [null, null];

  const start = new Date(date);
  const end = new Date(date);

  if (/^\d{4}$/.test(value)) {
    // Year only
    end.setFullYear(end.getFullYear() + 1);
  } else if (/^\d{4}-\d{2}$/.test(value)) {
    // Year-Month
    end.setMonth(end.getMonth() + 1);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // Full date
    end.setDate(end.getDate() + 1);
  } else if (value.length <= 16) {
    // Includes time (hours/minutes)
    end.setMinutes(end.getMinutes() + 1);
  } else {
    end.setSeconds(end.getSeconds() + 1);
  }

  return [start, end];
}

export function extractDateRange(resource, fieldPath) {
  const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], resource);

  if (!value) return [null, null];

  if (typeof value === 'string') {
    // It's a dateTime
    return getImplicitRangeFromDateTime(value);
  }

  if (value.start || value.end) {
    // It's a Period object
    const start = value.start ? new Date(value.start) : null;
    const end = value.end ? new Date(value.end) : null;
    return [start, end];
  }

  return [null, null];
}

function toDate(str, isEnd = false) {
  if (FHIR_DATE_PATTERNS.year.test(str)) {
    return new Date(isEnd ? `${str}-12-31${END_OF_DAY}` : `${str}-01-01${START_OF_DAY}`);
  }
  if (FHIR_DATE_PATTERNS.yearMonth.test(str)) {
    const [year, month] = str.split('-');
    const endDate = new Date(Date.UTC(year, month, 0));
    if (isEnd) return new Date(`${endDate.toISOString().split('T')[0]}${END_OF_DAY}`);
    return new Date(`${year}-${month}-01${START_OF_DAY}`);
  }
  if (FHIR_DATE_PATTERNS.fullDate.test(str)) {
    return new Date(isEnd ? `${str}${END_OF_DAY}` : `${str}${START_OF_DAY}`);
  }
  return new Date(str); // dateTime or instant
}

export function parseFHIRDateRange(dateStr) {
  const start = toDate(dateStr, false);
  const end = toDate(dateStr, true);
  return { start, end };
}

export function parseSearchExpression(expr) {
  const prefixes = ['eq', 'ne', 'gt', 'lt', 'ge', 'le', 'sa', 'eb', 'ap'];
  const match = expr.match(/^([a-z]{2})?(.*)$/);
  let [, prefix, value] = match;
  if (!prefixes.includes(prefix)) {
    value = expr;
    prefix = 'eq';
  }

  const { start, end } = parseFHIRDateRange(value);
  const tolerance = 1000 * 60 * 60 * 24 * 7; // +/- 7 days

  switch (prefix) {
    case 'eq':
      return { start, end };
    case 'ne':
      return { exclude: true, start, end };
    case 'gt':
      return { start: new Date(end.getTime() + 1), end: new Date('9999-12-31T23:59:59Z') };
    case 'lt':
      return { start: new Date('0000-01-01T00:00:00Z'), end: new Date(start.getTime() - 1) };
    case 'ge':
      return { start, end: new Date('9999-12-31T23:59:59Z') };
    case 'le':
      return { start: new Date('0000-01-01T00:00:00Z'), end };
    case 'sa':
      return { start: new Date(end.getTime() + 1), end: new Date('9999-12-31T23:59:59Z') }; // starts after
    case 'eb':
      return { start: new Date('0000-01-01T00:00:00Z'), end: new Date(start.getTime() - 1) }; // ends before
    case 'ap':
      return {
        start: new Date(start.getTime() - tolerance),
        end: new Date(end.getTime() + tolerance),
      };
    default:
      return { start, end };
  }
}

export function rangesIntersect(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}
