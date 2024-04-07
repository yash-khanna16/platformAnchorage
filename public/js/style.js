
setTimeout(function () {
    document.getElementById("popup").style.display = "block";
}, 5000);

function closePopup() {
    document.getElementById("popup").style.display = "none";
}
document.getElementById("emailForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var email = document.getElementById("emailInput").value;
    console.log("Submitted email: ", email);
    closePopup();
});