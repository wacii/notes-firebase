import firebase from 'firebase';
import tips from './tips';

const ONE_DAY = 1440;
const MS_IN_MINUTE = 60000;

export function init() {
  firebase.initializeApp({
    apiKey: 'AIzaSyARaUF4a-yOfQW-QR82vkaCjnqZBmJFYfA',
    authDomain: 'notes-8b5c2.firebaseapp.com',
    databaseURL: 'https://notes-8b5c2.firebaseio.com',
    storageBucket: '',
  });
  syncNotes();
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(
      user => {
        unsubscribe();
        resolve(user);
      }, error => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

// begin notes stuff
let notes = [];
let promise = null;

export function notesStable() {
  return promise || Promise.reject(new Error('Not Authorized'));
}

let fetchCallbacks = [];
export function onNotes(callback) {
  fetchCallbacks.push(callback);
  callback(notes);
}

export function offNotes(callback) {
  fetchCallbacks.splice(fetchCallbacks.indexOf(callback), 1);
}

export function nextNote() {
  const now = (new Date).getTime();
  const dueNotes = notes.filter(note => note.reviewAfter < now);
  const note = (dueNotes.length === 0 ? null : dueNotes.reduce(min));

  return note;
}

function min(candidate, note) {
  return (note.reviewAfter < candidate.reviewAfter ? note : candidate);
}

let ref
function syncNotes() {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      if (ref) {
        ref.off('child_added');
        ref.off('child_changed');
        ref.off('child_removed');
      }
      notes = [];
      promise = null;
      ref = null;
      return;
    }

    ref = firebase.database().ref(`notes/${user.uid}`);
    notes = [];

    // data considered stable if no item added for 500ms
    const WAIT_FOR_STABLE_DATA = 500;
    let itemAdded = false;
    promise = new Promise(resolve => {
      const intervalId = window.setInterval(() => {
        if (itemAdded)
          return itemAdded = false;
        resolve(notes);
        window.clearInterval(intervalId);
      }, WAIT_FOR_STABLE_DATA);
    });
    ref.on('child_added', snapshot => {
      notes = notes.concat([snapshot.val()])
      itemAdded = true;
      fetchCallbacks.forEach(cb => cb(notes));
    });
    ref.on('child_changed', snapshot => {
      const changedNote = snapshot.val();
      notes = notes.map(note =>
        note.key === changedNote.key ? changedNote : note
      );
      fetchCallbacks.forEach(cb => cb(notes));
    });
    ref.on('child_removed', snapshot => {
      const removedNote = snapshot.val();
      notes = notes.filter(note => note.key !== removedNote.key);
      fetchCallbacks.forEach(cb => cb(notes));
    });
  });
}
// end notes stuff

export function logout() {
  return firebase.auth().signOut();
}

export function login(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function signup(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(addTips)
    .catch(error => console.error(error.message));
}

export function onAuthStateChanged(callback) {
  return firebase.auth().onAuthStateChanged(callback);
}

export function createNote(text) {
  const { uid } = firebase.auth().currentUser;
  const ref = firebase.database().ref(`notes/${uid}`).push();

  const reviewAfter = dateFromNow(interval);
  const note = { key: ref.key, text, interval, reviewAfter };

  return ref.set(note);
}

export function updateNote(key, changes = {}) {
  const { uid } = firebase.auth().currentUser;
  const ref = firebase.database().ref(`notes/${uid}/${key}`);
  return ref.update(changes);
}

export function keepNote(note) {
  const interval = nextInterval(note.interval);
  const reviewAfter = dateFromNow(interval);
  return updateNote(note.key, { interval, reviewAfter });
}

export function deleteNote(key) {
  const { uid } = firebase.auth().currentUser;
  const ref = firebase.database().ref(`notes/${uid}`);
  return ref.child(key).remove();
}

function addTips(user) {
  let uid = user.uid;
  const ref = firebase.database().ref(`notes/${uid}`);
  tips.forEach(tip => {
    const item = ref.push();
    item.set(Object.assign({}, tip, { key: item.key }));
  });
  return user;
}

function dateFromNow(interval) {
  const date = new Date;
  return date.setTime(date.getTime() + interval * MS_IN_MINUTE);
}

function nextInterval(interval) {
  return interval + ONE_DAY;
}
