const key = (userId) => `clientflow-recent-${userId}`;
const MAX = 8;

export function pushRecent(userId, item) {
  if (!userId) return;
  const k = key(userId);
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(k) || "[]");
  } catch {
    list = [];
  }
  const { type, id, title, subtitle, path } = item;
  list = list.filter((x) => !(x.type === type && x.id === id));
  list.unshift({ type, id, title, subtitle, path, at: Date.now() });
  localStorage.setItem(k, JSON.stringify(list.slice(0, MAX)));
}

export function getRecent(userId) {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(key(userId)) || "[]");
  } catch {
    return [];
  }
}
