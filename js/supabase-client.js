// Supabase Cloud Storage & Database Manager
(function () {
  'use strict';

  let client = null;

  function getClient() {
    if (!client && window.supabase && window.CLOUD_CONFIG) {
      client = window.supabase.createClient(
        window.CLOUD_CONFIG.SUPABASE_URL,
        window.CLOUD_CONFIG.SUPABASE_KEY
      );
    }
    return client;
  }

  // Generate cover thumbnail from PDF
  async function generatePdfCover(arrayBuffer) {
    try {
      if (!window.pdfjsLib) return null;
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await doc.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (e) {
      console.warn('Failed to generate PDF cover:', e);
      return null;
    }
  }

  // Generate cover thumbnail from EPUB
  async function generateEpubCover(arrayBuffer) {
    try {
      if (!window.ePub) return null;
      const book = ePub(arrayBuffer);
      await book.ready;
      const coverUrl = await book.coverUrl();
      if (coverUrl) return coverUrl;
    } catch (e) {
      console.warn('Failed to generate EPUB cover:', e);
    }
    return null;
  }

  window.CloudService = {
    isConfigured: function () {
      return Boolean(window.CLOUD_CONFIG && window.CLOUD_CONFIG.SUPABASE_URL && window.CLOUD_CONFIG.SUPABASE_KEY);
    },

    listBooks: async function () {
      const sb = getClient();
      if (!sb) throw new Error('Supabase client not initialized');
      const { data, error } = await sb
        .from('books')
        .select('*')
        .order('last_read_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    uploadBook: async function (file, onProgress) {
      const sb = getClient();
      if (!sb) throw new Error('Supabase client not initialized');

      const isEpub = file.name.toLowerCase().endsWith('.epub');
      const format = isEpub ? 'epub' : 'pdf';
      const arrayBuffer = await file.arrayBuffer();

      // 1. Generate cover
      let coverUrl = null;
      if (format === 'pdf') {
        coverUrl = await generatePdfCover(arrayBuffer.slice(0));
      } else {
        coverUrl = await generateEpubCover(arrayBuffer.slice(0));
      }

      // 2. Upload file to Storage Bucket
      const fileExt = isEpub ? 'epub' : 'pdf';
      const safeName = encodeURIComponent(file.name.replace(/[^a-zA-Z0-9.\u4e00-\u9fa5_-]/g, '_'));
      const filePath = `uploads/${Date.now()}_${safeName}`;

      if (onProgress) onProgress(30, '正在上传到云存储...');

      const { data: uploadData, error: uploadError } = await sb.storage
        .from(window.CLOUD_CONFIG.STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      if (onProgress) onProgress(80, '正在记录书籍信息...');

      // 3. Get Public Download URL
      const { data: { publicUrl } } = sb.storage
        .from(window.CLOUD_CONFIG.STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // 4. Insert into books table
      const title = file.name.replace(/\.(pdf|epub)$/i, '');
      const bookRecord = {
        title: title,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        format: format,
        cover_url: coverUrl,
        progress_percent: 0,
        current_location: '1',
        total_pages: '?',
        notes: [],
        last_read_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { data: inserted, error: insertError } = await sb
        .from('books')
        .insert([bookRecord])
        .select()
        .single();

      if (insertError) throw insertError;
      if (onProgress) onProgress(100, '上传完成！');

      return inserted;
    },

    deleteBook: async function (book) {
      const sb = getClient();
      if (!sb) throw new Error('Supabase client not initialized');

      // 1. Remove file from storage
      if (book.file_path) {
        await sb.storage.from(window.CLOUD_CONFIG.STORAGE_BUCKET).remove([book.file_path]);
      }

      // 2. Remove record from table
      const { error } = await sb
        .from('books')
        .delete()
        .eq('id', book.id);

      if (error) throw error;
      return true;
    },

    updateProgress: async function (bookId, percent, location, totalPages) {
      const sb = getClient();
      if (!sb || !bookId) return;

      const updateData = {
        progress_percent: Math.max(0, Math.min(100, Math.round(percent))),
        current_location: String(location),
        last_read_at: new Date().toISOString()
      };
      if (totalPages) {
        updateData.total_pages = String(totalPages);
      }

      await sb.from('books').update(updateData).eq('id', bookId);
    },

    getBookFileUrl: function (filePath) {
      const sb = getClient();
      if (!sb || !filePath) return null;
      const { data } = sb.storage
        .from(window.CLOUD_CONFIG.STORAGE_BUCKET)
        .getPublicUrl(filePath);
      return data ? data.publicUrl : null;
    }
  };
})();
