const holeDistances = [3, 5, 7];
const totalHoles = 18;
let currentHole = 1;
let scores = {
    player1: Array(totalHoles).fill(0),
    player2: Array(totalHoles).fill(0)
};
let points = {
    player1: Array(totalHoles).fill(0),
    player2: Array(totalHoles).fill(0)
};
let runningTotalPoints = {
    player1: 0,
    player2: 0
};
let playerNames = {
    player1: 'Riley',
    player2: 'Brendo'
};

// Function to load saved data from localStorage
function loadData() {
    if (localStorage.getItem('player1Name')) {
        playerNames.player1 = localStorage.getItem('player1Name');
        playerNames.player2 = localStorage.getItem('player2Name');
        scores.player1 = JSON.parse(localStorage.getItem('scoresPlayer1')) || Array(totalHoles).fill(0);
        scores.player2 = JSON.parse(localStorage.getItem('scoresPlayer2')) || Array(totalHoles).fill(0);
        points.player1 = JSON.parse(localStorage.getItem('pointsPlayer1')) || Array(totalHoles).fill(0);
        points.player2 = JSON.parse(localStorage.getItem('pointsPlayer2')) || Array(totalHoles).fill(0);
        runningTotalPoints.player1 = JSON.parse(localStorage.getItem('runningTotalPointsPlayer1')) || 0;
        runningTotalPoints.player2 = JSON.parse(localStorage.getItem('runningTotalPointsPlayer2')) || 0;
        currentHole = JSON.parse(localStorage.getItem('currentHole')) || 1;
    }
}

// Function to save data to localStorage
function saveData() {
    localStorage.setItem('player1Name', playerNames.player1);
    localStorage.setItem('player2Name', playerNames.player2);
    localStorage.setItem('scoresPlayer1', JSON.stringify(scores.player1));
    localStorage.setItem('scoresPlayer2', JSON.stringify(scores.player2));
    localStorage.setItem('pointsPlayer1', JSON.stringify(points.player1));
    localStorage.setItem('pointsPlayer2', JSON.stringify(points.player2));
    localStorage.setItem('runningTotalPointsPlayer1', JSON.stringify(runningTotalPoints.player1));
    localStorage.setItem('runningTotalPointsPlayer2', JSON.stringify(runningTotalPoints.player2));
    localStorage.setItem('currentHole', JSON.stringify(currentHole));
}

document.addEventListener('DOMContentLoaded', function () {
    loadData();
    updateNames();
    updateHoleInfo();
    generateScorecard();
});

function updateNames() {
    document.getElementById('running-total-riley').querySelector('span').textContent = playerNames.player1;
    document.getElementById('running-total-brendo').querySelector('span').textContent = playerNames.player2;
}

function updateHoleInfo() {
    document.getElementById('current-hole').textContent = currentHole;
    document.getElementById('hole-distance').textContent = holeDistances[(currentHole - 1) % holeDistances.length];
    document.getElementById('player1-score').value = scores.player1[currentHole - 1];
    document.getElementById('player2-score').value = scores.player2[currentHole - 1];
}

function nextHole() {
    scores.player1[currentHole - 1] = parseInt(document.getElementById('player1-score').value, 10) || 0;
    scores.player2[currentHole - 1] = parseInt(document.getElementById('player2-score').value, 10) || 0;

    points.player1[currentHole - 1] = calculatePoints(scores.player1[currentHole - 1]);
    points.player2[currentHole - 1] = calculatePoints(scores.player2[currentHole - 1]);

    updateRunningTotalPoints();

    if (currentHole < totalHoles) {
        currentHole++;
        updateHoleInfo();
    } else {
        calculateScores();
    }

    updateScorecard();
    saveData(); // Save data after updating the scorecard
}

function calculatePoints(score) {
    if (score === 1) {
        return 2;
    } else if (score === 2) {
        return 1;
    } else {
        return 0;
    }
}

function updateRunningTotalPoints() {
    runningTotalPoints.player1 = points.player1.reduce((a, b) => a + b, 0);
    runningTotalPoints.player2 = points.player2.reduce((a, b) => a + b, 0);

    document.getElementById('running-total-points-player1').textContent = runningTotalPoints.player1;
    document.getElementById('running-total-points-player2').textContent = runningTotalPoints.player2;
}

function calculateScores() {
    const totalScorePlayer1 = scores.player1.reduce((a, b) => a + b, 0);
    const totalScorePlayer2 = scores.player2.reduce((a, b) => a + b, 0);

    document.getElementById('total-score-player1').textContent = totalScorePlayer1;
    document.getElementById('total-score-player2').textContent = totalScorePlayer2;
}

function resetScores() {
    currentHole = 1;
    scores = {
        player1: Array(totalHoles).fill(0),
        player2: Array(totalHoles).fill(0)
    };
    points = {
        player1: Array(totalHoles).fill(0),
        player2: Array(totalHoles).fill(0)
    };
    runningTotalPoints = {
        player1: 0,
        player2: 0
    };
    updateHoleInfo();
    updateRunningTotalPoints();
    updateScorecard();
    saveData(); // Save data after resetting scores
}

function generateScorecard() {
    const scorecardBody = document.getElementById('scorecard-body');
    scorecardBody.innerHTML = '';

    for (let i = 1; i <= totalHoles; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${holeDistances[(i - 1) % holeDistances.length]}</td>
            <td id="player1-hole${i}">0</td>
            <td id="player2-hole${i}">0</td>
            <td id="player1-points${i}">0</td>
            <td id="player2-points${i}">0</td>
        `;
        scorecardBody.appendChild(row);
    }
}

function updateScorecard() {
    for (let i = 1; i <= totalHoles; i++) {
        document.getElementById(`player1-hole${i}`).textContent = scores.player1[i - 1];
        document.getElementById(`player2-hole${i}`).textContent = scores.player2[i - 1];
        document.getElementById(`player1-points${i}`).textContent = points.player1[i - 1];
        document.getElementById(`player2-points${i}`).textContent = points.player2[i - 1];
    }
}
