let currentPlayer = 1;

function openModal(player) {
    currentPlayer = player;
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function updateLP() {
    const lpInput = document.getElementById("lpInput").value;
    const lpDisplay = document.getElementById(`lp${currentPlayer}`);

    if (lpInput) {
        let currentLP = parseInt(lpDisplay.innerText);
        currentLP -= parseInt(lpInput);
        lpDisplay.innerText = currentLP > 0 ? currentLP : 0; // Verhindert negative LP
    }

    closeModal();
}
