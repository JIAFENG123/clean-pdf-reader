/**
 * Clean Web PDF Reader
 * Minimalist, elegant, high-craft distraction-free reader
 * Features:
 * - Auto-resume Reading Progress (断点续读)
 * - Virtualized Canvas Garbage Collection (大部头内存回收)
 * - Bi-directional Outline Sync & Notes System
 * - PWA Service Worker & Mobile Swipe Navigation
 */

(function () {
  'use strict';

  // Ensure PDF.js worker is properly configured
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdf.worker.min.js';
  }

  // Embedded Base64 Demo PDF for zero-latency, CORS-free offline loading
  const DEFAULT_SAMPLE_B64 = "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgL091dGxpbmVzIDExIDAgUiA+PgplbmRvYmoKMiAwIG9iago8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWzYgMCBSIDggMCBSIDEwIDAgUl0gL0NvdW50IDMgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago0IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggOTc0ID4+CnN0cmVhbQowLjg1IDAuODUgMC44NSBSRwoxIHcKNTQgNzUwIG0gNTQxIDc1MCBsIFMKQlQKL0Y0IDkgVGYKMC41IDAuNSAwLjUgcmcKNTQgNzYyIFRkCihBRVNUSEVUSUMgUkVBRElORykgVGoKRVQKQlQKL0Y0IDIyIFRmCjAuMTIgMC4xMiAwLjEyIHJnCjU0IDcwMCBUZAooVGhlIFBoaWxvc29waHkgb2YgUXVpZXQgRm9jdXMpIFRqCkVUCkJUCi9GMyAxMSBUZgowLjI1IDAuMjUgMC4yNSByZwo1NCA2NTAgVGQKMTggVEwKKFNpbXBsaWNpdHkgaXMgbm90IHRoZSBhYnNlbmNlIG9mIGNsdXR0ZXIsIHRoYXQgaXMgYSBjb25zZXF1ZW5jZSBvZiBzaW1wbGljaXR5LikgVGogVCoKKFNpbXBsaWNpdHkgaXMgc29tZWhvdyBlc3NlbnRpYWxseSBkZXNjcmliaW5nIHRoZSBwdXJwb3NlIGFuZCBwbGFjZSBvZiBhbiBvYmplY3QsKSBUaiBUKgooYW5kIG9mZmVyaW5nIGEgcHJvZm91bmQgc2Vuc2Ugb2YgZWFzZSBpbiB1c2luZyBpdC4pIFRqIFQqClQqCihUaGlzIFBERiBSZWFkZXIgd2FzIGNyYWZ0ZWQgd2l0aCB0aHJlZSBjb3JlIHRlbmV0czopIFRqIFQqCigxLiBJbnZpc2libGUgSW50ZXJmYWNlOiBDb250cm9scyBzdGF5IHF1aWV0IHVudGlsIHlvdSBuZWVkIHRoZW0uKSBUaiBUKgooMi4gSGlnaC1EUEkgUHJlY2lzaW9uOiBSYXpvci1zaGFycCB2ZWN0b3IgcmVuZGVyaW5nIHdpdGggc3ViLXBpeGVsIGNsYXJpdHkuKSBUaiBUKgooMy4gUmVhZGluZyBDb21mb3J0OiBFcmdvbm9taWMgd2FybSBwYXBlciBhbmQgb2JzaWRpYW4gdGhlbWVzIGZvciBsb25nIHNlc3Npb25zLikgVGogVCoKVCoKKERyYWcgYW5kIGRyb3AgeW91ciBvd24gUERGIGhlcmUgYXQgYW55IHRpbWUsIG9yIGV4cGxvcmUgdGhlIG5hdmlnYXRpb24gb3B0aW9ucyBhYm92ZS4pIFRqIFQqCkVUCkJUCi9GMyA5IFRmCjAuNiAwLjYgMC42IHJnCjU0IDQ1IFRkCihDbGVhbiBXZWIgUERGIFJlYWRlciBEZW1vIC0tIDEwMCUgQ2xpZW50LVNpZGUgJiBQcml2YXRlKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjYgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA1OTUgODQyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMyAzIDAgUiAvRjQgNCAwIFIgPj4gPj4gL0NvbnRlbnRzIDUgMCBSID4+CmVuZG9iago3IDAgb2JqCjw8IC9MZW5ndGggODM1ID4+CnN0cmVhbQowLjg1IDAuODUgMC44NSBSRwoxIHcKNTQgNzUwIG0gNTQxIDc1MCBsIFMKQlQKL0Y0IDkgVGYKMC41IDAuNSAwLjUgcmcKNTQgNzYyIFRkCihERVNJR04gUFJJTkNJUExFUykgVGoKRVQKQlQKL0Y0IDIyIFRmCjAuMTIgMC4xMiAwLjEyIHJnCjU0IDcwMCBUZAooVHlwb2dyYXBoeSwgR3JpZHMsIGFuZCBPcHRpY2FsIEJhbGFuY2UpIFRqCkVUCkJUCi9GMyAxMSBUZgowLjI1IDAuMjUgMC4yNSByZwo1NCA2NTAgVGQKMTggVEwKKEdvb2QgZGVzaWduIGlzIGFzIGxpdHRsZSBkZXNpZ24gYXMgcG9zc2libGUuKSBUaiBUKgooTGVzcywgYnV0IGJldHRlciAtIGJlY2F1c2UgaXQgY29uY2VudHJhdGVzIG9uIHRoZSBlc3NlbnRpYWwgYXNwZWN0cywpIFRqIFQqCihhbmQgdGhlIHByb2R1Y3RzIGFyZSBub3QgYnVyZGVuZWQgd2l0aCBub24tZXNzZW50aWFscy4pIFRqIFQqClQqCigtIENvbnRpbnVvdXMgU2Nyb2xsICYgVHdvLVBhZ2UgU3ByZWFkIG1vZGVzIGZvciBhbnkgZG9jdW1lbnQgZm9ybWF0LikgVGogVCoKKC0gSW50ZXJhY3RpdmUgdGFibGUgb2YgY29udGVudHMgYW5kIGxpdmUgcGFnZSB0aHVtYm5haWxzLikgVGogVCoKKC0gSW52ZXJ0ZWQgTmlnaHQgTW9kZSB3aXRoIHNvZnQgbHVtaW5hbmNlIHByZXNlcnZpbmcgeW91ciBleWVzaWdodC4pIFRqIFQqCigtIEluc3RhbnQgc2VhcmNoIHdpdGggbWF0Y2ggY291bnRpbmcgYW5kIHNtb290aCBhdXRvLXNjcm9sbCBqdW1waW5nLikgVGogVCoKRVQKQlQKL0YzIDkgVGYKMC42IDAuNiAwLjYgcmcKNTQgNDUgVGQKKENsZWFuIFdlYiBQREYgUmVhZGVyIERlbW8gLS0gMTAwJSBDbGllbnQtU2lkZSAmIFByaXZhdGUpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKOCAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YzIDMgMCBSIC9GNCA0IDAgUiA+PiA+PiAvQ29udGVudHMgNyAwIFIgPj4KZW5kb2JqCjkgMCBvYmoKPDwgL0xlbmd0aCA5NjAgPj4Kc3RyZWFtCjAuODUgMC44NSAwLjg1IFJHCjEgdwo1NCA3NTAgbSA1NDEgNzUwIGwgUwpCVAovRjQgOSBUZgowLjUgMC41IDAuNSByZwo1NCA3NjIgVGQKKFNIT1JUQ1VUIERJUkVDVE9SWSkgVGoKRVQKQlQKL0Y0IDIyIFRmCjAuMTIgMC4xMiAwLjEyIHJnCjU0IDcwMCBUZAooRWZmb3J0bGVzcyBOYXZpZ2F0aW9uIHZpYSBLZXlib2FyZCkgVGoKRVQKQlQKL0YzIDExIFRmCjAuMjUgMC4yNSAwLjI1IHJnCjU0IDY1MCBUZAoxOCBUTAooTWFzdGVyIHlvdXIgcmVhZGluZyBmbG93IHdpdGggaW5zdGFudCBrZXlib2FyZCBjb21tYW5kczopIFRqIFQqClQqCiggIFsgSiAvIEsgXSAgICAgICAgIFNjcm9sbCBkb3duIC8gdXAgb3IgTmV4dCAvIFByZXYgcGFnZSkgVGogVCoKKCAgWyBMZWZ0IC8gUmlnaHQgXSAgUGFnZSBqdW1wIGluIHByZXNlbnRhdGlvbiBtb2RlKSBUaiBUKgooICBbIFsgXSAgICAgICAgICAgICBUb2dnbGUgc2lkZWJhciBcKFRodW1ibmFpbHMgLyBCb29rbWFya3NcKSkgVGogVCoKKCAgWyArIC8gLSAvIDAgXSAgICAgWm9vbSBpbiAvIFpvb20gb3V0IC8gUmVzZXQgMTAwJSkgVGogVCoKKCAgWyBXIC8gUCBdICAgICAgICAgRml0IFdpZHRoIC8gRml0IFBhZ2UpIFRqIFQqCiggIFsgRCBdICAgICAgICAgICAgIEN5Y2xlIFRoZW1lczogU3R1ZGlvIC0+IFdhcm0gLT4gTmlnaHQpIFRqIFQqCiggIFsgRiBdICAgICAgICAgICAgIFRvZ2dsZSBaZW4gRnVsbHNjcmVlbiBNb2RlKSBUaiBUKgooICBbIEN0cmwgKyBGIF0gICAgICBPcGVuIGluc3RhbnQgaW4tZG9jdW1lbnQgdGV4dCBzZWFyY2gpIFRqIFQqClQqCihFbmpveSBhIHNlcmVuZSwgZGlzdHJhY3Rpb24tZnJlZSByZWFkaW5nIHNhbmN0dWFyeS4pIFRqIFQqCkVUCkJUCi9GMyA5IFRmCjAuNiAwLjYgMC42IHJnCjU0IDQ1IFRkCihDbGVhbiBXZWIgUERGIFJlYWRlciBEZW1vIC0tIDEwMCUgQ2xpZW50LVNpZGUgJiBQcml2YXRlKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjEwIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNTk1IDg0Ml0gL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjMgMyAwIFIgL0Y0IDQgMCBSID4+ID4+IC9Db250ZW50cyA5IDAgUiA+PgplbmRvYmoKMTEgMCBvYmoKPDwgL1R5cGUgL091dGxpbmVzIC9GaXJzdCAxMiAwIFIgL0xhc3QgMTQgMCBSIC9Db3VudCAzID4+CmVuZG9iagoxMiAwIG9iago8PCAvVGl0bGUgKDEuIEFlc3RoZXRpYyBSZWFkaW5nOiBQaGlsb3NvcGh5IG9mIFF1aWV0IEZvY3VzKSAvUGFyZW50IDExIDAgUiAvTmV4dCAxMyAwIFIgL0Rlc3QgWzYgMCBSIC9GaXRdID4+CmVuZG9iagoxMyAwIG9iago8PCAvVGl0bGUgKDIuIERlc2lnbiBQcmluY2lwbGVzOiBUeXBvZ3JhcGh5ICYgR3JpZHMpIC9QYXJlbnQgMTEgMCBSIC9QcmV2IDEyIDAgUiAvTmV4dCAxNCAwIFIgL0Rlc3QgWzggMCBSIC9GaXRdID4+CmVuZG9iagoxNCAwIG9iago8PCAvVGl0bGUgKDMuIEtleWJvYXJkIE5hdmlnYXRpb24gJiBTaG9ydGN1dHMpIC9QYXJlbnQgMTEgMCBSIC9QcmV2IDEzIDAgUiAvRGVzdCBbMTAgMCBSIC9GaXRdID4+CmVuZG9iagp4cmVmCjAgMTUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwODEgMDAwMDAgbiAKMDAwMDAwMDE1MSAwMDAwMCBuIAowMDAwMDAwMjIxIDAwMDAwIG4gCjAwMDAwMDAyOTYgMDAwMDAgbiAKMDAwMDAwMTMyMSAwMDAwMCBuIAowMDAwMDAxNDU3IDAwMDAwIG4gCjAwMDAwMDIzNDMgMDAwMDAgbiAKMDAwMDAwMjQ3OSAwMDAwMCBuIAowMDAwMDAzNDkwIDAwMDAwIG4gCjAwMDAwMDM2MjcgMDAwMDAgbiAKMDAwMDAwMzcwMSAwMDAwMCBuIAowMDAwMDAzODI3IDAwMDAwIG4gCjAwMDAwMDM5NTkgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSAxNSAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNDA3MwolJUVPRgo=";

  function getSampleBytes() {
    const bin = atob(DEFAULT_SAMPLE_B64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
  }

  // App State
  const state = {
    pdfDoc: null,
    pdfData: null,
    fileName: 'Sample Document.pdf',
    currentPage: 1,
    totalPages: 0,
    scale: 1.25,
    fitMode: 'fit-width',
    viewMode: 'continuous', // 'single' | 'continuous' | 'spread'
    rotation: 0,
    theme: localStorage.getItem('clean_pdf_theme') || 'studio',
    sidebarOpen: false,
    activeSidebarTab: 'thumbnails', // 'thumbnails' | 'outline' | 'notes'
    pageRenderingTasks: new Map(),
    renderedThumbnails: new Set(),
    renderedPages: new Set(),
    searchQuery: '',
    searchMatches: [],
    currentMatchIndex: -1,
    isSearching: false,
    textCache: new Map(),
    // Base dimensions for virtualized scroll sizing
    basePageWidth: 595,
    basePageHeight: 842,
    // Notes & Highlights
    notes: [],
    currentSelection: null,
    isProgrammaticScrolling: false
  };

  // DOM Elements
  const DOM = {
    app: document.getElementById('app'),
    toolbar: document.getElementById('toolbar'),
    viewport: document.getElementById('viewport'),
    pagesWrapper: document.getElementById('pagesWrapper'),
    emptyState: document.getElementById('emptyState'),
    dropOverlay: document.getElementById('dropOverlay'),
    fileInput: document.getElementById('fileInput'),
    toastMsg: document.getElementById('toastMsg'),
    
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    btnToggleSidebar: document.getElementById('btnToggleSidebar'),
    tabThumbnails: document.getElementById('tabThumbnails'),
    tabOutline: document.getElementById('tabOutline'),
    tabNotes: document.getElementById('tabNotes'),
    notesBadge: document.getElementById('notesBadge'),
    thumbnailsView: document.getElementById('thumbnailsView'),
    outlineView: document.getElementById('outlineView'),
    notesView: document.getElementById('notesView'),

    // Page Navigation
    prevPageBtn: document.getElementById('prevPageBtn'),
    nextPageBtn: document.getElementById('nextPageBtn'),
    pageInput: document.getElementById('pageInput'),
    pageCount: document.getElementById('pageCount'),
    docTitle: document.getElementById('docTitle'),

    // Zoom & View
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomLabel: document.getElementById('zoomLabel'),
    fitWidthBtn: document.getElementById('fitWidthBtn'),
    fitPageBtn: document.getElementById('fitPageBtn'),
    viewModeBtn: document.getElementById('viewModeBtn'),
    rotateBtn: document.getElementById('rotateBtn'),

    // Extras
    themeBtn: document.getElementById('themeBtn'),
    searchBtn: document.getElementById('searchBtn'),
    searchModal: document.getElementById('searchModal'),
    searchInput: document.getElementById('searchInput'),
    searchPrevBtn: document.getElementById('searchPrevBtn'),
    searchNextBtn: document.getElementById('searchNextBtn'),
    searchCount: document.getElementById('searchCount'),
    searchCloseBtn: document.getElementById('searchCloseBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    openSampleBtn: document.getElementById('openSampleBtn'),

    // Notes & Selection Popover
    selectionBar: document.getElementById('selectionBar'),
    btnSelectionNote: document.getElementById('btnSelectionNote'),
    btnSelectionCopy: document.getElementById('btnSelectionCopy'),
    noteModalBackdrop: document.getElementById('noteModalBackdrop'),
    noteModalPageBadge: document.getElementById('noteModalPageBadge'),
    noteModalQuote: document.getElementById('noteModalQuote'),
    noteModalText: document.getElementById('noteModalText'),
    btnSaveNote: document.getElementById('btnSaveNote'),
    btnCancelNote: document.getElementById('btnCancelNote')
  };

  // Toast Helper
  let toastTimer = null;
  function showToast(text, duration = 2200) {
    if (!DOM.toastMsg) return;
    DOM.toastMsg.innerHTML = text;
    DOM.toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      DOM.toastMsg.classList.remove('show');
    }, duration);
  }

  // Theme Management
  function applyTheme(themeName) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('clean_pdf_theme', themeName);
    if (DOM.themeBtn) {
      DOM.themeBtn.setAttribute('data-tooltip', `护眼模式: ${themeName.toUpperCase()}`);
    }
  }

  function cycleTheme() {
    const themes = ['studio', 'warm', 'night', 'eink'];
    const nextIdx = (themes.indexOf(state.theme) + 1) % themes.length;
    applyTheme(themes[nextIdx]);
  }

  // Reading Progress Memory (断点续读)
  let progressDebounceTimer = null;
  function saveReadingProgress() {
    clearTimeout(progressDebounceTimer);
    progressDebounceTimer = setTimeout(() => {
      if (!state.pdfDoc || state.totalPages <= 1) return;
      try {
        const key = 'clean_pdf_progress_' + state.fileName;
        const progress = {
          pageNum: state.currentPage,
          scrollTop: DOM.viewport.scrollTop,
          timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(progress));
      } catch (e) {}
    }, 400);
  }

  function restoreReadingProgress() {
    if (!state.pdfDoc || state.totalPages <= 1) return;
    try {
      const key = 'clean_pdf_progress_' + state.fileName;
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const progress = JSON.parse(raw);
      if (progress && progress.pageNum && progress.pageNum > 1 && progress.pageNum <= state.totalPages) {
        // Jump to saved reading position
        setTimeout(() => {
          goToPage(progress.pageNum);
          showToast(`已恢复上次阅读进度：第 ${progress.pageNum} 页`, 3000);
        }, 350);
      }
    } catch (e) {}
  }

  // Notes Local Storage
  function loadNotesFromStorage() {
    try {
      const key = 'clean_pdf_notes_' + state.fileName;
      const raw = localStorage.getItem(key);
      state.notes = raw ? JSON.parse(raw) : [];
      updateNotesBadge();
      renderNotesSidebar();
    } catch (e) {
      state.notes = [];
    }
  }

  function saveNotesToStorage() {
    try {
      const key = 'clean_pdf_notes_' + state.fileName;
      localStorage.setItem(key, JSON.stringify(state.notes));
      updateNotesBadge();
      renderNotesSidebar();
    } catch (e) {
      console.warn('Failed to save notes:', e);
    }
  }

  function updateNotesBadge() {
    if (DOM.notesBadge) {
      DOM.notesBadge.textContent = state.notes.length;
    }
  }

  // Render Notes in Sidebar
  function renderNotesSidebar() {
    if (!DOM.notesView) return;
    DOM.notesView.innerHTML = '';

    if (state.notes.length === 0) {
      DOM.notesView.innerHTML = `
        <div style="text-align:center;padding:32px 12px;color:var(--text-muted);font-size:12px;line-height:1.6;">
          <svg style="width:36px;height:36px;margin:0 auto 10px;display:block;opacity:0.4;stroke:currentColor;fill:none;" viewBox="0 0 24 24">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          暂无读书笔记<br>在页面划选任意文字即可快速高亮或记录批注
        </div>
      `;
      return;
    }

    const container = document.createElement('div');
    container.className = 'notes-container';

    const toolbar = document.createElement('div');
    toolbar.className = 'notes-toolbar';
    toolbar.innerHTML = `
      <span style="font-size:11px;font-weight:600;color:var(--text-secondary);">共 ${state.notes.length} 条笔记</span>
      <div style="display:flex;gap:6px;">
        <button id="btnExportMarkdown" class="btn-small" title="导出为 Markdown 格式">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          导出 MD
        </button>
        <button id="btnClearNotes" class="btn-small" style="color:var(--text-muted);" title="清空所有笔记">清空</button>
      </div>
    `;
    container.appendChild(toolbar);

    state.notes.forEach((note) => {
      const card = document.createElement('div');
      card.className = 'note-card';
      
      const header = document.createElement('div');
      header.className = 'note-header';
      header.innerHTML = `
        <span class="note-badge">P. ${note.pageNum}</span>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:10px;color:var(--text-muted);">${new Date(note.timestamp).toLocaleDateString()}</span>
          <button class="note-delete-btn" title="删除此条笔记" data-id="${note.id}">×</button>
        </div>
      `;

      const quote = document.createElement('div');
      quote.className = 'note-quote';
      quote.textContent = note.text;
      if (note.color) {
        quote.style.borderLeftColor = note.color === 'yellow' ? '#ca8a04' :
                                      note.color === 'green' ? '#16a34a' :
                                      note.color === 'blue' ? '#2563eb' : '#9333ea';
      }

      card.appendChild(header);
      card.appendChild(quote);

      if (note.comment) {
        const comment = document.createElement('div');
        comment.className = 'note-comment';
        comment.textContent = note.comment;
        card.appendChild(comment);
      }

      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('note-delete-btn')) return;
        goToPage(note.pageNum);
        showToast(`已跳转到第 ${note.pageNum} 页`);
      });

      card.querySelector('.note-delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        state.notes = state.notes.filter(n => n.id !== note.id);
        saveNotesToStorage();
        showToast('已删除笔记');
      });

      container.appendChild(card);
    });

    DOM.notesView.appendChild(container);

    const exportBtn = document.getElementById('btnExportMarkdown');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportNotesToMarkdown);
    }
    const clearBtn = document.getElementById('btnClearNotes');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('确认清空当前文档的所有读书笔记吗？')) {
          state.notes = [];
          saveNotesToStorage();
          showToast('已清空笔记');
        }
      });
    }
  }

  // Export Notes to Markdown
  function exportNotesToMarkdown() {
    if (state.notes.length === 0) return;
    let md = `# ${state.fileName} - 读书笔记\n\n`;
    md += `> 导出时间：${new Date().toLocaleString()}\n> 笔记总计：${state.notes.length} 条\n\n---\n\n`;

    state.notes.forEach((note, idx) => {
      md += `### ${idx + 1}. 第 ${note.pageNum} 页批注\n\n`;
      md += `> ${note.text.split('\n').join('\n> ')}\n\n`;
      if (note.comment) {
        md += `**我的心得**：${note.comment}\n\n`;
      }
      md += `*记录于 ${new Date(note.timestamp).toLocaleString()}*\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.fileName.replace(/\.pdf$/i, '')}_读书笔记.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Markdown 笔记导出成功！');
  }

  // Selection & Highlight Handling
  function initSelectionHandler() {
    document.addEventListener('selectionchange', () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        hideSelectionBar();
      }
    });

    DOM.viewport.addEventListener('mouseup', () => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
          hideSelectionBar();
          return;
        }

        const text = sel.toString().trim();
        if (text.length === 0) return;

        let anchorNode = sel.anchorNode;
        if (anchorNode && anchorNode.nodeType === Node.TEXT_NODE) {
          anchorNode = anchorNode.parentElement;
        }
        const pageContainer = anchorNode ? anchorNode.closest('.pdf-page-container') : null;
        const pageNum = pageContainer ? parseInt(pageContainer.dataset.pageNum, 10) : state.currentPage;

        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        state.currentSelection = {
          text: text,
          pageNum: pageNum,
          rect: rect
        };

        showSelectionBar(rect);
      }, 50);
    });

    document.querySelectorAll('.color-dot').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!state.currentSelection) return;
        const color = dot.dataset.color;
        addHighlight(state.currentSelection.pageNum, state.currentSelection.text, color);
        hideSelectionBar();
        window.getSelection().removeAllRanges();
      });
    });

    DOM.btnSelectionNote.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.currentSelection) return;
      openNoteModal(state.currentSelection.pageNum, state.currentSelection.text);
      hideSelectionBar();
    });

    DOM.btnSelectionCopy.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.currentSelection) return;
      navigator.clipboard.writeText(state.currentSelection.text).then(() => {
        showToast('已复制所选文字');
      }).catch(() => {
        showToast('复制完成');
      });
      hideSelectionBar();
    });

    DOM.btnCancelNote.addEventListener('click', closeNoteModal);
    DOM.btnSaveNote.addEventListener('click', saveNoteFromModal);
    DOM.noteModalBackdrop.addEventListener('click', (e) => {
      if (e.target === DOM.noteModalBackdrop) closeNoteModal();
    });
  }

  function showSelectionBar(rect) {
    const bar = DOM.selectionBar;
    bar.style.top = `${rect.top + window.scrollY}px`;
    bar.style.left = `${rect.left + rect.width / 2}px`;
    bar.classList.add('active');
  }

  function hideSelectionBar() {
    DOM.selectionBar.classList.remove('active');
  }

  let pendingNoteData = null;
  function openNoteModal(pageNum, text) {
    pendingNoteData = { pageNum, text };
    DOM.noteModalPageBadge.textContent = `P. ${pageNum}`;
    DOM.noteModalQuote.textContent = text;
    DOM.noteModalText.value = '';
    DOM.noteModalBackdrop.classList.add('active');
    setTimeout(() => DOM.noteModalText.focus(), 100);
  }

  function closeNoteModal() {
    DOM.noteModalBackdrop.classList.remove('active');
    pendingNoteData = null;
  }

  function saveNoteFromModal() {
    if (!pendingNoteData) return;
    const comment = DOM.noteModalText.value.trim();
    const note = {
      id: Date.now().toString(),
      pageNum: pendingNoteData.pageNum,
      text: pendingNoteData.text,
      comment: comment,
      color: 'yellow',
      timestamp: Date.now()
    };
    state.notes.unshift(note);
    saveNotesToStorage();
    closeNoteModal();
    showToast('笔记已成功保存！');

    if (!state.sidebarOpen) {
      DOM.btnToggleSidebar.click();
    }
    DOM.tabNotes.click();
  }

  function addHighlight(pageNum, text, color) {
    const note = {
      id: Date.now().toString(),
      pageNum: pageNum,
      text: text,
      comment: '',
      color: color,
      timestamp: Date.now()
    };
    state.notes.unshift(note);
    saveNotesToStorage();
    showToast(`已添加${color === 'yellow' ? '黄色' : color === 'green' ? '绿色' : color === 'blue' ? '蓝色' : '紫色'}高亮`);
  }

  // Load PDF file
  async function loadPDF(source, name = 'Document.pdf') {
    try {
      showLoading(true);
      state.fileName = name;
      if (DOM.docTitle) {
        DOM.docTitle.textContent = name;
        DOM.docTitle.title = name;
      }

      cancelAllRenderTasks();
      state.textCache.clear();
      state.renderedThumbnails.clear();
      state.renderedPages.clear();

      let loadingTask;
      if (source === './sample.pdf' || !source) {
        loadingTask = pdfjsLib.getDocument({ data: getSampleBytes() });
      } else if (typeof source === 'string') {
        loadingTask = pdfjsLib.getDocument(source);
      } else {
        loadingTask = pdfjsLib.getDocument({ data: source });
      }

      const pdfDoc = await loadingTask.promise;
      state.pdfDoc = pdfDoc;
      state.totalPages = pdfDoc.numPages;
      state.currentPage = 1;

      // Extract base page 1 dimensions for accurate virtualized scrolling
      try {
        const page1 = await pdfDoc.getPage(1);
        const p1Viewport = page1.getViewport({ scale: 1.0, rotation: state.rotation });
        state.basePageWidth = p1Viewport.width;
        state.basePageHeight = p1Viewport.height;
      } catch (e) {
        state.basePageWidth = 595;
        state.basePageHeight = 842;
      }

      DOM.emptyState.style.display = 'none';
      DOM.viewport.style.display = 'flex';
      DOM.pageCount.textContent = `/ ${state.totalPages}`;
      DOM.pageInput.value = '1';
      DOM.pageInput.max = state.totalPages;

      loadNotesFromStorage();
      await renderSidebarOutline();
      initThumbnailsPlaceholder();

      await adjustScaleToContainer();
      renderDocument();
      showLoading(false);

      // Auto-restore reading progress if available
      restoreReadingProgress();
    } catch (err) {
      console.error('Error loading PDF:', err);
      showLoading(false);
      alert('加载 PDF 失败: ' + err.message);
    }
  }

  function showLoading(isLoading) {
    if (isLoading && DOM.docTitle) {
      DOM.docTitle.textContent = '正在载入文档...';
    }
  }

  function cancelAllRenderTasks() {
    state.pageRenderingTasks.forEach((task) => {
      try {
        task.cancel();
      } catch (e) {}
    });
    state.pageRenderingTasks.clear();
  }

  // Fit calculations
  async function adjustScaleToContainer() {
    if (!state.pdfDoc) return;
    try {
      const availableWidth = DOM.viewport.clientWidth - 80;
      const availableHeight = DOM.viewport.clientHeight - 60;

      if (state.fitMode === 'fit-width') {
        const targetWidth = Math.min(availableWidth, 860);
        state.scale = Math.max(0.6, Math.min(2.0, targetWidth / state.basePageWidth));
      } else if (state.fitMode === 'fit-page') {
        const scaleW = availableWidth / state.basePageWidth;
        const scaleH = availableHeight / state.basePageHeight;
        state.scale = Math.max(0.4, Math.min(scaleW, scaleH));
      }
      updateZoomLabel();
    } catch (e) {
      console.warn('adjustScale error', e);
    }
  }

  function updateZoomLabel() {
    if (DOM.zoomLabel) {
      DOM.zoomLabel.textContent = `${Math.round(state.scale * 100)}%`;
    }
  }

  // Render Document Main Loop
  function renderDocument() {
    if (!state.pdfDoc) return;

    cancelAllRenderTasks();
    DOM.pagesWrapper.innerHTML = '';
    DOM.viewport.className = 'viewport';

    if (state.viewMode === 'spread') {
      DOM.viewport.classList.add('two-page-view');
    }

    if (state.viewMode === 'single') {
      createPagePlaceholder(state.currentPage);
      renderPage(state.currentPage);
    } else if (state.viewMode === 'spread') {
      const first = state.currentPage % 2 === 0 ? state.currentPage - 1 : state.currentPage;
      createPagePlaceholder(first);
      renderPage(first);
      if (first + 1 <= state.totalPages) {
        createPagePlaceholder(first + 1);
        renderPage(first + 1);
      }
    } else {
      // Continuous Scroll Mode: Create fully-sized placeholders for all pages
      for (let i = 1; i <= state.totalPages; i++) {
        createPagePlaceholder(i);
      }
      setupContinuousObserver();
    }

    updateActiveThumbnail();
    updateActiveOutline(state.currentPage);
  }

  // CRITICAL: Always pre-size placeholder with exact estimated dimensions!
  function createPagePlaceholder(pageNum) {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'pdf-page-container';
    pageContainer.id = `page-container-${pageNum}`;
    pageContainer.dataset.pageNum = pageNum;

    const estWidth = Math.floor(state.basePageWidth * state.scale);
    const estHeight = Math.floor(state.basePageHeight * state.scale);

    pageContainer.style.width = estWidth + 'px';
    pageContainer.style.height = estHeight + 'px';
    pageContainer.style.minHeight = estHeight + 'px';
    pageContainer.style.flexShrink = '0';

    const canvas = document.createElement('canvas');
    canvas.id = `page-canvas-${pageNum}`;
    pageContainer.appendChild(canvas);

    const textLayer = document.createElement('div');
    textLayer.className = 'textLayer';
    textLayer.id = `text-layer-${pageNum}`;
    pageContainer.appendChild(textLayer);

    DOM.pagesWrapper.appendChild(pageContainer);
    return pageContainer;
  }

  // Continuous Scroll Lazy-load + Virtual Memory Reclamation
  let continuousObserver = null;
  function setupContinuousObserver() {
    if (continuousObserver) {
      continuousObserver.disconnect();
    }

    continuousObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const pageNum = parseInt(entry.target.dataset.pageNum, 10);
        if (entry.isIntersecting) {
          renderPage(pageNum);
        } else {
          // Virtualized Canvas GC: Free GPU/RAM if page is far away in large document
          if (state.totalPages > 20 && Math.abs(pageNum - state.currentPage) > 5) {
            unloadPage(pageNum);
          }
        }
      });
    }, {
      root: DOM.viewport,
      rootMargin: '350px 0px 350px 0px',
      threshold: [0, 0.05]
    });

    document.querySelectorAll('.pdf-page-container').forEach((el) => {
      continuousObserver.observe(el);
    });
  }

  // Virtualized Canvas GC: clear bitmap while preserving container height!
  function unloadPage(pageNum) {
    const canvas = document.getElementById(`page-canvas-${pageNum}`);
    const textLayer = document.getElementById(`text-layer-${pageNum}`);
    if (!canvas || !textLayer) return;
    if (canvas.width <= 1) return; // already unloaded

    if (state.pageRenderingTasks.has(pageNum)) {
      try { state.pageRenderingTasks.get(pageNum).cancel(); } catch (e) {}
      state.pageRenderingTasks.delete(pageNum);
    }

    canvas.width = 1;
    canvas.height = 1;
    textLayer.innerHTML = '';
    state.renderedPages.delete(pageNum);
  }

  // Determine Most Visible Page during scrolling
  function getVisiblePageNum() {
    const containerRect = DOM.viewport.getBoundingClientRect();
    const pages = document.querySelectorAll('.pdf-page-container');
    let bestPage = state.currentPage;
    let maxVisibleHeight = -1;

    pages.forEach((pageEl) => {
      const rect = pageEl.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      if (visibleHeight > maxVisibleHeight) {
        maxVisibleHeight = visibleHeight;
        bestPage = parseInt(pageEl.dataset.pageNum, 10);
      }
    });
    return bestPage;
  }

  // Render Single Page
  async function renderPage(pageNum) {
    if (!state.pdfDoc) return;
    const container = document.getElementById(`page-container-${pageNum}`);
    const canvas = document.getElementById(`page-canvas-${pageNum}`);
    const textLayerDiv = document.getElementById(`text-layer-${pageNum}`);
    if (!container || !canvas || !textLayerDiv) return;

    if (state.pageRenderingTasks.has(pageNum)) {
      try {
        state.pageRenderingTasks.get(pageNum).cancel();
      } catch (e) {}
      state.pageRenderingTasks.delete(pageNum);
    }

    try {
      const page = await state.pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: state.scale, rotation: state.rotation });
      const outputScale = window.devicePixelRatio || 1;

      const pxWidth = Math.floor(viewport.width);
      const pxHeight = Math.floor(viewport.height);

      container.style.width = pxWidth + 'px';
      container.style.height = pxHeight + 'px';
      container.style.minHeight = pxHeight + 'px';
      container.style.flexShrink = '0';

      canvas.width = Math.floor(pxWidth * outputScale);
      canvas.height = Math.floor(pxHeight * outputScale);
      canvas.style.width = pxWidth + 'px';
      canvas.style.height = pxHeight + 'px';

      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        transform: transform
      };

      const renderTask = page.render(renderContext);
      state.pageRenderingTasks.set(pageNum, renderTask);

      await renderTask.promise;
      state.pageRenderingTasks.delete(pageNum);
      state.renderedPages.add(pageNum);

      renderTextLayer(page, viewport, textLayerDiv);
    } catch (err) {
      if (err.name !== 'RenderingCancelledException') {
        console.error(`Page ${pageNum} render error:`, err);
      }
    }
  }

  // High-DPI Text Layer
  async function renderTextLayer(page, viewport, container) {
    container.innerHTML = '';
    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;
    container.style.setProperty('--scale-factor', viewport.scale);

    try {
      const textContent = await page.getTextContent();
      state.textCache.set(page.pageNumber, textContent);

      if (pdfjsLib.renderTextLayer) {
        await pdfjsLib.renderTextLayer({
          textContentSource: textContent,
          container: container,
          viewport: viewport,
          textDivs: []
        }).promise;
      }

      if (state.searchQuery) {
        highlightMatchesOnPage(container, state.searchQuery);
      }
    } catch (e) {
      console.warn('TextLayer render error', e);
    }
  }

  // Thumbnails
  function initThumbnailsPlaceholder() {
    DOM.thumbnailsView.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'thumbnails-container';

    for (let i = 1; i <= state.totalPages; i++) {
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.id = `thumb-card-${i}`;
      card.dataset.pageNum = i;

      const box = document.createElement('div');
      box.className = 'thumb-canvas-box';

      const canvas = document.createElement('canvas');
      canvas.id = `thumb-canvas-${i}`;
      box.appendChild(canvas);

      const num = document.createElement('span');
      num.className = 'thumb-number';
      num.textContent = `第 ${i} 页`;

      card.appendChild(box);
      card.appendChild(num);

      card.addEventListener('click', () => {
        goToPage(i);
      });

      container.appendChild(card);
    }

    DOM.thumbnailsView.appendChild(container);
    renderVisibleThumbnails();
  }

  async function renderVisibleThumbnails() {
    if (!state.sidebarOpen || state.activeSidebarTab !== 'thumbnails' || !state.pdfDoc) return;

    for (let i = 1; i <= state.totalPages; i++) {
      if (state.renderedThumbnails.has(i)) continue;
      const canvas = document.getElementById(`thumb-canvas-${i}`);
      if (!canvas) continue;

      try {
        const page = await state.pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.22, rotation: state.rotation });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        state.renderedThumbnails.add(i);
      } catch (e) {}
    }
  }

  function updateActiveThumbnail() {
    document.querySelectorAll('.thumb-card').forEach((el) => {
      el.classList.remove('active');
    });
    const current = document.getElementById(`thumb-card-${state.currentPage}`);
    if (current) {
      current.classList.add('active');
      if (state.sidebarOpen && state.activeSidebarTab === 'thumbnails') {
        current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  // Destination resolver helper
  async function resolveDestinationPage(item) {
    try {
      let dest = item.dest;
      if (typeof dest === 'string') {
        dest = await state.pdfDoc.getDestination(dest);
      }
      if (!dest) return null;

      let pageRef = dest[0];
      let pageIndex = null;
      if (typeof pageRef === 'object' && pageRef !== null) {
        pageIndex = await state.pdfDoc.getPageIndex(pageRef);
      } else if (typeof pageRef === 'number') {
        pageIndex = pageRef;
      }

      if (pageIndex !== null && !isNaN(pageIndex)) {
        let yOffset = null;
        if (dest.length >= 4 && typeof dest[3] === 'number') {
          yOffset = dest[3];
        }
        return {
          pageNum: pageIndex + 1,
          y: yOffset
        };
      }
    } catch (err) {
      console.warn('Destination resolution error:', err);
    }
    return null;
  }

  // Sidebar Outline / TOC
  async function renderSidebarOutline() {
    DOM.outlineView.innerHTML = '';
    if (!state.pdfDoc) return;

    try {
      const outline = await state.pdfDoc.getOutline();
      if (!outline || outline.length === 0) {
        DOM.outlineView.innerHTML = '<div style="color:var(--text-muted);font-size:12px;text-align:center;padding:32px 12px;line-height:1.6;">该文档未内置目录书签</div>';
        return;
      }

      const ul = document.createElement('ul');
      ul.className = 'outline-tree';
      await buildOutlineTree(outline, ul);
      DOM.outlineView.appendChild(ul);
      updateActiveOutline(state.currentPage);
    } catch (e) {
      console.warn('Outline fetch error:', e);
      DOM.outlineView.innerHTML = '<div style="color:var(--text-muted);font-size:12px;text-align:center;padding:32px 12px;">无法加载目录大纲</div>';
    }
  }

  async function buildOutlineTree(items, parentElement) {
    for (const item of items) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'outline-item';
      a.href = '#';

      const resolved = await resolveDestinationPage(item);
      if (resolved && resolved.pageNum) {
        a.dataset.pageNum = resolved.pageNum;
        if (resolved.y !== null) a.dataset.destY = resolved.y;
      }

      const titleSpan = document.createElement('span');
      titleSpan.className = 'outline-title';
      titleSpan.textContent = item.title;
      titleSpan.title = item.title;
      a.appendChild(titleSpan);

      if (resolved && resolved.pageNum) {
        const pagePill = document.createElement('span');
        pagePill.className = 'outline-page-pill';
        pagePill.textContent = `P.${resolved.pageNum}`;
        a.appendChild(pagePill);
      }

      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (resolved && resolved.pageNum) {
          goToPage(resolved.pageNum, resolved.y);
          document.querySelectorAll('.outline-item').forEach(el => el.classList.remove('active'));
          a.classList.add('active');
        }
      });

      li.appendChild(a);

      if (item.items && item.items.length > 0) {
        const subUl = document.createElement('ul');
        subUl.className = 'outline-sub';
        await buildOutlineTree(item.items, subUl);
        li.appendChild(subUl);
      }

      parentElement.appendChild(li);
    }
  }

  // Bi-directional Outline Highlight Sync
  function updateActiveOutline(activePageNum) {
    const items = Array.from(DOM.outlineView.querySelectorAll('.outline-item[data-page-num]'));
    if (items.length === 0) return;

    let activeItem = null;
    for (const item of items) {
      const p = parseInt(item.dataset.pageNum, 10);
      if (p <= activePageNum) {
        activeItem = item;
      } else {
        break;
      }
    }

    if (!activeItem && items.length > 0 && activePageNum <= 1) {
      activeItem = items[0];
    }

    items.forEach(el => el.classList.remove('active'));
    if (activeItem) {
      activeItem.classList.add('active');
      if (state.sidebarOpen && state.activeSidebarTab === 'outline') {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  // Navigation Logic with Exact Offset Calculation
  async function goToPage(pageNum, destY = null) {
    if (!state.pdfDoc) return;
    pageNum = Math.max(1, Math.min(state.totalPages, pageNum));
    state.currentPage = pageNum;
    DOM.pageInput.value = pageNum;

    if (state.viewMode === 'continuous') {
      const target = document.getElementById(`page-container-${pageNum}`);
      if (target) {
        state.isProgrammaticScrolling = true;

        const estH = Math.floor(state.basePageHeight * state.scale);
        if (!target.style.height || target.offsetHeight < 100) {
          target.style.height = estH + 'px';
          target.style.minHeight = estH + 'px';
        }

        const targetRect = target.getBoundingClientRect();
        const viewportRect = DOM.viewport.getBoundingClientRect();
        let targetScrollTop = DOM.viewport.scrollTop + (targetRect.top - viewportRect.top) - 16;

        if (destY !== null && typeof destY === 'number') {
          try {
            const page = await state.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: state.scale, rotation: state.rotation });
            const offsetY = Math.max(0, viewport.height - (destY * state.scale));
            if (!isNaN(offsetY)) {
              targetScrollTop += offsetY;
            }
          } catch (e) {}
        }

        const scrollDelta = Math.abs(targetScrollTop - DOM.viewport.scrollTop);
        const behaviorMode = scrollDelta > 2500 ? 'auto' : 'smooth';
        DOM.viewport.scrollTo({ top: Math.max(0, targetScrollTop), behavior: behaviorMode });

        renderPage(pageNum);
        if (pageNum > 1) renderPage(pageNum - 1);
        if (pageNum < state.totalPages) renderPage(pageNum + 1);

        setTimeout(() => { state.isProgrammaticScrolling = false; }, 500);
      }
    } else {
      renderDocument();
    }

    updateActiveThumbnail();
    updateActiveOutline(pageNum);
    saveReadingProgress();
  }

  function nextPage() {
    if (state.currentPage < state.totalPages) {
      goToPage(state.currentPage + 1);
    }
  }

  function prevPage() {
    if (state.currentPage > 1) {
      goToPage(state.currentPage - 1);
    }
  }

  // Zoom Logic
  function setScale(newScale, fit = 'custom') {
    state.scale = Math.max(0.4, Math.min(3.0, newScale));
    state.fitMode = fit;
    updateZoomLabel();

    const newEstW = Math.floor(state.basePageWidth * state.scale);
    const newEstH = Math.floor(state.basePageHeight * state.scale);
    document.querySelectorAll('.pdf-page-container').forEach(el => {
      el.style.width = newEstW + 'px';
      el.style.height = newEstH + 'px';
      el.style.minHeight = newEstH + 'px';
    });

    renderDocument();
  }

  function zoomIn() {
    setScale(state.scale * 1.2);
  }

  function zoomOut() {
    setScale(state.scale / 1.2);
  }

  // Rotate Logic
  function rotateClockwise() {
    state.rotation = (state.rotation + 90) % 360;
    renderDocument();
    state.renderedThumbnails.clear();
    renderVisibleThumbnails();
  }

  // Search in Document
  async function performSearch(query) {
    state.searchQuery = query.trim().toLowerCase();
    state.searchMatches = [];
    state.currentMatchIndex = -1;

    if (!state.searchQuery || !state.pdfDoc) {
      DOM.searchCount.textContent = '0 / 0';
      clearHighlights();
      return;
    }

    for (let i = 1; i <= state.totalPages; i++) {
      let textContent = state.textCache.get(i);
      if (!textContent) {
        const page = await state.pdfDoc.getPage(i);
        textContent = await page.getTextContent();
        state.textCache.set(i, textContent);
      }
      const pageStr = textContent.items.map(item => item.str).join(' ').toLowerCase();
      if (pageStr.includes(state.searchQuery)) {
        state.searchMatches.push(i);
      }
    }

    if (state.searchMatches.length > 0) {
      state.currentMatchIndex = 0;
      DOM.searchCount.textContent = `1 / ${state.searchMatches.length}`;
      goToPage(state.searchMatches[0]);
    } else {
      DOM.searchCount.textContent = '0 / 0';
    }

    highlightAllPages();
  }

  function highlightAllPages() {
    document.querySelectorAll('.textLayer').forEach((container) => {
      highlightMatchesOnPage(container, state.searchQuery);
    });
  }

  function highlightMatchesOnPage(container, query) {
    if (!query) return;
    const spans = container.querySelectorAll('span');
    spans.forEach((span) => {
      const text = span.textContent;
      const lower = text.toLowerCase();
      if (lower.includes(query)) {
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        span.innerHTML = text.replace(regex, '<mark class="highlight">$1</mark>');
      }
    });
  }

  function clearHighlights() {
    document.querySelectorAll('.textLayer mark.highlight').forEach((el) => {
      const parent = el.parentNode;
      parent.textContent = parent.textContent;
    });
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function nextSearchMatch() {
    if (state.searchMatches.length === 0) return;
    state.currentMatchIndex = (state.currentMatchIndex + 1) % state.searchMatches.length;
    DOM.searchCount.textContent = `${state.currentMatchIndex + 1} / ${state.searchMatches.length}`;
    goToPage(state.searchMatches[state.currentMatchIndex]);
  }

  function prevSearchMatch() {
    if (state.searchMatches.length === 0) return;
    state.currentMatchIndex = (state.currentMatchIndex - 1 + state.searchMatches.length) % state.searchMatches.length;
    DOM.searchCount.textContent = `${state.currentMatchIndex + 1} / ${state.searchMatches.length}`;
    goToPage(state.searchMatches[state.currentMatchIndex]);
  }

  // Fullscreen Toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // View Mode Switcher
  function toggleViewMode() {
    const modes = ['continuous', 'single', 'spread'];
    const nextIdx = (modes.indexOf(state.viewMode) + 1) % modes.length;
    state.viewMode = modes[nextIdx];
    
    const modeNames = {
      continuous: '连续滚动',
      single: '单页视图',
      spread: '双页展卷'
    };
    DOM.viewModeBtn.setAttribute('data-tooltip', `模式: ${modeNames[state.viewMode]}`);
    renderDocument();
  }

  // Bind UI Events
  function bindEvents() {
    DOM.pageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = parseInt(DOM.pageInput.value, 10);
        if (!isNaN(val)) goToPage(val);
      }
    });

    DOM.prevPageBtn.addEventListener('click', prevPage);
    DOM.nextPageBtn.addEventListener('click', nextPage);

    DOM.zoomInBtn.addEventListener('click', zoomIn);
    DOM.zoomOutBtn.addEventListener('click', zoomOut);
    DOM.zoomLabel.addEventListener('click', () => setScale(1.0, 'custom'));
    
    DOM.fitWidthBtn.addEventListener('click', async () => {
      state.fitMode = 'fit-width';
      await adjustScaleToContainer();
      renderDocument();
    });

    DOM.fitPageBtn.addEventListener('click', async () => {
      state.fitMode = 'fit-page';
      await adjustScaleToContainer();
      renderDocument();
    });

    DOM.viewModeBtn.addEventListener('click', toggleViewMode);
    DOM.rotateBtn.addEventListener('click', rotateClockwise);
    DOM.themeBtn.addEventListener('click', cycleTheme);
    DOM.fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Sidebar Toggle & 3 Tabs
    DOM.btnToggleSidebar.addEventListener('click', () => {
      state.sidebarOpen = !state.sidebarOpen;
      DOM.sidebar.classList.toggle('collapsed', !state.sidebarOpen);
      DOM.btnToggleSidebar.classList.toggle('active', state.sidebarOpen);
      if (state.sidebarOpen) {
        if (state.activeSidebarTab === 'thumbnails') renderVisibleThumbnails();
        else if (state.activeSidebarTab === 'outline') updateActiveOutline(state.currentPage);
        else if (state.activeSidebarTab === 'notes') loadNotesFromStorage();
      }
      setTimeout(adjustScaleToContainer, 250);
    });

    DOM.tabThumbnails.addEventListener('click', () => {
      state.activeSidebarTab = 'thumbnails';
      DOM.tabThumbnails.classList.add('active');
      DOM.tabOutline.classList.remove('active');
      DOM.tabNotes.classList.remove('active');
      DOM.thumbnailsView.style.display = 'block';
      DOM.outlineView.style.display = 'none';
      DOM.notesView.style.display = 'none';
      renderVisibleThumbnails();
    });

    DOM.tabOutline.addEventListener('click', () => {
      state.activeSidebarTab = 'outline';
      DOM.tabOutline.classList.add('active');
      DOM.tabThumbnails.classList.remove('active');
      DOM.tabNotes.classList.remove('active');
      DOM.thumbnailsView.style.display = 'none';
      DOM.outlineView.style.display = 'block';
      DOM.notesView.style.display = 'none';
      updateActiveOutline(state.currentPage);
    });

    DOM.tabNotes.addEventListener('click', () => {
      state.activeSidebarTab = 'notes';
      DOM.tabNotes.classList.add('active');
      DOM.tabThumbnails.classList.remove('active');
      DOM.tabOutline.classList.remove('active');
      DOM.thumbnailsView.style.display = 'none';
      DOM.outlineView.style.display = 'none';
      DOM.notesView.style.display = 'block';
      loadNotesFromStorage();
    });

    // Real-time Scroll Listener for Content & TOC Synchronization & Progress Save
    let scrollTicking = false;
    DOM.viewport.addEventListener('scroll', () => {
      saveReadingProgress();

      if (state.isProgrammaticScrolling) return;
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        scrollTicking = false;
        if (state.viewMode === 'continuous') {
          const activePage = getVisiblePageNum();
          if (activePage !== state.currentPage) {
            state.currentPage = activePage;
            DOM.pageInput.value = activePage;
            updateActiveThumbnail();
            updateActiveOutline(activePage);
          }
        }
      });
    }, { passive: true });

    // Touch Swipe Navigation for Tablet/Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    DOM.viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    DOM.viewport.addEventListener('touchend', (e) => {
      if (state.viewMode === 'single' && e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 40) {
          if (deltaX < 0) nextPage();
          else prevPage();
        }
      }
    }, { passive: true });

    // In-document Search
    DOM.searchBtn.addEventListener('click', () => {
      state.isSearching = !state.isSearching;
      DOM.searchModal.classList.toggle('active', state.isSearching);
      if (state.isSearching) {
        DOM.searchInput.focus();
      } else {
        clearHighlights();
      }
    });

    DOM.searchCloseBtn.addEventListener('click', () => {
      state.isSearching = false;
      DOM.searchModal.classList.remove('active');
      clearHighlights();
    });

    DOM.searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    DOM.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) prevSearchMatch();
        else nextSearchMatch();
      } else if (e.key === 'Escape') {
        DOM.searchCloseBtn.click();
      }
    });

    DOM.searchNextBtn.addEventListener('click', nextSearchMatch);
    DOM.searchPrevBtn.addEventListener('click', prevSearchMatch);

    // File Input & Drag and Drop
    DOM.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          loadPDF(new Uint8Array(this.result), file.name);
        };
        reader.readAsArrayBuffer(file);
      }
    });

    if (DOM.openSampleBtn) {
      DOM.openSampleBtn.addEventListener('click', () => {
        loadPDF('./sample.pdf', 'Sample Document.pdf');
      });
    }

    // Drag & Drop
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      DOM.dropOverlay.classList.add('active');
    });

    window.addEventListener('dragleave', (e) => {
      if (e.relatedTarget === null || e.clientX <= 0 || e.clientY <= 0) {
        DOM.dropOverlay.classList.remove('active');
      }
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      DOM.dropOverlay.classList.remove('active');
      const files = e.dataTransfer.files;
      if (files && files.length > 0 && files[0].type.includes('pdf')) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = function () {
          loadPDF(new Uint8Array(this.result), file.name);
        };
        reader.readAsArrayBuffer(file);
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'j' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'k' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        setScale(1.0, 'custom');
      } else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        DOM.fitWidthBtn.click();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        DOM.fitPageBtn.click();
      } else if (e.key === '[') {
        e.preventDefault();
        DOM.btnToggleSidebar.click();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        cycleTheme();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        rotateClockwise();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        DOM.searchBtn.click();
      }
    });

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(async () => {
        if (state.fitMode === 'fit-width' || state.fitMode === 'fit-page') {
          await adjustScaleToContainer();
          renderDocument();
        }
      }, 200);
    });

    initSelectionHandler();
  }

  // Register PWA Service Worker if on HTTP/HTTPS
  if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // Expose loadPDF and state
  window.loadPDF = loadPDF;
  window.state = state;

  // Initialization
  function init() {
    applyTheme(state.theme);
    bindEvents();
    loadPDF('./sample.pdf', 'Sample Document.pdf');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
