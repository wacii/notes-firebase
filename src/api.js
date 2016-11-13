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

export function login(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function signup(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
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

export function deleteNote(key) {
  const { uid } = firebase.auth().currentUser;
  const ref = firebase.database().ref(`notes/${uid}`);
  return ref.child(key).remove();
}

export function addTips(user = { uid }) {
  const ref = firebase.database().ref(`notes/${uid}`);
  tips.forEach(tip => {
    const item = ref.push();
    item.set(Object.assign({}, tip, { key: item.key }));
  });
}

function dateFromNow(interval) {
  const date = new Date;
  return date.setTime(date.getTime() + interval * MS_IN_MINUTE);
}

function nextInterval(interval) {
  return interval + ONE_DAY;
}
