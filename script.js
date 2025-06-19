const form = document.getElementById('kasForm');
const keteranganInput = document.getElementById('keterangan');
const jumlahBarangInput = document.getElementById('jumlahBarang');
const hargaSatuanInput = document.getElementById('hargaSatuan');
const kategoriInput = document.getElementById('kategori');
const tanggalInput = document.getElementById('tanggal');
const list = document.getElementById('transaksiList');
const saldoDiv = document.getElementById('saldo');
const formBtnText = document.getElementById('formBtnText');

let transaksi = [];
let editIndex = null;

// === SETUP TANGGAL ===
const today = new Date().toISOString().split('T')[0];
tanggalInput.value = today;
tanggalInput.max = today;

// === AMBIL DARI LOCALSTORAGE SAAT AWAL ===
if (localStorage.getItem('transaksiKas')) {
  transaksi = JSON.parse(localStorage.getItem('transaksiKas'));
  renderTransaksi();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const ket = keteranganInput.value.trim();
  const jumlahBarang = parseInt(jumlahBarangInput.value);
  const hargaSatuan = parseInt(hargaSatuanInput.value);
  const kategori = kategoriInput.value;
  const tanggal = tanggalInput.value;

  if (!ket || isNaN(jumlahBarang) || isNaN(hargaSatuan) || !tanggal || tanggal > today) {
    alert("Harap isi semua data dengan benar dan tanggal tidak boleh melebihi hari ini.");
    return;
  }

  const total = jumlahBarang * hargaSatuan;
  const nilai = kategori === 'masuk' ? total : -total;
  const data = { ket, jumlah: nilai, kategori, tanggal, qty: jumlahBarang, harga: hargaSatuan };

  if (editIndex !== null) {
    transaksi[editIndex] = data;
    editIndex = null;
    formBtnText.textContent = "Tambah Transaksi";
  } else {
    transaksi.push(data);
  }

  saveToLocalStorage();
  resetForm();
  renderTransaksi();
});

function renderTransaksi() {
  list.innerHTML = '';
  let saldo = 0;

  transaksi.forEach((item, index) => {
    saldo += item.jumlah;

    const li = document.createElement('li');
    li.className = `
      p-4 rounded-lg flex justify-between items-start shadow flex-col sm:flex-row sm:items-center
      ${item.kategori === 'masuk' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
    `;

    li.innerHTML = `
      <div class="mb-2 sm:mb-0">
        <div class="font-semibold text-gray-800">${item.ket}</div>
        <div class="text-sm text-gray-600">
          ${item.kategori.toUpperCase()} • ${item.qty} × Rp ${item.harga.toLocaleString()} = Rp ${Math.abs(item.jumlah).toLocaleString()}<br>
          <span class="text-xs text-gray-500">📅 ${item.tanggal}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="editTransaksi(${index})" class="text-yellow-500 hover:text-yellow-600">
          <i data-lucide="edit" class="w-5 h-5"></i>
        </button>
        <button onclick="hapusTransaksi(${index})" class="text-red-500 hover:text-red-700">
          <i data-lucide="trash-2" class="w-5 h-5"></i>
        </button>
      </div>
    `;

    list.appendChild(li);
  });

  saldoDiv.textContent = `Saldo: Rp ${saldo.toLocaleString()}`;
  lucide.createIcons();
}

function hapusTransaksi(index) {
  transaksi.splice(index, 1);
  saveToLocalStorage();
  renderTransaksi();
}

function editTransaksi(index) {
  const item = transaksi[index];
  keteranganInput.value = item.ket;
  jumlahBarangInput.value = item.qty;
  hargaSatuanInput.value = item.harga;
  kategoriInput.value = item.kategori;
  tanggalInput.value = item.tanggal;
  editIndex = index;
  formBtnText.textContent = "Update Transaksi";
}

function resetForm() {
  form.reset();
  tanggalInput.value = today;
}

// === SIMPAN KE LOCALSTORAGE ===
function saveToLocalStorage() {
  localStorage.setItem('transaksiKas', JSON.stringify(transaksi));
}
