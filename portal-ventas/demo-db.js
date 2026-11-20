// Base de datos EN MEMORIA para la demo pública: imita window.claude.use('db' | 'user' | 'downloads').
// Los datos (ficticios) llegan en window.__seed desde demo-datos.js. Nada se guarda: al recargar vuelve al inicio.
(() => {
  const store = new Map(window.__seed ? JSON.parse(window.__seed) : []); window.__store = store; const subs = [];
  const snapDoc = path => ({ id: path.split('/').pop(), exists: store.has(path), data: () => store.get(path), metadata: { fromCache: false } });
  const notify = () => subs.forEach(s => s());
  const query = (cp, filters) => ({
    where: (f, op, v) => query(cp, [...filters, [f, op, v]]),
    get: async () => {
      const docs = [...store.keys()].filter(k => k.startsWith(cp + '/') && k.split('/').length === cp.split('/').length + 1)
        .filter(k => filters.every(([f, op, v]) => op === 'in' ? v.includes(store.get(k)[f]) : store.get(k)[f] === v)).map(snapDoc);
      return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: { fromCache: false } };
    },
    onSnapshot(next) { let first = true; const f = async () => { const s = await this.get(); const t = first ? 'added' : 'modified'; first = false; s.docChanges = () => s.docs.map(d => ({ type: t, doc: d })); next(s); }; subs.push(f); setTimeout(f, 50); return () => { const i = subs.indexOf(f); if (i >= 0) subs.splice(i, 1); }; },
  });
  const coll = cp => ({ path: cp, doc: id => doc(cp + '/' + id), ...query(cp, []) });
  const doc = path => ({ id: path.split('/').pop(), path, get: async () => { if (window.__offline) throw Object.assign(new Error('Failed to fetch'), { code: 'unavailable' }); return snapDoc(path); },
    set: async d => { if (window.__offline) throw Object.assign(new Error('Failed to fetch'), { code: 'unavailable' }); window.__writes = (window.__writes || 0) + 1; window.__maxDoc = Math.max(window.__maxDoc || 0, JSON.stringify(d).length); store.set(path, JSON.parse(JSON.stringify(d))); notify(); },
    delete: async () => { store.delete(path); notify(); },
    onSnapshot(next) { const f = async () => next(snapDoc(path)); subs.push(f); setTimeout(f, 50); return () => {}; } });
  const db = { doc, collection: coll };
  const user = { can: async () => !window.__soloLectura, canEdit: async () => true, id: async () => 'u_test', me: async () => ({ name: 'Usuario Demo' }), profiles: async ids => Object.fromEntries(ids.map(i => [i, { name: 'Usuario Demo' }])) };
  window.claude = { use: async n => n === 'db' ? db : n === 'user' ? user : n === 'downloads' ? { save: async o => { window.__saved = { filename: o.filename, size: o.data.length || o.data.size, data: o.data }; return { status: 'saved' }; } } : null };
})();
