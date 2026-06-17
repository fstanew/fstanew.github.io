
const kluczAPI = '46f242e1817180dca951d08457d20d09';


document.getElementById('pogodaBtn').addEventListener('click', function() {
    const miasto = document.getElementById('cityInput').value;
    
    if (miasto !== '') {
        pobierzAktualnaPogode(miasto);
        pobierzPrognoze(miasto);
    } else {
        alert("Proszę wpisać nazwę miasta!");
    }
});


function pobierzAktualnaPogode(miasto) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${miasto}&appid=${kluczAPI}&units=metric&lang=pl`;

    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const dane = JSON.parse(xhr.responseText);
            
           
            console.log("Aktualna pogoda (XMLHttpRequest):", dane);

            const ikona = `https://openweathermap.org/img/wn/${dane.weather[0].icon}@2x.png`;

            document.getElementById('aktualnaPogoda').innerHTML = `
                <div class="karta-aktualna">
                    <h2>${dane.name}, ${dane.sys.country}</h2>
                    <img src="${ikona}" alt="Ikona pogody">
                    <h1>${dane.main.temp} °C</h1>
                    <p>Odczuwalna: ${dane.main.feels_like} °C</p>
                    <p>${dane.weather[0].description}</p>
                </div>
            `;
        }
    };
    xhr.send();
}


function pobierzPrognoze(miasto) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${miasto}&appid=${kluczAPI}&units=metric&lang=pl`;

    fetch(url)
        .then(response => response.json())
        .then(dane => {
            
           
            console.log("Prognoza (Fetch API):", dane);

            let html = '<h3>Prognoza na najbliższe dni:</h3>';
            html += '<div class="siatka-prognozy">';
            
            
            for (let i = 0; i < 8; i++) {
                const element = dane.list[i];
                const ikona = `https://openweathermap.org/img/wn/${element.weather[0].icon}.png`;

                html += `
                    <div class="karta-prognozy">
                        <strong>${element.dt_txt.substring(0, 16)}</strong><br>
                        <img src="${ikona}" alt="Ikona">
                        <h2>${element.main.temp} °C</h2>
                        <span>Odczuwalna: ${element.main.feels_like} °C</span><br>
                        <span>${element.weather[0].description}</span>
                    </div>
                `;
            }
            
            html += '</div>';
            document.getElementById('prognozaPogody').innerHTML = html;
        })
        .catch(error => console.error("Błąd pobierania prognozy:", error));
}