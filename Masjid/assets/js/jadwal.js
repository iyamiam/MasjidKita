// Fungsi untuk menampilkan waktu secara real-time
    function showRealTime() {
      const timeElement = document.getElementById("real-time");
      setInterval(() => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const currentTime = `${hours}:${minutes}:${seconds}`;
        timeElement.textContent = currentTime;
      }, 1000); // Update setiap detik
    }

    // Fungsi untuk mendapatkan lokasi pengguna
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }

    // Fungsi untuk menampilkan hasil lokasi dan memanggil fungsi untuk mengambil jadwal sholat
    function showPosition(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Menambahkan tampilan letak daerah
      getAreaLocation(latitude, longitude);

      // Mengambil jadwal sholat
      getPrayerTimings(latitude, longitude);

      // Menampilkan waktu secara real-time
      showRealTime();
    }

    // Fungsi untuk mendapatkan letak daerah berdasarkan longitude dan latitude
    function getAreaLocation(latitude, longitude) {
      var nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(nominatimApiUrl)
        .then((response) => response.json())
        .then((data) => {
          var city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown";
          var county = data.address.county || "Unknown";
          if (county == "Unknown") {
            county = data.address.village || "Unknown";
          }
          var state = data.address.state || "Unknown";
          var country = data.address.country || "Unknown";

          document.getElementById(
            "location"
          ).innerHTML = `<strong>${city}</strong><br>${county}, ${state}<br>${country}<br><em>Lat: ${latitude}, Long: ${longitude}</em>`;
        })
        .catch((error) => {
          console.error("Error fetching Nominatim data:", error);
          document.getElementById("error").innerHTML =
            "Error fetching location information.";
        });
    }

    let formattedDate; // Tambahkan variabel di tingkat lebih tinggi

    // Fungsi untuk mengambil jadwal sholat dari API
    function getPrayerTimings(latitude, longitude) {
      const today = new Date();
      formattedDate =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      console.log(formattedDate);
      const apiUrl = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=20&tune=3,3,8,3,2,3,2,2,-3`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Handle data response
          const timings = data.data.timings;
          console.log(timings);
          const tanggalHijriah = data.data.date.hijri.day;
          const nomorBulan = data.data.date.hijri.month.number;
          var namaBulan = [
            "Muharram",
            "Safar",
            "Rabi'ul Awwal",
            "Rabi'ul Akhir",
            "Jumadil Awwal",
            "Jumadil Akhir",
            "Rajab",
            "Sha'ban",
            "Ramadhan",
            "Syawwal",
            "Dhu al-Qi'dah",
            "Dhu al-Hijjah",
          ];
          const bulanHijriah = namaBulan[nomorBulan - 1];
          const tahunHijriah = data.data.date.hijri.year;
          const hijriDate = `${tanggalHijriah} ${bulanHijriah} ${tahunHijriah} H`; // Ambil nilai tanggal dari objek Hijriah

          const tanggalMasehi = data.data.date.gregorian.day;
          const nomorBulanMasehi = data.data.date.gregorian.month.number;
          var namaBulanMasehi = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
          ];
          const bulanMasehi = namaBulanMasehi[nomorBulanMasehi - 1];
          const tahunMasehi = data.data.date.gregorian.year;
          const masehiDate = `${tanggalMasehi} ${bulanMasehi} ${tahunMasehi} M`; // Ambil nilai tanggal dari objek Masehi
          const date = `${masehiDate} / ${hijriDate}`; // Gabungkan tanggal Masehi dan Hijriah
          displayPrayerTimings(timings, date);

          // Menampilkan hitung mundur waktu sholat yang akan datang
          displayCountdown(timings);
        })
        .catch((error) => {
          // Handle error
          console.error("Error fetching prayer timings:", error);
        });
    }

    // Fungsi untuk menampilkan letak daerah di halaman
    function displayAreaLocation(address) {
      const areaLocationElement = document.getElementById("area-location");
      areaLocationElement.innerHTML = `<p><strong>Letak Daerah:</strong> ${address}</p>`;
    }

    // Fungsi untuk menampilkan jadwal sholat dan bulan Hijriah
    function displayPrayerTimings(timings, hijriDate) {
      const prayerTimingsElement = document.getElementById("prayer-timings");
      let html = "<h2>Jadwal Sholat</h2>";

      // Menampilkan informasi bulan Hijriah
      html += `<p><strong>Tanggal Hijriah:</strong> ${hijriDate}</p>`;

      // Menampilkan waktu sholat dalam bahasa Indonesia
      html += "<p><strong>Waktu Sholat:</strong></p>";
      html += "<ul>";
      html += `<li><strong>Subuh:</strong> ${timings.Fajr}</li>`;
      html += `<li><strong>Terbit Matahari:</strong> ${timings.Sunrise}</li>`;
      html += `<li><strong>Dzuhur:</strong> ${timings.Dhuhr}</li>`;
      html += `<li><strong>Ashar:</strong> ${timings.Asr}</li>`;
      html += `<li><strong>Terbenam Matahari:</strong> ${timings.Sunset}</li>`;
      html += `<li><strong>Maghrib:</strong> ${timings.Maghrib}</li>`;
      html += `<li><strong>Isya:</strong> ${timings.Isha}</li>`;
      html += `<li><strong>Imsak:</strong> ${timings.Imsak}</li>`;
      html += "</ul>";

      // Menampilkan hasil di elemen HTML
      prayerTimingsElement.innerHTML = html;
    }

    // Fungsi untuk menampilkan hitung mundur waktu sholat yang akan datang
    function displayCountdown(timings) {
      const countdownElement = document.getElementById("countdown");
      const today = new Date();
      formattedDate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      // Menyiapkan array waktu sholat dan tanggal untuk perbandingan
      let prayerTimesArray = Object.entries(timings).map(([prayer, time]) => {
        const prayerTime = new Date(`${formattedDate} ${time}`);
        return { prayer, time: prayerTime };
      });

      // Mengurutkan waktu sholat berdasarkan waktu
      prayerTimesArray.sort((a, b) => a.time - b.time);

      // Filter hanya lima waktu sholat wajib
      const fiveDailyPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      prayerTimesArray = prayerTimesArray.filter((prayer) =>
        fiveDailyPrayers.includes(prayer.prayer)
      );

      // Cari waktu sholat yang akan datang
      let upcomingPrayer;
      for (let i = 0; i < prayerTimesArray.length; i++) {
        if (prayerTimesArray[i].time > new Date()) {
          upcomingPrayer = prayerTimesArray[i];
          break;
        }
      }
      if (upcomingPrayer) {
        // Hitung mundur dan tampilkan
        setInterval(() => {
          const currentTime = new Date();
          const timeDiffInSeconds = Math.floor(
            (upcomingPrayer.time - currentTime) / 1000
          );
          const hours = Math.floor(timeDiffInSeconds / 3600);
          const minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
          const seconds = timeDiffInSeconds % 60;

          countdownElement.innerHTML = `<p><strong>Hitung Mundur ${upcomingPrayer.prayer}:</strong> ${hours}h ${minutes}m ${seconds}s`;

          // Jadwalkan notifikasi
          scheduleNotification(upcomingPrayer.prayer, timeDiffInSeconds);

          if (timeDiffInSeconds <= 0) {
            window.location.reload();
          }
        }, 1000);
      } else {
        countdownElement.innerHTML =
          "<p><strong>Tidak Ada Jadwal Sholat Wajib Berikutnya</strong></p>";
      }
    }

    // Fungsi untuk menjadwalkan notifikasi
    function scheduleNotification(prayerName, timeDiffInSeconds) {
      // Menit sebelum waktu sholat
      const minutesBefore = 10 * 60; // 10 menit
      const notificationTime = timeDiffInSeconds - minutesBefore;

      if (notificationTime == 0) {
        console.log("waktu sholat akan tiba dalam 10 menit!");
        showNotification(
          `Waktu Sholat ${prayerName} akan tiba dalam 10 menit!`
        );
      }
      if (timeDiffInSeconds == 0) {
        console.log("waktu sholat telah tiba!");
        showNotification(`Waktu Sholat ${prayerName} telah tiba!`);
      }
    }

    
    // Fungsi untuk menampilkan notifikasi
    function showNotification(message) {
    console.log("Showing notification...");
    // Periksa apakah browser mendukung notifikasi
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications.");
        return;
    }

    // Fungsi untuk memainkan suara notifikasi sekali setelah user berinteraksi
    function playNotificationSoundOnce() {
    console.log("Playing notification sound...");
    const audio = new Audio('adzan.mp3');
    audio.play();
    console.log("Notification sound played.");
    document.removeEventListener("click", playNotificationSoundOnce);
  }

    // Periksa apakah notifikasi diizinkan
    if (Notification.permission === "granted") {
    // Munculkan notifikasi
    const notification = new Notification("Jadwal Sholat", { body: message });

    // Tambahkan suara notifikasi setelah user berinteraksi
    playNotificationSoundOnce();
  } else {
    // Jika belum diizinkan, minta izin notifikasi
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // Munculkan notifikasi
        const notification = new Notification("Jadwal Sholat", { body: message });

        // Tambahkan suara notifikasi setelah user berinteraksi
        playNotificationSoundOnce();
      }
    });
  }
}


    // Fungsi untuk melakukan test notifikasi
    function testNotification() {
      showNotification(
        "Ini adalah contoh notifikasi di luar jadwal waktu sholat."
        
      );
      // Dapatkan elemen audio
    }

    // Otomatis panggil fungsi getLocation saat halaman dimuat
    window.onload = function () {
      getLocation();
      // load surat
      loadSurahOptions();
      // load doa
      displayRandomDoa();
      // Panggil fungsi testNotification setelah 5 detik untuk melakukan test notifikasi
      setTimeout(testNotification, 5000);
    };