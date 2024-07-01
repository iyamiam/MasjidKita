function loadAyahs() {
    const surahSelect = document.getElementById("surahSelect");
    const pageSelect = document.getElementById("pageSelect");
    const ayahContainer = document.getElementById("ayahContainer");

    const surahNumber = surahSelect.value;
    const page = pageSelect.value;

    // Hitung indeks awal dan akhir untuk mengambil ayat-ayat
    const startIndex = (page - 1) * 10 + 1;

    // Ambil data dari API sesuai dengan nomor surat dan indeks ayat
    const apiUrl = `https://web-api.qurankemenag.net/quran-ayah?start=${startIndex - 1
      }&limit=10&surah=${surahNumber}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Bersihkan kontainer sebelum menambahkan ayat-ayat baru
        ayahContainer.innerHTML = "";

        // Tampilkan setiap ayat
        data.data.forEach((ayah) => {
          const ayahElement = document.createElement("div");
          ayahElement.classList.add("ayah-container");

          ayahElement.innerHTML = `
            <div class="arabic">${ayah.arabic}</div>
              <p class="translation"> ${ayah.latin}</p>
            
            <p class="translation">${ayah.translation}</p>
            ${ayah.footnotes
              ? `<p class="footnotes"><em>${ayah.footnotes}</em></p>`
              : ""
            }
          `;
      // Tambahkan elemen audio
      const audioElement = document.createElement("audio");
      audioElement.controls = true;
      audioElement.src = `https://media.qurankemenag.net/audio/Abu_Bakr_Ash-Shaatree_aac64/${surahNumber
        .toString()
        .padStart(3, "0")}${(ayah.ayah)
        .toString()
        .padStart(3, "0")}.m4a`;
      ayahElement.appendChild(audioElement);

      ayahContainer.appendChild(ayahElement);

      // Tampilkan nama surat
      const namaElement = document.createElement("div");
      namaElement.innerHTML = `<p class="translation"><strong>Surah ${ayah.surah.latin} - ${ayah.surah.translation}</strong></p>`;
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
}
  function loadPageOptions() {
    const surahSelect = document.getElementById("surahSelect");
    const pageSelect = document.getElementById("pageSelect");

    const surahNumber = surahSelect.value;

    // Ambil data dari API sesuai dengan nomor surat untuk mendapatkan jumlah ayat
    const apiUrl = `https://web-api.qurankemenag.net/quran-ayah?start=0&limit=1&surah=${surahNumber}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const totalAyahs = data.data[0].surah.num_ayah;

        // Hitung jumlah halaman berdasarkan jumlah ayat
        const totalPages = Math.ceil(totalAyahs / 20);

        // Bersihkan opsi sebelum menambahkan yang baru
        pageSelect.innerHTML = "";

        // Tambahkan opsi halaman
        for (let i = 1; i <= totalPages; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = `Page ${i}`;
          pageSelect.appendChild(option);
        }

        // Muat ayat setelah memuat opsi halaman
        loadAyahs();
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Muat opsi surat saat halaman pertama kali dimuat
  function loadSurahOptions() {
    const surahSelect = document.getElementById("surahSelect");

    // Tambahkan opsi surat dari 1 hingga 114
    for (let i = 1; i <= 114; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `Surat ${i}`;
      surahSelect.appendChild(option);
    }

    // Muat opsi halaman setelah memuat opsi surat
    loadPageOptions();
  }

  // Otomatis panggil fungsi getLocation saat halaman dimuat
  window.onload = function () {
    // load surat
    loadSurahOptions();
  };