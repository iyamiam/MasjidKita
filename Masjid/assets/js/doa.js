// Fungsi untuk mendapatkan doa dari array doas
async function getDoa(index) {
    try {
        const response = await fetch("assets/json/doa1.json");

        if (!response.ok) {
            throw new Error(`Failed to fetch. Status: ${response.status}`);
        }

        const doas = await response.json();

        if (!doas.kumpulan || !doas.kumpulan.doas || !doas.kumpulan.doas.length) {
            throw new Error("Invalid JSON structure or empty array of doas");
        }

        // Pastikan indeks berada dalam rentang yang valid
        const validIndex = Math.max(0, Math.min(index, doas.kumpulan.doas.length - 1));

        return doas.kumpulan.doas[validIndex];
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

// Panggil displayDoa dengan indeks yang dipilih dari dropdown
function selectDoa() {
    const selectedIndex = document.getElementById("doaSelector").value;
    displayDoa(selectedIndex);
}

// Fungsi untuk mengisi dropdown dan menampilkan doa saat halaman dimuat
async function setupPage() {
    try {
        const response = await fetch("assets/json/doa1.json");
        if (!response.ok) {
            throw new Error(`Failed to fetch. Status: ${response.status}`);
        }

        const doasData = await response.json();

        if (!doasData.kumpulan || !doasData.kumpulan.doas || !doasData.kumpulan.doas.length) {
            throw new Error("Invalid JSON structure or empty array of doas");
        }

        const doaSelector = document.getElementById("doaSelector");

        // Isi dropdown dengan opsi doa
        doasData.kumpulan.doas.forEach((doa, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.text = doa.nama;
            doaSelector.add(option);
        });

        // Dapatkan indeks terakhir dari session storage, default ke 0 jika tidak ada
        const lastDoaIndex = parseInt(sessionStorage.getItem("lastDoaIndex")) || 0;

        // Pilih doa sesuai dengan indeks terakhir
        doaSelector.value = lastDoaIndex;

        // Tampilkan doa sesuai dengan indeks terakhir
        displayDoa(lastDoaIndex);
    } catch (error) {
        console.error("Error setting up the page:", error);
    }
}

// Panggil setupPage saat halaman dimuat
window.onload = function () {
    setupPage();
    
    // Test notification after 5 seconds (define testNotification function if needed)
    setTimeout(function() {
        console.log("Test Notification");
    }, 5000);
};

// Fungsi untuk menampilkan doa pada elemen card
async function displayDoa(index) {
    try {
        const selectedDoa = await getDoa(index);

        const cardTitle = document.getElementById("doa-title");
        const cardText = document.getElementById("doa-text");
        const cardTransliteration = document.getElementById("doa-transliteration");
        const cardTranslation = document.getElementById("doa-translation");
        const cardHistory = document.getElementById("doa-history");

        // Ganti konten elemen card dengan informasi doa yang dipilih
        cardTitle.innerText = selectedDoa.nama;
        cardText.innerText = selectedDoa.lafal;
        cardTransliteration.innerText = selectedDoa.transliterasi;
        cardTranslation.innerText = selectedDoa.arti;
        cardHistory.innerText = "Riwayat: " + selectedDoa.riwayat;

        // Simpan indeks terakhir ke session storage
        sessionStorage.setItem("lastDoaIndex", index);
    } catch (error) {
        console.error("Error displaying doa:", error);
    }
}
