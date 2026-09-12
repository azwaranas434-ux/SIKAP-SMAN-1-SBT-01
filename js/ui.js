// js/ui.js - Modal, toast, CRUD helpers
import { esc, icon, hexToRgba, uid } from './utils.js';
import { state, saveModule } from './state.js';
import { MENU_COLORS } from './nav.js';

export function toast(msg, danger = false) {
  const wrap = document.getElementById("toast-wrap");
  const el = document.createElement("div");
  el.className = "toast" + (danger ? " toast-danger" : "");
  el.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="${danger ? 'M12 9v4M12 17h.01M10.29 3.86l-8.18 14.14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.89-3L13.71 3.86a2 2 0 0 0-3.42 0Z' : 'M20 6 9 17l-5-5'}"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .25s"; setTimeout(() => el.remove(), 250); }, 2600);
}

export function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
}

export function openModal({ title, wide = false, bodyHtml, footHtml, onMount }) {
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="modal-backdrop" id="modalBackdrop">
      <div class="modal ${wide ? 'modal-wide' : ''}">
        <div class="modal-head">
          <h3>${esc(title)}</h3>
          <button class="close-x" onclick="window.closeModal()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-foot">${footHtml || ''}</div>
      </div>
    </div>`;
  document.getElementById("modalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "modalBackdrop") closeModal();
  });
  if (onMount) onMount();
}

export function confirmDelete(msg, onYes) {
  openModal({
    title: "Konfirmasi Hapus",
    bodyHtml: `<p style="margin:0;color:var(--ink);font-size:13.5px;">${esc(msg)}</p>`,
    footHtml: `<button class="btn btn-outline" onclick="window.closeModal()">Batal</button>
              <button class="btn" style="background:var(--danger);color:#fff;" id="confirmYesBtn">Hapus</button>`,
    onMount: () => {
      document.getElementById("confirmYesBtn").onclick = () => { onYes(); closeModal(); };
    }
  });
}

export function renderField(f, val) {
  const v = val === undefined || val === null ? (f.default !== undefined ? f.default : "") : val;
  if (f.type === "select") {
    const opts = typeof f.options === "function" ? f.options() : f.options;
    return `<select id="f_${f.name}">
      <option value="">— Pilih ${esc(f.label)} —</option>
      ${opts.map(o => `<option value="${esc(o.value)}" ${String(o.value) === String(v) ? 'selected' : ''}>${esc(o.label)}</option>`).join("")}
    </select>`;
  }
  if (f.type === "textarea") {
    return `<textarea id="f_${f.name}" rows="${f.rows || 3}" placeholder="${esc(f.placeholder || '')}">${esc(v)}</textarea>`;
  }
  return `<input id="f_${f.name}" type="${f.type || 'text'}" value="${esc(v)}" placeholder="${esc(f.placeholder || '')}" ${f.step ? `step="${f.step}"` : ''} ${f.min !== undefined ? `min="${f.min}"` : ''} ${f.max !== undefined ? `max="${f.max}"` : ''}>`;
}

export function fieldsHtml(fields, item) {
  return fields.map(f => `
    <div class="field">
      <label>${esc(f.label)}${f.required ? ' <span style="color:var(--danger)">*</span>' : ''}</label>
      ${renderField(f, item ? item[f.name] : undefined)}
      ${f.hint ? `<div class="hint">${esc(f.hint)}</div>` : ''}
    </div>
  `).join("");
}

export function readFields(fields) {
  const out = {};
  for (const f of fields) {
    const el = document.getElementById("f_" + f.name);
    out[f.name] = el.value;
  }
  return out;
}

export function validateRequired(fields, data) {
  for (const f of fields) {
    if (f.required && !String(data[f.name] || "").trim()) {
      toast(`"${f.label}" wajib diisi`, true);
      return false;
    }
  }
  return true;
}

export function openCrudModal(cfg, item) {
  const isEdit = !!item;
  openModal({
    title: (isEdit ? "Ubah " : "Tambah ") + cfg.title,
    wide: cfg.wide,
    bodyHtml: `<div class="${cfg.twoCol ? 'field-row' : ''}">${fieldsHtml(cfg.fields, item)}</div>`,
    footHtml: `<button class="btn btn-outline" onclick="window.closeModal()">Batal</button>
               <button class="btn btn-primary" id="crudSaveBtn">${icon('check', 14)} Simpan</button>`,
    onMount: () => {
      document.getElementById("crudSaveBtn").onclick = async () => {
        const data = readFields(cfg.fields);
        if (!validateRequired(cfg.fields, data)) return;
        if (cfg.onValidate) {
          const err = cfg.onValidate(data, item);
          if (err) { toast(err, true); return; }
        }
        if (isEdit) {
          Object.assign(item, data);
        } else {
          state[cfg.key].push({ id: uid(), ...data });
        }
        await saveModule(cfg.key);
        toast(isEdit ? "Perubahan disimpan" : "Data berhasil ditambahkan");
        closeModal();
        window.renderApp();
      };
    }
  });
}

export function crudDelete(cfg, id) {
  confirmDelete("Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.", async () => {
    state[cfg.key] = state[cfg.key].filter(x => x.id !== id);
    await saveModule(cfg.key);
    toast("Data dihapus");
    window.renderApp();
  });
}

export function toolbarHtml(cfg, searchVal) {
  return `
    <div class="section-head">
      <h3>${cfg.title}</h3>
      <div class="filter-row">
        <div class="search-input">${icon('search', 15)}<input id="searchBox" placeholder="Cari..." value="${esc(searchVal || '')}" oninput="window.onSearchInput(this.value)"></div>
        <button class="btn btn-sm btn-tint" style="background:${MENU_COLORS[cfg.key] || 'var(--primary)'};color:#fff;" onclick="window.openCrudModal(window.CURRENT_CFG)">${icon('plus', 14)} Tambah</button>
      </div>
    </div>`;
}

export let CURRENT_CFG = null;
export let SEARCH_TERM = "";

export function setCurrentCfg(cfg) { CURRENT_CFG = cfg; }
export function setSearchTerm(v) { SEARCH_TERM = v; }

window.openCrudModal = openCrudModal;
window.closeModal = closeModal;
window.crudDelete = crudDelete;
window.CURRENT_CFG = null;
window.SEARCH_TERM = "";

window.onSearchInput = function(v) {
  window.SEARCH_TERM = v;
  document.getElementById("content").innerHTML = renderCrudPage(window.CURRENT_CFG);
};

export function renderCrudPage(cfg) {
  window.CURRENT_CFG = cfg;
  let rows = state[cfg.key];
  if (window.SEARCH_TERM) {
    const t = window.SEARCH_TERM.toLowerCase();
    rows = rows.filter(r => cfg.searchFields.some(f => String(r[f] || "").toLowerCase().includes(t)));
  }
  if (cfg.applyExtraFilter) rows = cfg.applyExtraFilter(rows);
  rows = cfg.sort ? cfg.sort(rows) : rows;
  return `
    <div class="card card-pad">
      ${toolbarHtml(cfg, window.SEARCH_TERM)}
      ${cfg.extraFilterHtml ? cfg.extraFilterHtml() : ''}
      ${rows.length ? `
      <div class="table-wrap"><table>
        <thead><tr>${cfg.columns.map(c => `<th>${esc(c.label)}</th>`).join("")}<th style="text-align:right;">Aksi</th></tr></thead>
        <tbody>
          ${rows.map(r => `<tr>${cfg.columns.map(c => `<td class="${c.strong ? 'cell-strong' : ''} ${c.mono ? 'cell-mono' : ''}">${c.render ? c.render(r) : esc(r[c.field])}</td>`).join("")}
          <td><div class="row-actions">
            <button class="btn btn-icon btn-sm btn-tint" style="background:${hexToRgba(MENU_COLORS[cfg.key] || '#2563EB', 0.12)};color:${MENU_COLORS[cfg.key] || '#2563EB'};border:1px solid ${hexToRgba(MENU_COLORS[cfg.key] || '#2563EB', 0.3)};" onclick='window.openCrudModal(window.CURRENT_CFG, window.state.${cfg.key}.find(x=>x.id==="${r.id}"))'>${icon('edit', 14)}</button>
            <button class="btn btn-icon btn-danger-ghost btn-sm" onclick='window.crudDelete(window.CURRENT_CFG,"${r.id}")'>${icon('trash', 14)}</button>
          </div></td>
          </tr>`).join("")}
        </tbody>
      </table></div>
      ` : `<div class="empty-state">${icon(cfg.icon || 'dashboard', 40)}<div class="et">Belum ada data</div><div>Klik tombol "Tambah" untuk menambahkan data baru.</div></div>`}
    </div>
  `;
}
