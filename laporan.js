const laporanBody = document.getElementById('laporanBody');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const filterKategori = document.getElementById('filterKategori');

let transaksi = JSON.parse(localStorage.getItem('transaksiKas')) || [];

function formatRupiah(val) {
  return 'Rp ' + val.toLocaleString();
}

function filterData() {
  let filtered = transaksi;

  if (startDate.value) {
    filtered = filtered.filter(t => t.tanggal >= startDate.value);
  }

  if (endDate.value) {
    filtered = filtered.filter(t => t.tanggal <= endDate.value);
  }

  if (filterKategori.value) {
    filtered = filtered.filter(t => t.kategori === filterKategori.value);
  }

  renderTable(filtered);
}

function renderTable(data) {
  laporanBody.innerHTML = '';

  if (data.length === 0) {
    laporanBody.innerHTML = `<tr><td colspan="6" class="text-center p-4 text-gray-500">Tidak ada data</td></tr>`;
    return;
  }

  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border p-2">${item.tanggal}</td>
      <td class="border p-2">${item.ket}</td>
      <td class="border p-2 capitalize">${item.kategori}</td>
      <td class="border p-2">${item.qty}</td>
      <td class="border p-2">${formatRupiah(item.harga)}</td>
      <td class="border p-2">${formatRupiah(Math.abs(item.jumlah))}</td>
    `;
    laporanBody.appendChild(row);
  });
}

// ✅ FIX: Export PDF berisi judul + tabel
function exportPDF() {
  const el = document.getElementById('laporanExport');
  html2pdf().set({
    margin: 10,
    filename: 'laporan-kas.pdf',
    html2canvas: { scale: 1 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(el).save();
}

// Event listeners
startDate.addEventListener('change', filterData);
endDate.addEventListener('change', filterData);
filterKategori.addEventListener('change', filterData);

// Load awal
filterData();
