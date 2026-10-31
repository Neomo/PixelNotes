// Date helper utilities for grouping and display

export function isSameDay(t1: number, t2: number = Date.now()): boolean {
  const d1 = new Date(t1);
  const d2 = new Date(t2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isYesterday(t: number): boolean {
  const d = new Date(t);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  );
}

export function isPast7Days(t: number): boolean {
  const now = Date.now();
  const diffDays = (now - t) / (1000 * 60 * 60 * 24);
  return diffDays > 1 && diffDays <= 7;
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatDateOnly(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatTimeOnly(timestamp: number): string {
  const d = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type TimelineGroup = '今天' | '昨天' | '近7天' | '更早时间';

export function getTimelineGroup(timestamp: number): TimelineGroup {
  if (isSameDay(timestamp)) return '今天';
  if (isYesterday(timestamp)) return '昨天';
  if (isPast7Days(timestamp)) return '近7天';
  return '更早时间';
}
