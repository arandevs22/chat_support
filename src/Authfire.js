// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from "firebase/app";

// Add the Firebase products and methods that you want to use
import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  where,
} from "firebase/firestore";

import * as firebaseui from "firebaseui";

// Document elements
const startRsvpButton = document.getElementById("startRsvp");
const guestbookContainer = document.getElementById("guestbook-container");

const form = document.getElementById("leave-message");
const input = document.getElementById("message");
const guestbook = document.getElementById("guestbook");
const numberAttending = document.getElementById("number-attending");
const rsvpYes = document.getElementById("rsvp-yes");
const rsvpNo = document.getElementById("rsvp-no");

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function AuthFire() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: "AIzaSyDeVpQNWHpbmHPfHhBIDDAWOugH1MTC4Qo",
    authDomain: "arandevs-a4605.firebaseapp.com",
    projectId: "arandevs-a4605",
    storageBucket: "arandevs-a4605.appspot.com",
    messagingSenderId: "858077889437",
    appId: "1:858077889437:web:3f6eef2ca5fc4eac77a574",
    measurementId: "G-RG7YGZD4GM",
  };

  // initializeApp(firebaseConfig);
  initializeApp(firebaseConfig);
  auth = getAuth();
  db = getFirestore();

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  //initialize the firebaseUI widget using firebase
  const ui = new firebaseui.auth.AuthUI(auth);

  //listen to rsvp button clicks
  startRsvpButton.addEventListener("click", () => {
    if (auth.currentUser) {
      signOut(auth);
    } else {
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  });

  //listen to the current auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      startRsvpButton.textContent = "CERRAR SESIÓN";
      guestbookContainer.style.display = "block";
      suscribeGuestbook();
      subscribeCurrentRSVP(user);
    } else {
      startRsvpButton.textContent = "HACER REPORTE O COMENTAR";
      guestbookContainer.style.display = "none";
      unsubscribeGuestbook();
      unsubscribeCurrentRSVP();
    }
  });

  //listen to the form submission
  form.addEventListener("submit", async (e) => {
    //prevent default form redirect
    e.preventDefault();
    //write a new message to the database collection "guestbook"
    addDoc(collection(db, "guestbook"), {
      text: input.value,
      timestamp: Date.now(),
      name: auth.currentUser.displayName,
      userId: auth.currentUser.uid,
    });
    //clear message input field
    input.value = "";
    //return false to avoid redirect
    return false;
  });

  //crete query for messages
  function suscribeGuestbook() {
    const q = query(collection(db, "guestbook"), orderBy("timestamp", "desc"));
    guestbookListener = onSnapshot(q, (snaps) => {
      //reset page
      guestbook.innerHTML = "";
      //loop trought documents in database
      snaps.forEach((doc) => {
        //create an HTML entry for each document and add it to the chat
        const entry = document.createElement("p");
        entry.textContent = doc.data().name + " : " + doc.data().text;
        guestbook.appendChild(entry);
      });
    });
  }

  //unsubscribe from guestbook updates
  function unsubscribeGuestbook() {
    if (guestbookListener != null) {
      guestbookListener();
      guestbookListener = null;
    }
  }

  //listen to rvsp responses
  rsvpYes.onclick = async () => {
    //get a reference to the users document in the attendees collection
    const userRef = doc(db, "attendees", auth.currentUser.uid);

    //if they rsvp d yes, save a document whit attending true
    try {
      await setDoc(userRef, {
        attending: true,
      });
    } catch (e) {
      console.error(e);
    }
  };
  rsvpNo.onclick = async () => {
    // Get a reference to the user's document in the attendees collection
    const userRef = doc(db, "attendees", auth.currentUser.uid);

    // If they RSVP'd yes, save a document with attending: true
    try {
      await setDoc(userRef, {
        attending: false,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Listen for attendee list
  const attendingQuery = query(
    collection(db, "attendees"),
    where("attending", "==", true)
  );
  const unsubscribe = onSnapshot(attendingQuery, (snap) => {
    const newAttendeeCount = snap.docs.length;
    numberAttending.innerHTML = "a " + newAttendeeCount + " personas les gusta";
  });

  // Listen for attendee list
  function subscribeCurrentRSVP(user) {
    const ref = doc(db, "attendees", user.uid);
    rsvpListener = onSnapshot(ref, (doc) => {
      if (doc && doc.data()) {
        const attendingResponse = doc.data().attending;

        // Update css classes for buttons
        if (attendingResponse) {
          rsvpYes.className = "clicked";
          rsvpNo.className = "";
        } else {
          rsvpYes.className = "";
          rsvpNo.className = "clicked";
        }
      }
    });
  }
  function unsubscribeCurrentRSVP() {
    if (rsvpListener != null) {
      rsvpListener();
      rsvpListener = null;
    }
    rsvpYes.className = "";
    rsvpNo.className = "";
  }
}

AuthFire();
