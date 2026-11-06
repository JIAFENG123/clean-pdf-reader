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
    docType: 'pdf', // 'pdf' | 'epub'
    currentBookId: null,
    cloudBooks: [],
    shelfViewMode: localStorage.getItem('clean_shelf_view_mode') || 'gallery',
    shelfFilter: 'all',
    pdfDoc: null,
    pdfData: null,
    epubBook: null,
    epubRendition: null,
    epubLocation: null,
    epubFontSize: 105,
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

    // EPUB Containers
    epubWrapper: document.getElementById('epubWrapper'),
    epubViewerArea: document.getElementById('epubViewerArea'),
    epubFooterTitle: document.getElementById('epubFooterTitle'),
    epubFooterProgress: document.getElementById('epubFooterProgress'),
    openSampleEpubBtn: document.getElementById('openSampleEpubBtn'),
    // Bookshelf Elements
    bookshelfView: document.getElementById('bookshelfView'),
    shelfGrid: document.getElementById('shelfGrid'),
    shelfLoading: document.getElementById('shelfLoading'),
    shelfLoadingText: document.getElementById('shelfLoadingText'),
    shelfStats: document.getElementById('shelfStats'),
    shelfSearchInput: document.getElementById('shelfSearchInput'),
    shelfFileInput: document.getElementById('shelfFileInput'),
    shelfThemeBtn: document.getElementById('shelfThemeBtn'),
    btnBackToShelf: document.getElementById('btnBackToShelf'),
    shelfViewToggleBtn: document.getElementById('shelfViewToggleBtn'),
    countAll: document.getElementById('countAll'),
    countReading: document.getElementById('countReading'),
    countEpub: document.getElementById('countEpub'),
    countPdf: document.getElementById('countPdf'),

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
    // Elegant Native-like Confirmation Modal
  function showConfirmDialog({ title, message, confirmText = '确认删除', isDanger = true }) {
    return new Promise((resolve) => {
      const backdrop = document.getElementById('confirmModal');
      const titleEl = document.getElementById('confirmModalTitle');
      const descEl = document.getElementById('confirmModalMessage');
      const btnOk = document.getElementById('btnConfirmOk');
      const btnCancel = document.getElementById('btnConfirmCancel');

      if (!backdrop) {
        resolve(window.confirm(title + '\n' + message.replace(/<[^>]+>/g, '')));
        return;
      }

      titleEl.textContent = title || '确认操作？';
      descEl.innerHTML = message || '';
      btnOk.textContent = confirmText;
      btnOk.className = isDanger ? 'btn-danger' : 'btn-primary';

      backdrop.style.display = 'flex';
      backdrop.offsetHeight;
      backdrop.classList.add('visible');

      function cleanup(result) {
        backdrop.classList.remove('visible');
        setTimeout(() => { backdrop.style.display = 'none'; }, 220);
        window.removeEventListener('keydown', onKeyDown);
        btnOk.onclick = null;
        btnCancel.onclick = null;
        backdrop.onclick = null;
        resolve(result);
      }

      function onKeyDown(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          cleanup(false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          cleanup(true);
        }
      }

      btnOk.onclick = () => cleanup(true);
      btnCancel.onclick = () => cleanup(false);
      backdrop.onclick = (e) => {
        if (e.target === backdrop) cleanup(false);
      };
      window.addEventListener('keydown', onKeyDown);
    });
  }

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
    if (state.docType === 'epub') {
      applyEpubTheme(themeName);
    }
  }

  function cycleTheme() {
    const themes = ['studio', 'warm', 'night', 'eink'];
    const nextIdx = (themes.indexOf(state.theme) + 1) % themes.length;
    applyTheme(themes[nextIdx]);
  }

  // Reading Progress Memory & Multi-device Cloud Sync (断点续读与多端进度同步)
  function calculateCurrentProgress() {
    let pct = 0;
    let loc = '1';
    let total = '?';

    if (state.docType === 'epub') {
      if (!state.epubRendition || !state.epubLocation || !state.epubLocation.start) {
        return null;
      }
      loc = state.epubLocation.start.cfi || '1';

      // 1. Try accurate locations percentage if generated
      if (state.epubBook && state.epubBook.locations && state.epubBook.locations.length() > 0) {
        const cfiPct = state.epubBook.locations.percentageFromCfi(loc);
        if (typeof cfiPct === 'number' && !isNaN(cfiPct)) {
          pct = Math.round(cfiPct * 100);
        }
      }
      // 2. Try location.start.percentage
      if (pct === 0 && state.epubLocation.start.percentage) {
        pct = Math.round(state.epubLocation.start.percentage * 100);
      }
      // 3. Fallback: Spine/Chapter index percentage (immediate, zero wait)
      if (pct === 0 && state.epubBook && state.epubBook.spine && state.epubBook.spine.items) {
        const totalSpine = state.epubBook.spine.items.length;
        const currentSpineIdx = state.epubLocation.start.index !== undefined ? state.epubLocation.start.index : 0;
        if (totalSpine > 0) {
          pct = Math.round(((currentSpineIdx + 1) / totalSpine) * 100);
        }
      }

      // If user has navigated into the book but pct is rounded to 0, mark as at least 1%
      if (pct === 0 && loc && loc !== '1') {
        const spineIdx = state.epubLocation.start.index || 0;
        if (spineIdx > 0 || (state.epubLocation.start.displayed && state.epubLocation.start.displayed.page > 1)) {
          pct = 1;
        }
      }

      const totalSpine = (state.epubBook && state.epubBook.spine && state.epubBook.spine.items) ? state.epubBook.spine.items.length : 0;
      total = totalSpine ? (totalSpine + ' 节') : 'EPUB';

    } else {
      // PDF mode
      if (!state.pdfDoc || state.totalPages < 1) return null;
      loc = String(state.currentPage || 1);
      total = String(state.totalPages);
      const rawPct = (state.currentPage / Math.max(1, state.totalPages)) * 100;
      pct = Math.round(rawPct);
      if (pct === 0 && state.currentPage > 1) {
        pct = 1;
      }
    }

    pct = Math.max(0, Math.min(100, pct));
    return { pct, loc, total };
  }

  let cloudSyncTimer = null;
  function syncReadingProgress(immediate = false) {
    const progress = calculateCurrentProgress();
    if (!progress) return;

    const { pct, loc, total } = progress;

    // 1. Local Storage persistence
    if (state.docType === 'epub') {
      if (loc && loc !== '1') {
        localStorage.setItem('clean_epub_progress_' + state.fileName, loc);
      }
    } else {
      try {
        const key = 'clean_pdf_progress_' + state.fileName;
        localStorage.setItem(key, JSON.stringify({
          pageNum: state.currentPage,
          scrollTop: DOM.viewport.scrollTop,
          timestamp: Date.now()
        }));
      } catch (e) {}
    }

    // 2. In-memory bookshelf update (immediate UI sync upon returning to bookshelf)
    if (state.currentBookId && state.cloudBooks) {
      const book = state.cloudBooks.find(b => b.id === state.currentBookId);
      if (book) {
        book.progress_percent = pct;
        book.current_location = loc;
        book.total_pages = total;
        book.last_read_at = new Date().toISOString();
      }
    }

    // 3. Cloud Supabase Sync with Debounce
    if (!state.currentBookId || !window.CloudService) return;

    if (cloudSyncTimer) {
      clearTimeout(cloudSyncTimer);
      cloudSyncTimer = null;
    }

    const doSync = () => {
      window.CloudService.updateProgress(state.currentBookId, pct, loc, total)
        .catch(err => console.warn('Supabase updateProgress failed:', err));
    };

    if (immediate) {
      doSync();
    } else {
      cloudSyncTimer = setTimeout(doSync, 1000);
    }
  }

  function saveReadingProgress(immediate = false) {
    syncReadingProgress(immediate);
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
        if (note.docType === 'epub' && note.cfiRange) {
          if (state.epubRendition) state.epubRendition.display(note.cfiRange);
          showToast('已跳转到 EPUB 笔记位置');
        } else if (note.pageNum) {
          goToPage(note.pageNum);
          showToast(`已跳转到第 ${note.pageNum} 页`);
        }
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
      clearBtn.addEventListener('click', async () => {
        const ok = await showConfirmDialog({
          title: '清空所有读书笔记？',
          message: '确定清空当前书籍的所有划词高亮和批注心得吗？<br><span style="font-size:12px;color:var(--text-muted);display:block;margin-top:6px;">此操作不可撤销。</span>',
          confirmText: '清空笔记',
          isDanger: true
        });
        if (ok) {
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
  
  // ==========================================================================
  // EPUB Integration
  // ==========================================================================

  function registerEpubThemes() {
    if (!state.epubRendition) return;
    const themes = {
      studio: {
        body: { 'background-color': '#ffffff !important', color: '#18181b !important', 'font-family': '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif !important', 'line-height': '1.85 !important', padding: '24px 32px !important' },
        'h1, h2, h3, h4': { color: '#18181b !important', 'letter-spacing': '-0.01em !important' },
        'a': { color: '#2563eb !important' },
        'p': { margin: '1.2em 0 !important', 'text-align': 'justify !important' },
        'blockquote': { 'border-left': '3px solid #2563eb !important', 'background-color': 'rgba(0,0,0,0.03) !important', color: '#52525b !important', padding: '0.8em 1.2em !important', margin: '1.5em 0 !important' }
      },
      warm: {
        body: { 'background-color': '#faf5ec !important', color: '#2d261e !important', 'font-family': '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif !important', 'line-height': '1.85 !important', padding: '24px 32px !important' },
        'h1, h2, h3, h4': { color: '#2d261e !important' },
        'a': { color: '#b45309 !important' },
        'p': { margin: '1.2em 0 !important', 'text-align': 'justify !important' },
        'blockquote': { 'border-left': '3px solid #b45309 !important', 'background-color': 'rgba(85,68,50,0.06) !important', color: '#6e6050 !important', padding: '0.8em 1.2em !important', margin: '1.5em 0 !important' }
      },
      night: {
        body: { 'background-color': '#18191d !important', color: '#f4f4f5 !important', 'font-family': '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif !important', 'line-height': '1.85 !important', padding: '24px 32px !important' },
        'h1, h2, h3, h4': { color: '#f4f4f5 !important' },
        'a': { color: '#60a5fa !important' },
        'p': { margin: '1.2em 0 !important', 'text-align': 'justify !important' },
        'blockquote': { 'border-left': '3px solid #3b82f6 !important', 'background-color': 'rgba(255,255,255,0.05) !important', color: '#a1a1aa !important', padding: '0.8em 1.2em !important', margin: '1.5em 0 !important' }
      },
      eink: {
        body: { 'background-color': '#ffffff !important', color: '#09090b !important', 'font-family': '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif !important', 'line-height': '1.85 !important', padding: '24px 32px !important' },
        'h1, h2, h3, h4': { color: '#09090b !important' },
        'a': { color: '#000000 !important' },
        'p': { margin: '1.2em 0 !important', 'text-align': 'justify !important' },
        'blockquote': { 'border-left': '3px solid #000000 !important', 'background-color': 'rgba(0,0,0,0.05) !important', color: '#3f3f46 !important', padding: '0.8em 1.2em !important', margin: '1.5em 0 !important' }
      }
    };

    Object.keys(themes).forEach(name => {
      try { state.epubRendition.themes.register(name, themes[name]); } catch (e) {}
    });
  }

  function applyEpubTheme(theme) {
    if (!state.epubRendition) return;
    registerEpubThemes();
    try {
      state.epubRendition.themes.select(theme);
      state.epubRendition.themes.fontSize(`${state.epubFontSize}%`);
    } catch (e) {}
  }

  function updateEpubProgressDisplay() {
    if (!state.epubRendition || !state.epubLocation) return;
    const loc = state.epubLocation;
    const progress = calculateCurrentProgress();
    const pct = progress ? progress.pct : 0;

    const currentPage = (loc.start && loc.start.displayed) ? loc.start.displayed.page : (loc.start && loc.start.index !== undefined ? loc.start.index + 1 : 1);
    const totalPages = (loc.start && loc.start.displayed) ? loc.start.displayed.total : (state.epubBook && state.epubBook.spine && state.epubBook.spine.items ? state.epubBook.spine.items.length : '?');

    DOM.pageInput.value = currentPage;
    DOM.pageCount.textContent = `/ ${totalPages} (${pct}%)`;
    if (DOM.epubFooterProgress) {
      DOM.epubFooterProgress.textContent = `阅读进度: ${pct}%`;
    }
  }

  function renderEpubMetadata(meta) {
    if (!DOM.thumbnailsView) return;
    DOM.thumbnailsView.innerHTML = `
      <div class="epub-info-card">
        <div class="epub-info-title">${meta.title || state.fileName}</div>
        <div class="epub-info-meta"><strong>作者：</strong>${meta.creator || '未知'}</div>
        <div class="epub-info-meta"><strong>出版：</strong>${meta.publisher || '未知'}</div>
        <div class="epub-info-meta"><strong>语言：</strong>${meta.language || 'zh-CN'}</div>
        ${meta.description ? `<div style="margin-top:8px;color:var(--text-muted);font-size:11px;">${meta.description.substring(0, 180)}...</div>` : ''}
      </div>
      <div style="padding:10px 16px;font-size:11px;color:var(--text-muted);line-height:1.6;">
        提示：EPUB 为自适应流式排版，点击顶部【目录大纲】标签可查看完整章节导航，点击【读书笔记】可查看划线批注。
      </div>
    `;
  }

  function renderEpubOutline(tocItems) {
    if (!DOM.outlineView) return;
    DOM.outlineView.innerHTML = '';
    if (!tocItems || tocItems.length === 0) {
      DOM.outlineView.innerHTML = `
        <div style="text-align:center;padding:32px 12px;color:var(--text-muted);font-size:12px;">
          此 EPUB 电子书未提供目录大纲
        </div>`;
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'outline-list';

    function buildTree(items, container) {
      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'outline-item';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'outline-title';
        titleSpan.textContent = item.label ? item.label.trim() : '章节';
        titleSpan.title = titleSpan.textContent;

        li.appendChild(titleSpan);
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          if (state.epubRendition) {
            state.epubRendition.display(item.href);
          }
          document.querySelectorAll('.outline-item').forEach(el => el.classList.remove('active'));
          li.classList.add('active');
          if (DOM.epubFooterTitle && item.label) {
            DOM.epubFooterTitle.textContent = item.label.trim();
          }
        });

        container.appendChild(li);

        if (item.subitems && item.subitems.length > 0) {
          const subUl = document.createElement('ul');
          subUl.className = 'outline-sublist';
          buildTree(item.subitems, subUl);
          container.appendChild(subUl);
        }
      });
    }

    buildTree(tocItems, ul);
    DOM.outlineView.appendChild(ul);
  }

  async function loadEPUB(data, fileName, initialLocation = null) {
    try {
      showToast('正在加载 EPUB 电子书...', 1500);

      // Clean up PDF rendering tasks
      if (state.pdfDoc) {
        state.pageRenderingTasks.forEach(task => { try { task.cancel(); } catch (e) {} });
        state.pageRenderingTasks.clear();
        state.renderedPages.clear();
        state.pdfDoc = null;
      }

      // Clean up previous EPUB
      if (state.epubBook) {
        try { state.epubBook.destroy(); } catch (e) {}
        state.epubBook = null;
        state.epubRendition = null;
      }

      state.docType = 'epub';
      state.fileName = fileName || 'Document.epub';
      DOM.docTitle.textContent = state.fileName;
      DOM.docTitle.title = state.fileName;

      // Switch viewports
      DOM.pagesWrapper.style.display = 'none';
      DOM.epubWrapper.style.display = 'flex';
      DOM.emptyState.style.display = 'none';
      DOM.epubViewerArea.innerHTML = '';

      // Initialize ePub
      state.epubBook = ePub(data);
      state.epubRendition = state.epubBook.renderTo(DOM.epubViewerArea, {
        width: '100%',
        height: '100%',
        flow: 'paginated',
        spread: 'auto'
      });

      // Register themes
      applyEpubTheme(state.theme);

      // Restore Reading Progress (CFI)
      const key = 'clean_epub_progress_' + state.fileName;
      const savedCfi = localStorage.getItem(key);
      const targetCfi = (initialLocation && initialLocation !== '1') ? initialLocation : savedCfi;

      await state.epubRendition.display(targetCfi || undefined);
      if (targetCfi) {
        showToast('已恢复阅读进度', 2200);
      }

      // Generate locations for percentage calculation
      state.epubBook.ready.then(() => {
        return state.epubBook.locations.generate(1000);
      }).then(() => {
        updateEpubProgressDisplay();
        syncReadingProgress(false);
      }).catch(() => {});

      // Metadata & Title
      state.epubBook.loaded.metadata.then((meta) => {
        if (meta && meta.title) {
          DOM.docTitle.textContent = meta.title;
          if (DOM.epubFooterTitle) DOM.epubFooterTitle.textContent = meta.title;
        }
        renderEpubMetadata(meta || {});
      });

      // Navigation / TOC
      state.epubBook.loaded.navigation.then((nav) => {
        renderEpubOutline(nav.toc);
      });

      // Location tracker
      state.epubRendition.on('relocated', (location) => {
        state.epubLocation = location;
        if (location && location.start) {
          updateEpubProgressDisplay();
          syncReadingProgress(false);
        }
      });

      // Forward keyboard from EPUB iframe
      state.epubRendition.on('keydown', (e) => {
        handleGlobalKeyEvent(e);
      });

      // Text selection & note-taking inside EPUB
      state.epubRendition.on('selected', (cfiRange, contents) => {
        const selection = contents.window.getSelection();
        const text = selection.toString().trim();
        if (text) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const iframeEl = DOM.epubViewerArea.querySelector('iframe');
          const iframeRect = iframeEl ? iframeEl.getBoundingClientRect() : { top: 60, left: 200 };

          state.currentSelection = {
            text: text,
            cfiRange: cfiRange,
            docType: 'epub',
            pageNum: DOM.pageInput.value || 1,
            position: {
              top: iframeRect.top + rect.top,
              left: iframeRect.left + rect.left + rect.width / 2
            }
          };

          if (DOM.selectionBar) {
            DOM.selectionBar.style.top = `${iframeRect.top + rect.top - 46}px`;
            DOM.selectionBar.style.left = `${iframeRect.left + rect.left + rect.width / 2}px`;
            DOM.selectionBar.classList.add('visible');
          }
        }
      });

      // Load Notes
      loadNotesFromStorage();

      // Adjust toolbar items for EPUB
      DOM.zoomLabel.textContent = `${state.epubFontSize}%`;
      DOM.fitWidthBtn.style.display = 'none';
      DOM.fitPageBtn.style.display = 'none';
      DOM.rotateBtn.style.display = 'none';

      // Switch to outline tab if empty
      if (DOM.tabOutline) {
        DOM.tabOutline.click();
      }

    } catch (err) {
      console.error('Failed to load EPUB:', err);
      showToast('EPUB 文件解析失败：' + (err.message || '未知错误'), 4000);
    }
  }

  function loadDocument(data, fileName) {
    const isEpub = (fileName && fileName.toLowerCase().endsWith('.epub')) ||
                   (typeof data === 'string' && data.toLowerCase().endsWith('.epub'));
    if (isEpub) {
      loadEPUB(data, fileName || 'Document.epub');
    } else {
      loadPDF(data, fileName || 'Document.pdf');
    }
  }

  async function loadPDF(source, name = 'Document.pdf', initialPage = null) {
    try {
      state.docType = 'pdf';
      DOM.fitWidthBtn.style.display = '';
      DOM.fitPageBtn.style.display = '';
      DOM.rotateBtn.style.display = '';
      DOM.pagesWrapper.style.display = 'flex';
      DOM.epubWrapper.style.display = 'none';
      if (state.epubBook) {
        try { state.epubBook.destroy(); } catch (e) {}
        state.epubBook = null;
        state.epubRendition = null;
      }
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
      if (initialPage && initialPage > 1 && initialPage <= state.totalPages) {
        goToPage(initialPage);
        showToast(`已恢复阅读进度：第 ${initialPage} 页`, 2200);
      } else {
        restoreReadingProgress();
      }
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
    if (state.docType === 'epub') {
      if (state.epubRendition) state.epubRendition.next();
    } else {
      if (state.currentPage < state.totalPages) {
        goToPage(state.currentPage + 1);
      }
    }
  }

  function prevPage() {
    if (state.docType === 'epub') {
      if (state.epubRendition) state.epubRendition.prev();
    } else {
      if (state.currentPage > 1) {
        goToPage(state.currentPage - 1);
      }
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
    if (state.docType === 'epub') {
      state.epubFontSize = Math.min(220, state.epubFontSize + 10);
      if (state.epubRendition) state.epubRendition.themes.fontSize(`${state.epubFontSize}%`);
      DOM.zoomLabel.textContent = `${state.epubFontSize}%`;
    } else {
      setScale(state.scale * 1.2);
    }
  }

  function zoomOut() {
    if (state.docType === 'epub') {
      state.epubFontSize = Math.max(70, state.epubFontSize - 10);
      if (state.epubRendition) state.epubRendition.themes.fontSize(`${state.epubFontSize}%`);
      DOM.zoomLabel.textContent = `${state.epubFontSize}%`;
    } else {
      setScale(state.scale / 1.2);
    }
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
  
  // ==========================================================================
  // Bookshelf & Cloud Sync
  // ==========================================================================
  
  // ==========================================================================
  // Upgraded Bookshelf & Cloud Sync Logic
  // ==========================================================================
  function showBookshelf() {
    if (!DOM.bookshelfView) return;
    DOM.bookshelfView.classList.remove('hidden');
    refreshBookshelf();
  }

  function hideBookshelf() {
    if (!DOM.bookshelfView) return;
    DOM.bookshelfView.classList.add('hidden');
  }

  // Classic Editorial Cloth Cover Palette (Penguin / Faber inspired)
  function getClothCoverStyle(title) {
    const palettes = [
      { bg: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', border: 'rgba(148, 163, 184, 0.35)' },
      { bg: 'linear-gradient(145deg, #701a28 0%, #450a0a 100%)', border: 'rgba(254, 205, 211, 0.35)' },
      { bg: 'linear-gradient(145deg, #064e3b 0%, #022c22 100%)', border: 'rgba(167, 243, 208, 0.35)' },
      { bg: 'linear-gradient(145deg, #78350f 0%, #451a03 100%)', border: 'rgba(253, 230, 138, 0.35)' },
      { bg: 'linear-gradient(145deg, #334155 0%, #1e293b 100%)', border: 'rgba(203, 213, 225, 0.35)' },
      { bg: 'linear-gradient(145deg, #4c1d95 0%, #2e1065 100%)', border: 'rgba(233, 213, 255, 0.35)' }
    ];
    let hash = 0;
    const str = title || 'Book';
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return palettes[Math.abs(hash) % palettes.length];
  }

  function renderBookCoverHtml(book) {
    const isBlob = book.cover_url && book.cover_url.startsWith('blob:');
    const hasValidCover = book.cover_url && !isBlob;

    if (hasValidCover) {
      return '<img src="' + book.cover_url + '" class="book-cover-img" alt="' + book.title + '" loading="lazy"/>';
    }

    const style = getClothCoverStyle(book.title);
    return `
      <div class="book-cloth-cover" style="background: ${style.bg};">
        <div class="book-cloth-frame" style="border-color: ${style.border};">
          <div class="cloth-title">${book.title}</div>
          <div class="cloth-format">${book.format ? book.format.toUpperCase() : 'BOOK'}</div>
        </div>
      </div>
    `;
  }

  function getBookProgressInfo(book) {
    let pct = Number(book.progress_percent) || 0;
    const loc = book.current_location;
    // Check if user has read into the book
    const hasRead = pct > 0 || (loc && loc !== '1' && loc !== 'null' && loc !== '' && loc !== undefined);

    if (pct === 0 && hasRead) {
      pct = 1; // Started reading, ensure at least 1%
    }

    const isDone = pct >= 100;
    const isReading = pct > 0 && pct < 100;

    let label = '未读';
    let pillClass = 'unread';

    if (isDone) {
      label = '已读完';
      pillClass = 'done';
    } else if (isReading) {
      label = '已读 ' + pct + '%';
      pillClass = 'reading';
    }

    return { pct, label, pillClass, isReading, isDone };
  }

  function updateShelfCounts(books) {
    if (!books) return;
    const all = books.length;
    const reading = books.filter(b => getBookProgressInfo(b).isReading).length;
    const epub = books.filter(b => b.format === 'epub').length;
    const pdf = books.filter(b => b.format === 'pdf').length;

    if (DOM.countAll) DOM.countAll.textContent = all;
    if (DOM.countReading) DOM.countReading.textContent = reading;
    if (DOM.countEpub) DOM.countEpub.textContent = epub;
    if (DOM.countPdf) DOM.countPdf.textContent = pdf;
  }

  function getFilteredBooks() {
    let list = state.cloudBooks || [];
    const filter = state.shelfFilter || 'all';

    if (filter === 'reading') {
      list = list.filter(b => getBookProgressInfo(b).isReading);
    } else if (filter === 'epub') {
      list = list.filter(b => b.format === 'epub');
    } else if (filter === 'pdf') {
      list = list.filter(b => b.format === 'pdf');
    }

    if (DOM.shelfSearchInput) {
      const q = DOM.shelfSearchInput.value.toLowerCase().trim();
      if (q) list = list.filter(b => b.title.toLowerCase().includes(q));
    }
    return list;
  }

  async function refreshBookshelf() {
    if (!window.CloudService || !DOM.shelfGrid) return;
    DOM.shelfLoading.style.display = 'flex';
    DOM.shelfLoadingText.textContent = '正在同步云端书架...';

    try {
      const books = await window.CloudService.listBooks();
      state.cloudBooks = books;
      updateShelfCounts(books);
      renderBookshelf(getFilteredBooks());
      DOM.shelfStats.textContent = '多端实时同步 · 共 ' + books.length + ' 本书';
    } catch (err) {
      console.warn('Failed to load books from Supabase:', err);
      DOM.shelfStats.textContent = '云端表尚未初始化或正在连接...';
      renderBookshelfEmptyState(err);
    } finally {
      DOM.shelfLoading.style.display = 'none';
    }
  }

  function renderBookshelf(books) {
    if (!DOM.shelfGrid) return;
    DOM.shelfGrid.innerHTML = '';

    // Apply list-view class if needed
    if (state.shelfViewMode === 'list') {
      DOM.shelfGrid.classList.add('list-view');
    } else {
      DOM.shelfGrid.classList.remove('list-view');
    }

    if (!books || books.length === 0) {
      DOM.shelfGrid.innerHTML = `
        <div class="shelf-empty">
          <svg style="width:48px;height:48px;margin:0 auto 12px;opacity:0.35;display:block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></svg>
          <div style="font-size:14px;font-weight:600;margin-bottom:6px;">当前分类暂无书籍</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:16px;">点击右上角【上传新书】或把书籍文件直接拖入窗口</div>
          <button id="btnShelfOpenSample" class="btn-primary" style="font-size:12px;padding:6px 14px;">打开内置演示书</button>
        </div>
      `;
      const btn = document.getElementById('btnShelfOpenSample');
      if (btn) btn.addEventListener('click', () => { hideBookshelf(); loadDocument('./sample.pdf', 'Sample Document.pdf'); });
      return;
    }

    books.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';
      const info = getBookProgressInfo(book);
      const sizeStr = (book.file_size / (1024 * 1024)).toFixed(1) + ' MB';
      const isList = state.shelfViewMode === 'list';

      if (isList) {
        card.innerHTML = `
          <div class="book-jacket">
            ${renderBookCoverHtml(book)}
          </div>
          <div class="book-info">
            <div class="book-title-text" title="${book.title}">${book.title}</div>
            <div class="book-meta-row">
              <span class="book-badge" style="position:static;display:inline-block;margin-right:6px;">${book.format}</span>
              <span>${sizeStr}</span>
              <span style="margin: 0 4px;">·</span>
              <span class="book-progress-pill ${info.pillClass}">${info.label}</span>
            </div>
            ${info.pct > 0 ? `
              <div class="book-card-progress-bar">
                <div class="book-card-progress-fill ${info.isDone ? 'done' : ''}" style="width: ${info.pct}%"></div>
              </div>
            ` : ''}
          </div>
          <div class="book-list-actions">
            <span class="btn-small" style="color:var(--accent-color);font-weight:600;">阅读</span>
            <button class="book-delete-icon" title="从云端删除">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="book-jacket">
            ${renderBookCoverHtml(book)}
            <span class="book-badge">${book.format}</span>
            ${info.pct > 0 ? `
              <div class="book-card-progress-bar jacket-bar">
                <div class="book-card-progress-fill ${info.isDone ? 'done' : ''}" style="width: ${info.pct}%"></div>
              </div>
            ` : ''}
          </div>
          <div class="book-info">
            <div class="book-title-text" title="${book.title}">${book.title}</div>
            <div class="book-meta-row">
              <span class="book-progress-pill ${info.pillClass}">${info.label}</span>
              <button class="book-delete-icon" title="从云端删除">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `;
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.book-delete-icon')) return;
        openCloudBook(book);
      });

      const delBtn = card.querySelector('.book-delete-icon');
            if (delBtn) {
        delBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const ok = await showConfirmDialog({
            title: '从云端删除书籍？',
            message: '确定要彻底删除 <strong>《' + book.title + '》</strong> 吗？<br><span style="font-size:12px;color:var(--text-muted);display:block;margin-top:6px;">该书籍文件及所有设备上的阅读进度与笔记将被永久移除。</span>',
            confirmText: '确认删除',
            isDanger: true
          });
          if (ok) {
            showToast('正在删除...');
            try {
              await window.CloudService.deleteBook(book);
              showToast('已从云端删除书籍');
              refreshBookshelf();
            } catch (err) {
              showToast('删除失败：' + err.message);
            }
          }
        });
      }

      DOM.shelfGrid.appendChild(card);
    });
  }

  function renderBookshelfEmptyState(err) {
    if (!DOM.shelfGrid) return;
    DOM.shelfGrid.innerHTML = `
      <div class="shelf-empty">
        <svg style="width:40px;height:40px;margin:0 auto 10px;color:#f59e0b;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div style="font-size:13px;font-weight:600;margin-bottom:6px;">云端数据库尚未执行建表语句</div>
        <div style="font-size:12px;color:var(--text-muted);max-width:440px;margin:0 auto 14px;line-height:1.6;">
          请在 Supabase 后台的 SQL Editor 中粘贴运行建表 SQL 脚本即可激活多端同步功能。
        </div>
        <button id="btnFallbackLocal" class="btn-secondary" style="font-size:12px;">直接本地离线阅读</button>
      </div>
    `;
    const btn = document.getElementById('btnFallbackLocal');
    if (btn) btn.addEventListener('click', hideBookshelf);
  }

  async function openCloudBook(book) {
    state.currentBookId = book.id;
    hideBookshelf();
    showToast('正在打开《' + book.title + '》...', 2000);

    const fileUrl = window.CloudService.getBookFileUrl(book.file_path);
    if (!fileUrl) {
      showToast('获取文件链接失败');
      return;
    }

    try {
      const resp = await fetch(fileUrl);
      const arrayBuffer = await resp.arrayBuffer();
      const fileName = book.file_name || (book.title + '.' + book.format);

      if (book.format === 'epub') {
        await loadEPUB(arrayBuffer, fileName, book.current_location);
        // Self-healing: if cover was broken blob or missing, update it now!
        if (!book.cover_url || book.cover_url.startsWith('blob:')) {
          generateEpubCover(arrayBuffer.slice(0)).then(newCover => {
            if (newCover) {
              const sb = window.supabase && window.supabase.createClient(window.CLOUD_CONFIG.SUPABASE_URL, window.CLOUD_CONFIG.SUPABASE_KEY);
              if (sb) sb.from('books').update({ cover_url: newCover }).eq('id', book.id).then(() => {});
            }
          });
        }
      } else {
        const initialPage = book.current_location ? parseInt(book.current_location, 10) : null;
        await loadPDF(new Uint8Array(arrayBuffer), fileName, initialPage);
        // Self-healing cover for PDF
        if (!book.cover_url || book.cover_url.startsWith('blob:')) {
          generatePdfCover(arrayBuffer.slice(0)).then(newCover => {
            if (newCover) {
              const sb = window.supabase && window.supabase.createClient(window.CLOUD_CONFIG.SUPABASE_URL, window.CLOUD_CONFIG.SUPABASE_KEY);
              if (sb) sb.from('books').update({ cover_url: newCover }).eq('id', book.id).then(() => {});
            }
          });
        }
      }
    } catch (e) {
      console.error('Failed to download cloud book:', e);
      showToast('下载文件失败，请检查网络或 Bucket 权限');
    }
  }

  async function handleShelfUpload(file) {

    if (!file) return;
    DOM.shelfLoading.style.display = 'flex';
    DOM.shelfLoadingText.textContent = '正在解析并上传书籍...';

    try {
      await window.CloudService.uploadBook(file, (pct, status) => {
        DOM.shelfLoadingText.textContent = status || ('正在上传... ' + pct + '%');
      });
      showToast('上传成功！电脑与手机均可同步阅读');
      refreshBookshelf();
    } catch (err) {
      console.error('Upload failed:', err);
      showToast('上传失败：' + (err.message || '未知错误'), 4000);
    } finally {
      DOM.shelfLoading.style.display = 'none';
    }
  }

  function bindEvents() {
    // Bookshelf Bindings
    
    // View Mode Toggle (Gallery vs List)
    if (DOM.shelfViewToggleBtn) {
      DOM.shelfViewToggleBtn.addEventListener('click', () => {
        state.shelfViewMode = state.shelfViewMode === 'gallery' ? 'list' : 'gallery';
        localStorage.setItem('clean_shelf_view_mode', state.shelfViewMode);
        renderBookshelf(getFilteredBooks());
      });
    }

    // Shelf Filter Tabs
    document.querySelectorAll('.shelf-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shelf-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.shelfFilter = btn.dataset.filter || 'all';
        renderBookshelf(getFilteredBooks());
      });
    });

    if (DOM.btnBackToShelf) {
      DOM.btnBackToShelf.addEventListener('click', () => {
        syncReadingProgress(true);
        showBookshelf();
      });
    }

    // Flush progress on tab hide / browser unload
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        syncReadingProgress(true);
      }
    });
    window.addEventListener('beforeunload', () => {
      syncReadingProgress(true);
    });
    if (DOM.shelfThemeBtn) {
      DOM.shelfThemeBtn.addEventListener('click', cycleTheme);
    }
    if (DOM.shelfFileInput) {
      DOM.shelfFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleShelfUpload(file);
      });
    }
    if (DOM.shelfSearchInput) {
      DOM.shelfSearchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = state.cloudBooks.filter(b => b.title.toLowerCase().includes(q));
        renderBookshelf(filtered);
      });
    }

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
            saveReadingProgress(false);
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
          loadDocument(this.result, file.name);
        };
        reader.readAsArrayBuffer(file);
      }
    });

    if (DOM.openSampleBtn) {
      DOM.openSampleBtn.addEventListener('click', () => {
        loadDocument('./sample.pdf', 'Sample Document.pdf');
      });
    }

    if (DOM.openSampleEpubBtn) {
      DOM.openSampleEpubBtn.addEventListener('click', () => {
        loadDocument('./sample.epub', '静心阅读的艺术.epub');
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
      if (files && files.length > 0) {
        const file = files[0];
        const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type.includes('pdf');
        const isEpub = file.name.toLowerCase().endsWith('.epub') || file.type.includes('epub');
        if (isPdf || isEpub) {
          const reader = new FileReader();
          reader.onload = function () {
            loadDocument(this.result, file.name);
          };
          reader.readAsArrayBuffer(file);
        } else {
          showToast('请上传 PDF 或 EPUB 文件', 3000);
        }
      }
    });

    // Keyboard Shortcuts
      function handleGlobalKeyEvent(e) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'j' || e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextPage();
    } else if (e.key === 'k' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
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
      if (state.docType === 'epub') {
        state.epubFontSize = 100;
        if (state.epubRendition) state.epubRendition.themes.fontSize('100%');
        DOM.zoomLabel.textContent = '100%';
      } else {
        setScale(1.0, 'custom');
      }
    } else if (e.key === 'w' || e.key === 'W') {
      if (state.docType !== 'epub') {
        e.preventDefault();
        DOM.fitWidthBtn.click();
      }
    } else if (e.key === 'p' || e.key === 'P') {
      if (state.docType !== 'epub') {
        e.preventDefault();
        DOM.fitPageBtn.click();
      }
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
      if (state.docType !== 'epub') {
        e.preventDefault();
        rotateClockwise();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      DOM.searchBtn.click();
    }
  }

    window.addEventListener('keydown', handleGlobalKeyEvent);

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

  // Expose loadDocument, loadPDF, loadEPUB and state
  window.loadDocument = loadDocument;
  window.loadPDF = loadPDF;
  window.loadEPUB = loadEPUB;
  window.state = state;

  // Initialization
  function init() {
    applyTheme(state.theme);
    bindEvents();
    if (window.CloudService && window.CloudService.isConfigured()) {
      showBookshelf();
    } else {
      loadPDF('./sample.pdf', 'Sample Document.pdf');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
