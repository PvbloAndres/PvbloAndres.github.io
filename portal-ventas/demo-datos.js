// Datos 100% INVENTADOS para la demo pública del portal (portafolio).
// Nombres, RUT, teléfonos y pedidos son ficticios y se generan con una semilla fija,
// con fechas relativas al día de hoy para que la demo siempre se vea "al día".
(function () {
  'use strict';
  let seed = 20261120;
  const r = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pick = a => a[Math.floor(r() * a.length)];
  const int = (a, b) => a + Math.floor(r() * (b - a + 1));
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
  const hoyD = new Date(), HOY = iso(hoyD), MES = HOY.slice(0, 7);
  const mesAnt = k => { const d = new Date(hoyD.getFullYear(), hoyD.getMonth() - k, 1); return iso(d).slice(0, 7); };
  const diasMes = m => new Date(+m.slice(0, 4), +m.slice(5, 7), 0).getDate();
  const rutDV = n => { let s = 0, m = 2; for (let i = String(n).length - 1; i >= 0; i--) { s += +String(n)[i] * m; m = m === 7 ? 2 : m + 1; } const d = 11 - (s % 11); return d === 11 ? '0' : d === 10 ? 'K' : String(d); };
  const rut = () => { const n = int(10000000, 25999999); return `${n}-${rutDV(n)}`; };

  const EQUIPOS = {
    'Camila Herrera': ['Tomás Reyes', 'Fernanda Lagos', 'Matías Contreras'],
    'Rodrigo Vera': ['Daniela Soto', 'Benjamín Rojas'],
    'Ignacio Paredes': ['Valentina Díaz', 'Joaquín Morales', 'Catalina Núñez'],
    'Equipo Norte(F)': ['Equipo Norte(F)'],
  };
  const SUPS = Object.keys(EQUIPOS), PESO_SUP = ['Camila Herrera', 'Camila Herrera', 'Rodrigo Vera', 'Ignacio Paredes', 'Ignacio Paredes', 'Equipo Norte(F)'];
  const PRODUCTOS = [['Fibra 800 Megas', 1, 'Fibra 800 Megas $11.000 por 12 meses', '800M Residencial'], ['Fibra 800 + TV Inicia', 2, 'Fibra 800 + TV Inicia $17.000 por 12 meses', 'TV Inicia Residencial + 800M Residencial'],
    ['Fibra 600 + TV Premium', 2, 'Fibra 600 + TV Premium $17.000 por 12 meses', 'Stream TV Premium. + 600M Residencial'], ['Fibra 940 + TV Full + Telefonía', 3, 'Fibra 940 + TV Full + Telefonía $24.990', 'Telefonía + TV Full + 940M Residencial'],
    ['Fibra 600 Megas Claro', 1, 'Fibra 600 Megas Claro $12.990', '600M Residencial Claro']];
  const COMUNAS = [['Santiago', 'RM', 'REGION METROPOLITANA'], ['Maipú', 'RM', 'REGION METROPOLITANA'], ['Puente Alto', 'RM', 'REGION METROPOLITANA'], ['La Florida', 'RM', 'REGION METROPOLITANA'], ['Quilicura', 'RM', 'REGION METROPOLITANA'],
    ['Ñuñoa', 'RM', 'REGION METROPOLITANA'], ['Valparaíso', 'V REGION', 'V VALPARAISO'], ['Viña del Mar', 'V REGION', 'V VALPARAISO'], ['Quilpué', 'V REGION', 'V VALPARAISO'], ['La Serena', 'RM', 'IV COQUIMBO']];
  const SUR = [['Rancagua', 'RM', 'VI OHIGGINS'], ['Talca', 'RM', 'VII MAULE'], ['Temuco', 'RM', 'IX ARAUCANIA']];
  const BLOQUES = ['10:00 A 13:00', '13:00 A 16:00', '16:00 A 19:00'];
  const BACKOFFICE = ['Ana Torres', 'Luis Castro', 'Paula Méndez'];
  const MOTIVOS = ['Cliente desiste', 'Sin factibilidad técnica', 'Cliente no contesta', 'Dirección incorrecta'];

  const ventas = [];
  const crear = (mes, n, ultimoDia) => {
    for (let i = 0; i < n; i++) {
      const sup = pick(PESO_SUP), ej = pick(EQUIPOS[sup]), [producto, cantidad, plan, prods] = pick(PRODUCTOS);
      const sur = r() < 0.035, [comuna, region, regMae] = sur ? pick(SUR) : pick(COMUNAS);
      const fecha = `${mes}-${pad(int(1, ultimoDia))}`, edad = Math.round((hoyD - new Date(fecha + 'T12:00:00')) / 864e5);
      let inst = '';
      if (edad > 12) inst = pick(['COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'CANCELADO', 'COMPLETADO', 'CON PROBLEMA']);
      else if (edad > 3) inst = pick(['COMPLETADO', 'COMPLETADO', 'REAGENDADO', 'SIN AGENDA', '', 'CANCELADO', 'EN EJECUCION']);
      else inst = pick(['', '', '', 'REAGENDADO']);
      if (mes !== MES && edad > 30 && !['COMPLETADO', 'CANCELADO'].includes(inst) && r() < 0.7) inst = 'COMPLETADO';
      const est = r(), estatus = est < 0.04 ? 'ERROR TSQ' : est < 0.05 ? 'ERROR NAP' : est < 0.08 ? 'REMISION' : est < 0.1 ? 'VEC' : 'VENTA NUEVA';
      const agenda = { fecha: addDays(fecha, int(1, 6)), bloque: pick(BLOQUES) };
      const reag = inst === 'REAGENDADO' ? { fecha: addDays(HOY, int(1, 5)), bloque: pick(BLOQUES) } : { fecha: '', bloque: '' };
      const pedido = `1-29${String(int(10000000, 99999999))}${pad(int(10, 99))}`;
      const creadoEn = `${fecha}T${pad(int(9, 19))}:${pad(int(0, 59))}:00.000Z`, por = pick(BACKOFFICE);
      ventas.push({
        id: pedido, pedido, fecha, mes, rut: rut(), producto, marca: /Claro/.test(producto) ? 'Claro' : 'VTR', cantidad, comuna, region, ejecutivo: ej, supervisor: sup,
        estatus, ticket: /ERROR/.test(estatus) ? String(int(100000, 999999)) : '', estado: 'APROBADO', oferta: '',
        agenda: inst === 'SIN AGENDA' ? { fecha: '', bloque: '' } : agenda, inst, motivo: inst === 'CANCELADO' ? '' : inst === 'CON PROBLEMA' ? 'Falta equipo en bodega' : '', motivoCat: inst === 'CANCELADO' ? pick(MOTIVOS) : '',
        reagenda: reag, instalado: inst === 'COMPLETADO' ? agenda.fecha : '', comentarios: r() < 0.05 ? 'CUESTIONARIO' : sur && r() < 0.5 ? 'FUERA DE ZONA' : '',
        telefono: '+5690000' + String(int(1000, 9999)), cuentaFact: String(int(100000000, 999999999)),
        boleta: { venc: '', plazo: '', monto: 0, estado: '', pagada: '', nota: '' }, origen: 'app', creadoPor: 'demo', creadoEn,
        ingreso: { por, uid: 'demo', en: creadoEn, tipo: estatus, plan: producto, rgu: cantidad },
        hist: [{ en: creadoEn, por, c: [['Venta', '', 'Ingresada en el portal']] }],
      });
    }
  };
  crear(mesAnt(2), 190, diasMes(mesAnt(2)));
  crear(mesAnt(1), 230, diasMes(mesAnt(1)));
  crear(MES, Math.max(40, Math.round(10.5 * hoyD.getDate())), hoyD.getDate());

  // Maestro VTR/Claro de ayer: ventas del mes + algunas diferencias para que el seguimiento tenga trabajo.
  const CORTE = addDays(HOY, -1), maeRows = [];
  const fila = (v, estado, planMae, prodsMae, rguMae) => {
    const g = rguMae || v.cantidad, canc = estado === 'Cancelado' ? g : 0, ins = estado === 'Completada' ? g : 0;
    return [v.pedido, v.rut, v.marca === 'Claro' ? 'CLARO' : 'VTR', estado, v.fecha, estado === 'Completada' ? (v.instalado || v.fecha) : '', v.regMae || 'REGION METROPOLITANA', v.comuna,
      pick(BACKOFFICE), 'Coordinación VTR', planMae, prodsMae, g, g, canc, g - canc, ins, 1, canc ? 0 : 1, ins ? 1 : 0, canc ? 1 : 0, 'FTTH', 'Alta', 'NOVAVENTAS'];
  };
  ventas.filter(v => v.mes === MES && v.fecha < HOY).forEach((v, i) => {
    const P = PRODUCTOS.find(p => p[0] === v.producto), c = COMUNAS.concat(SUR).find(x => x[0] === v.comuna);
    v.regMae = c ? c[2] : 'REGION METROPOLITANA';
    let est = v.inst === 'COMPLETADO' ? 'Completada' : v.inst === 'CANCELADO' ? 'Cancelado' : 'Abierto';
    if (i % 11 === 4 && est === 'Abierto') est = 'Completada';
    if (i % 17 === 6 && est === 'Abierto') est = 'Cancelado';
    let plan = P[2], prods = P[3];
    if (i % 41 === 9 && v.producto === 'Fibra 800 Megas') { plan = 'Fibra 600 Megas $10.000 por 12 meses'; prods = '600M Residencial'; } // VTR dejó otro plan: para apelar
    if (i % 53 === 20 && v.producto === 'Fibra 600 + TV Premium') { plan = 'Fibra 600 + TV Inicia $15.000 por 12 meses'; prods = 'TV Inicia Residencial + 600M Residencial'; }
    maeRows.push(fila(v, est, plan, prods));
  });
  for (let k = 0; k < 5; k++) { const P = pick(PRODUCTOS); maeRows.push(fila({ pedido: `1-2988${String(int(10000000, 99999999))}`, rut: rut(), marca: 'VTR', fecha: `${MES}-${pad(Math.max(1, hoyD.getDate() - 2 - k))}`, comuna: 'Santiago', cantidad: P[1] }, 'Abierto', P[2], P[3])); }
  ventas.forEach(v => { delete v.regMae; });
  const habiles = (() => { let t = 0, h = 0; for (let d = 1; d <= diasMes(MES); d++) { const w = new Date(hoyD.getFullYear(), hoyD.getMonth(), d).getDay(); if (w && w !== 6) { t++; if (d <= hoyD.getDate()) h++; } } return { mes: t, reales: h, restantes: t - h }; })();
  const maestro = { fecha: CORTE, archivo: 'maestro_demo.xlsx', hoja: 'BBDD', filas: maeRows.reduce((t, x) => t + x[12], 0), pedidos: maeRows.length, hasta: CORTE,
    metas: { dias: habiles, instalada: [{ plaza: 'Rm', meta: 230 }, { plaza: 'V', meta: 70 }, { plaza: 'Total + FDZ', meta: 300 }], emision: [{ plaza: 'Rm', meta: 380 }, { plaza: 'V', meta: 120 }, { plaza: 'Total + FDZ', meta: 500 }] },
    chunks: 1, subidoPor: 'demo', subidoEn: `${CORTE}T19:00:00.000Z` };

  // Reporte de calidad de 1° boleta: ventas instaladas del mes anterior, con vencimientos alrededor de hoy.
  const PER = mesAnt(1).replace('-', ''), calRows = [];
  ventas.filter(v => v.mes === mesAnt(1) && v.inst === 'COMPLETADO').forEach(v => {
    const venc = addDays(HOY, int(-24, 9)), dia8 = addDays(venc, 8), monto = 9990 + v.cantidad * 4000 + int(0, 9) * 100;
    let est, fpago = '';
    if (dia8 < HOY) { const x = r(); if (x < 0.72) { est = 'PAGADO EN PLAZO'; fpago = addDays(venc, int(-6, 7)); } else if (x < 0.82) { est = 'PAGADO FUERA DE PLAZO'; fpago = addDays(dia8, int(1, 6)); if (fpago > HOY) fpago = HOY; } else est = 'NO PAGADO'; }
    else if (venc < HOY) { if (r() < 0.5) { est = 'PAGADO EN PLAZO'; fpago = addDays(venc, int(-5, 0)); } else est = 'PENDIENTE VENCIDO'; }
    else if (r() < 0.25) { est = 'PAGADO EN PLAZO'; fpago = addDays(HOY, -int(0, 3)); } else est = 'PENDIENTE';
    calRows.push([v.pedido, v.rut, v.marca === 'Claro' ? 'CLARO' : 'VTR', v.comuna, 'Completada', v.fecha, v.instalado || v.fecha, v.producto, v.cantidad, venc, dia8, monto, est, fpago, est === 'NO PAGADO' ? `VENCIA EL ${venc.slice(8, 10)}/${venc.slice(5, 7)}` : '', v.ejecutivo, v.supervisor]);
  });
  const calidad = { periodo: PER, archivo: 'calidad_1boleta_demo.xlsx', hoja: '1°Boleta', corte: HOY, filas: calRows.length, resumen: {}, chunks: 1, subidoPor: 'demo', subidoEn: `${HOY}T10:00:00.000Z` };

  const config = { ejecutivos: [...new Set(Object.values(EQUIPOS).flat())], supervisores: SUPS, productos: PRODUCTOS.map(p => p[0]),
    comunas: COMUNAS.concat(SUR).map(c => c[0]), bloques: BLOQUES, estatus: ['VENTA NUEVA', 'REMISION', 'ERROR TSQ', 'ERROR NAP', 'VEC'], estados: ['APROBADO', 'RECHAZADO'], regiones: ['RM', 'V REGION'] };

  window.__seed = JSON.stringify([
    ...ventas.map(v => [`emisiones/${v.id}`, v]),
    [`maestro/${CORTE}`, maestro], [`maestro/${CORTE}/pedidos/p000`, { i: 0, rows: maeRows }],
    [`calidad/${PER}`, calidad], [`calidad/${PER}/filas/p000`, { i: 0, rows: calRows }],
    ['config/listas', config], ['config/respaldo', { en: new Date().toISOString(), por: 'Ana Torres', tipo: 'xlsx', ventas: ventas.length }],
  ]);
})();
