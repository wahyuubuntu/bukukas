<script>
  lucide.createIcons();

  // SW & PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker failed', err));
  }

  let deferredPrompt;
  const installBanner = document.getElementById('installBanner');
  const installBtn = document.getElementById('installBtn');
  const closeBtn = document.getElementById('closeBanner');
  const hideUntil = localStorage.getItem('hideInstallUntil');
  const now = new Date();

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!hideUntil || new Date(hideUntil) < now) {
      installBanner.classList.remove('-translate-y-full');
    }
  });

  installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('PWA diinstal');
          installBanner.remove();
        }
      });
    }
  });

  closeBtn.addEventListener('click', () => {
    installBanner.classList.add('-translate-y-full');
    const hideUntilDate = new Date();
    hideUntilDate.setMinutes(hideUntilDate.getMinutes() + 5);
    localStorage.setItem('hideInstallUntil', hideUntilDate.toISOString());
  });

  // === BACKUP ===
  document.getElementById('backupBtn').addEventListener('click', () => {
    const data = localStorage.getItem('transaksiKas') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buku_kas_backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // === IMPORT ===
  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!Array.isArray(importedData)) {
          alert('Data tidak valid!');
          return;
        }
        localStorage.setItem('transaksiKas', JSON.stringify(importedData));
        alert('Data berhasil diimpor! Halaman akan dimuat ulang.');
        location.reload();
      } catch (err) {
        alert('Gagal mengimpor data: Format file tidak valid.');
      }
    };
    reader.readAsText(file);
  });
</script>
