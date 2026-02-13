const WHATSAPP_NUMBER = "919637972812";

const seatDoc = window.fb.doc(window.db, "event", "seats");

/* ========= SEAT DISPLAY ========= */

const seatEl = document.getElementById("seatsLeft");
const urgencyEl = document.getElementById("urgencyMessage");
const soldOutEl = document.getElementById("soldOutMessage");

function updateSeatsDisplay(seatsLeft) {
    if (seatEl) seatEl.innerText = seatsLeft;

    if (!urgencyEl || !soldOutEl) return;

    if (seatsLeft === 0) {
        soldOutEl.classList.remove("hidden");
        urgencyEl.classList.add("hidden");
    } else if (seatsLeft < 11) {
        urgencyEl.classList.remove("hidden");
        soldOutEl.classList.add("hidden");
    } else {
        urgencyEl.classList.add("hidden");
        soldOutEl.classList.add("hidden");
    }
}

window.fb.onSnapshot(seatDoc, snap => {
    if (!snap.exists()) return;
    updateSeatsDisplay(snap.data().seatsLeft);
});


/* ========= BOOK BUTTON ========= */

window.bookSeat = function () {
    const text = encodeURIComponent(
        "Hello, I want to book a seat for 11th Hour Open Mic."
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
};


/* ========= ADMIN ========= */

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const seatInput = document.getElementById("seatInput");


window.adminLogin = function () {
    const email = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    window.fbAuth
        .signInWithEmailAndPassword(window.auth, email, pass)
        .catch(e => alert(e.message));
};


window.fbAuth.onAuthStateChanged(window.auth, user => {
    if (!loginBox || !adminPanel) return;

    if (user) {
        loginBox.classList.add("hidden");
        adminPanel.classList.remove("hidden");

        window.fb.getDoc(seatDoc).then(snap => {
            if (snap.exists() && seatInput) {
                seatInput.value = snap.data().seatsLeft;
            }
        });

    } else {
        loginBox.classList.remove("hidden");
        adminPanel.classList.add("hidden");
    }
});


window.saveSeats = function () {
    if (!seatInput) return;

    const val = parseInt(seatInput.value);
    if (isNaN(val) || val < 0) {
        alert("Invalid number");
        return;
    }

    window.fb.setDoc(seatDoc, { seatsLeft: val })
        .then(() => alert("Seats updated live"))
        .catch(e => alert(e.message));
};


window.logout = function () {
    window.fbAuth.signOut(window.auth).then(() => {
        window.location.href = "index.html";
    });
};


window.togglePass = function () {
    const p = document.getElementById("pass");
    if (!p) return;
    p.type = p.type === "password" ? "text" : "password";
};
