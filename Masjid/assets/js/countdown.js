// Fungsi untuk mendapatkan lokasi pengguna
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

getLocation()

// Fungsi untuk menampilkan hasil lokasi dan memanggil fungsi untuk mengambil jadwal sholat
function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Menambahkan tampilan letak daerah
  getAreaLocation(latitude, longitude);

  // Mengambil jadwal sholat
  getPrayerTimings(latitude, longitude);
}

// Fungsi untuk mendapatkan letak daerah berdasarkan longitude dan latitude
function getAreaLocation(latitude, longitude) {
  //opens streepmap
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

    // Call displayAreaLocation to update the HTML element
    displayAreaLocation(`${city}, ${county}, ${state}, ${country}`);
  })
  .catch((error) => {
    console.error("Error fetching area location:", error);
  });
}

let formattedDate; // Tambahkan variabel di tingkat lebih tinggi

function displayPrayerTimings(timings, hijriDate) {
  const prayerTimingsElement = document.getElementById("prayer-timings");
  let html = "";


  // Menampilkan hasil di elemen HTML
  prayerTimingsElement.innerHTML = html;

  const prayerTimes = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha }
  ];
  
  // Get the container where cards will be appended
  const cardsContainer = document.getElementById('prayer-cards-container');
  
  // Loop through prayer times and create cards
  prayerTimes.forEach(prayer => {
    const card = document.createElement('div');
    card.classList.add('prayer-card');
  
    card.innerHTML = `
      <h3>${prayer.name}</h3>
      <p>${prayer.time}</p>
    `;
  
    cardsContainer.appendChild(card);
  });
}


// Fungsi untuk mengambil jadwal sholat dari API
function getPrayerTimings(latitude, longitude) {
  const today = new Date();
  formattedDate =
    today.getDate() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getFullYear();
  const apiUrl = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=20&tune=3,3,8,3,2,3,2,2,-3`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Handle data response
      const timings = data.data.timings;
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

function displayAreaLocation(address) {
  const areaLocationElement = document.getElementById("area-location");
  areaLocationElement.innerHTML = `<p> ${address}</p>`;
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
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const timeDiffInSeconds = Math.floor(
        (upcomingPrayer.time - currentTime) / 1000
      );

      if (timeDiffInSeconds > 0) {
        const hours = Math.floor(timeDiffInSeconds / 3600);
        const minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
        const seconds = timeDiffInSeconds % 60;
        // Call scheduleNotification when time difference is 10 minutes
        if (timeDiffInSeconds === 600) {
          scheduleNotification(upcomingPrayer.prayer, timeDiffInSeconds);
        }
        countdownElement.innerHTML = `<p><strong>Hitung Mundur ${upcomingPrayer.prayer}:</strong> ${hours}h ${minutes}m ${seconds}s`;
      } else {
        clearInterval(intervalId); // Stop the interval
        countdownElement.innerHTML =
          "<p><strong>Waktu Sholat Telah Tiba</strong></p>";

        // Play adzan sound when the prayer time is up
        playNotificationSoundOnce();
      }
    }, 1000);
  } else {
    countdownElement.innerHTML =
      "<p><strong>Tidak Ada Jadwal Sholat Wajib Berikutnya</strong></p>";
  }
}


// Fungsi untuk memainkan suara notifikasi sekali setelah user berinteraksi
function playNotificationSoundOnce() {
  console.log("Playing notification sound...");
  const audio = new Audio('adzan.mp3');

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(_ => {
      console.log("Notification sound played.");
    }).catch(error => {
      console.error("Error playing audio:", error);
    });
  }
}

function scheduleNotification(prayerName, timeDiffInSeconds) {
  const minutesBefore = 10 * 60; // 10 minutes
  const notificationTime = timeDiffInSeconds - minutesBefore;

  try {
    if (notificationTime === 0) {
      console.log(`Waktu Sholat ${prayerName} akan tiba dalam 10 menit!`);
      showNotification(`Waktu Sholat ${prayerName} akan tiba dalam 10 menit!`);
    } else if (notificationTime === 0 && timeDiffInSeconds === 600) {
      console.log(`Waktu Sholat ${prayerName} akan tiba dalam 10 menit!`);
      showNotification(`Waktu Sholat ${prayerName} akan tiba dalam 10 menit!`);
    } else if (timeDiffInSeconds === 0) {
      console.log(`Waktu Sholat ${prayerName} telah tiba!`);
      showNotification(`Waktu Sholat ${prayerName} telah tiba!`);
      playNotificationSoundOnce();
    }
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
}

function showNotification(message) {
  console.log("Showing notification...");

  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    try {
      const notification = new Notification("Jadwal Sholat", { body: message });
      playNotificationSoundOnce();
    } catch (error) {
      console.error("Error displaying notification:", error);
    }
  } else {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        try {
          const notification = new Notification("Jadwal Sholat", { body: message });
          playNotificationSoundOnce();
        } catch (error) {
          console.error("Error displaying notification:", error);
        }
      }
    });
  }
  function playNotificationSoundOnce() {
    // Implementasi pemutaran suara notifikasi
    // Pastikan bahwa fungsi ini berfungsi dengan benar
    console.log("Playing notification sound...");
  }
}


// // Menunggu tindakan pengguna (misalnya, klik di mana saja di halaman)
// document.addEventListener('click', function () {
//     playNotificationSoundOnce();
// });

// // Fungsi untuk melakukan test notifikasi
// function testNotification() {
//   showNotification(
//     "Ini adalah contoh notifikasi di luar jadwal waktu sholat."
//   );
//   playNotificationSoundOnce();
// }

// // Panggil fungsi testNotification
// testNotification();
