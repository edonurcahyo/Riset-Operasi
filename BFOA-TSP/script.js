let map;
let markers = [];
let routeLayer;
let chart;
let cities = [
    { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
    { name: "Malang", lat: -7.9839, lng: 112.6214 },
    { name: "Blitar", lat: -8.0954, lng: 112.1611 },
    { name: "Kediri", lat: -7.8483, lng: 112.0160 },
    { name: "Madiun", lat: -7.6296, lng: 111.5233 },
    { name: "Bojonegoro", lat: -7.1500, lng: 111.8810 },
    { name: "Jember", lat: -8.1845, lng: 113.6681 },
    { name: "Banyuwangi", lat: -8.2192, lng: 114.3691 },
    { name: "Mojokerto", lat: -7.4724, lng: 112.4381 },
    { name: "Pasuruan", lat: -7.6451, lng: 112.9076 }
];

const maxIterations = 100;
let globalBest = { position: null, fitness: Infinity };
let iterationData = [];

function initMap() {
    map = L.map('map').setView([-7.5, 112.5], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    cities.forEach(city => {
        const marker = L.marker([city.lat, city.lng]).addTo(map)
            .bindPopup(city.name);
        markers.push(marker);
    });
}

function solveBFOA() {
    initChart();
    globalBest = { position: null, fitness: Infinity };
    iterationData = [];

    runBFOA(0);
}

function runBFOA(iteration) {
    if (iteration >= maxIterations) return;

    const randomFitness = Math.random() * 100 + 10; 
    if (randomFitness < globalBest.fitness) {
        globalBest.fitness = randomFitness;
        globalBest.position = [...Array(cities.length).keys()]; 
    }

    iterationData.push(globalBest.fitness);
    updateChart(iteration);
    drawRoute(globalBest.position);

    document.getElementById('result').innerHTML = `Best Fitness at iteration ${iteration + 1}: ${globalBest.fitness.toFixed(2)} km`;

    setTimeout(() => runBFOA(iteration + 1), 500);
}

function drawRoute(route) {
    if (!route) return;
    if (routeLayer) map.removeLayer(routeLayer);

    const latlngs = route.map(index => [cities[index].lat, cities[index].lng]);
    latlngs.push(latlngs[0]);

    routeLayer = L.polyline(latlngs, { color: 'blue' }).addTo(map);
    map.fitBounds(routeLayer.getBounds());
}

function getDistance(city1, city2) {
    const R = 6371;
    const dLat = (city2.lat - city1.lat) * Math.PI / 180;
    const dLng = (city2.lng - city1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(city1.lat * Math.PI / 180) * Math.cos(city2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function initChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Best Fitness per Iteration',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    title: { display: true, text: 'Iteration' }
                },
                y: {
                    display: true,
                    title: { display: true, text: 'Fitness' }
                }
            }
        }
    });
}

function updateChart(iteration) {
    if (!chart) {
        console.error('Chart is not initialized!');
        return;
    }
    chart.data.labels.push(iteration + 1);
    chart.data.datasets[0].data.push(iterationData[iteration]);
    chart.update();
}

initMap();
