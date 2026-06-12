var selectedFiles = [];

// אם הדף שוחזר מה-bfcache (כפתור חזור) — טען מחדש כדי לאפס state
window.addEventListener('pageshow', function(e) {
  if (e.persisted) window.location.reload();
});

function validateImageFiles(files) {
  const blocked = Array.from(files).filter(f =>
    f.name.toLowerCase().endsWith('.heic') || f.name.toLowerCase().endsWith('.heif') ||
    f.type === 'image/heic' || f.type === 'image/heif'
  );
  if (blocked.length) {
    alert('⚠️ תמונות מסוג HEIC/HEIF (iPhone) לא נתמכות בדפדפנים.\n\nאנא המר לJPEG/PNG לפני העלאה:\n• iPhone: בהגדרות → מצלמה → פורמטים → "הכי תואם"\n• או שלח לוואטסאפ ושמור שוב');
    return false;
  }
  return true;
}

async function uploadListingImages(listingId, startOrder) {
  if (!selectedFiles.length) return;
  startOrder = startOrder || 0;
  const filesToUpload = [...selectedFiles];
  selectedFiles = [];
  for (var i = 0; i < filesToUpload.length; i++) {
    var file = filesToUpload[i];
    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    var path = listingId + '/' + Date.now() + '-' + i + '.' + ext;
    try {
      var up = await supabase.storage.from('listing-images').upload(path, file, { cacheControl: '3600', upsert: true });
      if (up.error) {
        console.error('Storage upload error:', up.error);
        alert('שגיאת העלאה: ' + JSON.stringify(up.error));
      } else {
        await supabase.from('listing_images').insert({
          listing_id: listingId,
          storage_path: path,
          display_order: startOrder + i
        });
      }
    } catch(e) {
      console.error('Upload exception:', e);
      alert('שגיאה בהעלאה: ' + e.message);
    }
  }
}
