document.addEventListener("DOMContentLoaded", function() {
    const gameList = document.getElementById("gameList");
    const searchInput = document.getElementById("searchInput");
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popupContent");
    const closeBtn = document.getElementById("closeBtn");
    const gameTitle = document.getElementById("gameTitle");
    const accountsList = document.getElementById("accountsList");
    const apiKey = "ZQFRG7-TRRYWZ-W4R5K-FQS1B-C0H8EL-SJM"; // Kabul edilecek tek şifre

    // Oyun bilgilerini içeren bir dizi oluştur
    const games = [];

    // Tüm oyunları yükle ve listele
    fetchAllGames();

    // Tüm oyunları yükleme ve listeleme işlevi
    function fetchAllGames() {
        fetch("accs.txt")
            .then(response => response.text())
            .then(data => {
                parseGameData(data);
                displayGames();
            })
            .catch(error => {
                console.error("Error fetching games:", error);
            });
    }

    // Oyunları parse etme işlevi
    function parseGameData(data) {
        const lines = data.split("\n");
        let gameObj = {};
        lines.forEach(line => {
            const match = line.match(/([^:]+) steam AccountID:([^ ]+) AccountPASSWORD:(.+)/);
            if (match) {
                const gameName = match[1].trim().replace(/ /g, "-"); // Boşlukları - ile değiştir
                const accountID = match[2].trim();
                const password = match[3].trim();
                if (!games.find(game => game.name === gameName)) { // Oyun daha önce eklenmediyse
                    gameObj = { name: gameName, accounts: [] };
                    games.push(gameObj);
                }
                gameObj.accounts.push({ accountID, password });
            }
        });
    }

    // Oyunları listeleme işlevi
    function displayGames() {
        games.forEach(gameObj => {
            const gameDiv = document.createElement("div");
            gameDiv.classList.add("game");

            const gameImg = document.createElement("img");
            gameImg.alt = gameObj.name;

            fetchGameImage(gameObj.name, gameImg);

            gameDiv.appendChild(gameImg);
            gameList.appendChild(gameDiv);

            // Oyun afişine tıklandığında hesap bilgilerini görüntüleme işlevselliği ekle
            gameDiv.addEventListener("click", function() {
                const correctPassword = prompt("Oyun bilgilerini görüntülemek için lütfen şifrenizi girin:");
                if (correctPassword === apiKey) { // Kabul edilen tek şifreyi kontrol et
                    gameTitle.textContent = gameObj.name;
                    accountsList.innerHTML = ""; // Önceki hesapları temizle
                    gameObj.accounts.forEach(account => {
                        const listItem = document.createElement("li");
                        listItem.textContent = `Hesap ID: ${account.accountID}, Şifre: ${account.password}`;
                        accountsList.appendChild(listItem);
                    });
                    popup.style.display = "block";
                } else {
                    alert("Hatalı şifre! Lütfen doğru şifreyi girin.");
                }
            });
        });
    }

    // Oyun afişini API'den çekme işlevi
    function fetchGameImage(gameName, gameImg) {
        fetch(`https://api.rawg.io/api/games/${gameName}?key=4e7295aa08e647bf9fafd48ab90f5c4f`)
            .then(response => response.json())
            .then(data => {
                const backgroundImage = data.background_image;
                if (backgroundImage) {
                    gameImg.src = backgroundImage;
                } else {
                    gameImg.src = "placeholder.jpg"; // Hata durumunda yerel bir yedek görsel kullanılabilir
                }
            })
            .catch(error => {
                console.error("Error fetching game image:", error);
                gameImg.src = "placeholder.jpg"; // Hata durumunda yerel bir yedek görsel kullanılabilir
            });
    }

    // Popup kapatma işlevselliği
    closeBtn.addEventListener("click", function() {
        popup.style.display = "none";
    });

    // Oyun arama işlevselliği
    searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchTerm));
        gameList.innerHTML = ""; // Önceki oyunları temizle
        displayFilteredGames(filteredGames);
    });

    // Filtrelenmiş oyunları listeleme işlevi
    function displayFilteredGames(filteredGames) {
        filteredGames.forEach(gameObj => {
            const gameDiv = document.createElement("div");
            gameDiv.classList.add("game");

            const gameImg = document.createElement("img");
            gameImg.alt = gameObj.name;

            fetchGameImage(gameObj.name, gameImg);

            gameDiv.appendChild(gameImg);
            gameList.appendChild(gameDiv);

            // Oyun afişine tıklandığında hesap bilgilerini görüntüleme işlevselliği ekle
            gameDiv.addEventListener("click", function() {
                const correctPassword = prompt("Oyun bilgilerini görüntülemek için lütfen şifrenizi girin:");
                if (correctPassword === apiKey) { // Kabul edilen tek şifreyi kontrol et
                    gameTitle.textContent = gameObj.name;
                    accountsList.innerHTML = ""; // Önceki hesapları temizle
                    gameObj.accounts.forEach(account => {
                        const listItem = document.createElement("li");
                        listItem.textContent = `Hesap ID: ${account.accountID}, Şifre: ${account.password}`;
                        accountsList.appendChild(listItem);
                    });
                    popup.style.display = "block";
                } else {
                    alert("Hatalı şifre! Lütfen doğru şifreyi girin.");
                }
            });
        });
    }
});
