// Inicjalizacja mapy
var map = L.map('map-container').setView([52.2297, 21.0122], 13);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    crossOrigin: 'anonymous'
}).addTo(map);

//// powiadomienia systemowe
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Geolokalizacja
document.getElementById('btn-geo').onclick = function() {
    navigator.geolocation.getCurrentPosition(function(pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        map.setView([lat, lon], 16);
        L.marker([lat, lon]).addTo(map).bindPopup("Twoja lokalizacja").openPopup();
    }, function() {
        alert("Błąd geolokalizacji. Sprawdź uprawnienia w przeglądarce.");
    });
};

// "Pobieranie" mapy i tworzenie gry
document.getElementById('btn-save').onclick = function() {
    var canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    var ctx = canvas.getContext('2d');

    // wszystkie kafelki mapy
    var tiles = document.querySelectorAll('.leaflet-tile');
    var mapRect = document.getElementById('map-container').getBoundingClientRect();

    // Rysuje mapę
    tiles.forEach(function(tile) {
        var tileRect = tile.getBoundingClientRect();
        var x = tileRect.left - mapRect.left;
        var y = tileRect.top - mapRect.top;
        
        //tylko jeśli obrazek jest poprawnie wczytany
        if (tile.complete && tile.naturalWidth !== 0) {
            ctx.drawImage(tile, x, y, tileRect.width, tileRect.height);
        }
    });

    prepareGame(canvas);
};

// Tworzenie puzzli
function prepareGame(fullCanvas) {
    var table = document.getElementById('puzzle-table');
    var board = document.getElementById('puzzle-board');
    
    table.innerHTML = ''; 
    board.innerHTML = '';

    var pieces = [];

    for (var i = 0; i < 16; i++) {
        //Tworzym puste miejsca na planszy 
        var boardSlot = document.createElement('div');
        boardSlot.className = 'slot';
        boardSlot.dataset.correctIndex = i; 
        boardSlot.ondragover = function(e) { e.preventDefault(); };
        boardSlot.ondrop = handleDrop;
        board.appendChild(boardSlot);

        //Wycinamy z dużego canvasa
        var pCanvas = document.createElement('canvas');
        pCanvas.width = 100;
        pCanvas.height = 100;
        var px = (i % 4) * 100;
        var py = Math.floor(i / 4) * 100;
        pCanvas.getContext('2d').drawImage(fullCanvas, px, py, 100, 100, 0, 0, 100, 100);

        ////Tworzymy element 
        var img = document.createElement('img');
        img.src = pCanvas.toDataURL();
        img.className = 'piece';
        img.id = 'puzel-' + i;
        img.dataset.id = i;
        img.draggable = true;
        
        img.ondragstart = function(e) {
            e.dataTransfer.setData('text', e.target.id);
        };

        pieces.push(img);
    }

    //Mieszam puzle
    pieces.sort(function() { return 0.5 - Math.random(); });

    //Rozkładamy puzle 
    pieces.forEach(function(p) {
        var tableSlot = document.createElement('div');
        tableSlot.className = 'slot';
        tableSlot.ondragover = function(e) { e.preventDefault(); };
        tableSlot.ondrop = handleDrop;
        tableSlot.appendChild(p);
        table.appendChild(tableSlot);
    });
}

//drag&drop implementacja
function handleDrop(e) {
    e.preventDefault();
    var pieceId = e.dataTransfer.getData('text');
    var piece = document.getElementById(pieceId);

    var target = e.target;
    if (!target.classList.contains('slot')) {
        target = target.parentElement; 
    }

    // Jeśli slot jest pusty, wstawiamy puzel
    if (target.classList.contains('slot') && target.children.length === 0) {
        target.appendChild(piece);
    }

    checkWin();
}

//Sprawdzanie wygranej
function checkWin() {
    var boardSlots = document.querySelectorAll('#puzzle-board .slot');
    var points = 0;

    boardSlots.forEach(function(slot) {
        var piece = slot.firstChild;
        if (piece && piece.dataset.id == slot.dataset.correctIndex) {
            points++;
        }
    });

    // logowanie do konsoli
    console.debug("Postęp: " + points + "/16");

    if (points === 16) {
        if (Notification.permission === "granted") {
            new Notification("Brawo!", { body: "Mapa ułożona poprawnie!" });
        } else {
            alert("WYGRANA! Mapa ułożona poprawnie!");
        }
    }
}