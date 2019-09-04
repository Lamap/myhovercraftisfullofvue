import firebaseConfig from '../../firebaseConfig';
import firebase from 'firebase';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storageRef = firebase.storage().ref();

const imageCollection = db.collection('images');
const tagCollection = db.collection('tags');

const imageStorageBasePath = 'hvr';

const saveOneImage = (file, index) => {
  const origFileName = file.name;
  const fileName = 'spg-' + (new Date()).getTime().toString() + '-' + index;
  const filePath = `${imageStorageBasePath}/${fileName}`;

  return storageRef.child(filePath).put(file)
      .then(() => {
        return storageRef.child(filePath).getDownloadURL().then(url => {
          return imageCollection.add({
            src: url,
            filePath: filePath,
            originalName: origFileName,
            created: new Date().getTime()
          });
        });
      });
};

const deleteOneImage = (image) => {
  if (!image.filePath) {
    return imageCollection.doc(image.id).delete();
  }
  return storageRef.child(image.filePath).delete()
    .then(() => {
      return imageCollection.doc(image.id).delete();
    });
};

export default {
  addImages (files) {
    const allImageSavings = files.map( (file, index) => {
      return saveOneImage(file, index);
    });
    return Promise.all(allImageSavings);
  },
  deleteImages (images) {
    const allImageDeletes = images.map ( image => {
      return deleteOneImage(image);
    });

    return Promise.all(allImageDeletes);
  },
  createTag (tagValue) {
    return tagCollection.add({
      text: tagValue
    }).then(docRef => {
      docRef.text = tagValue;
      return docRef;
    });
  },
  updateTagsOnImage(imageData) {
    return imageCollection.doc(imageData.id).set({ tags: imageData.tags }, { merge: true });
  },
  onImagesSnapshot (listener) {
    // TODO: implement some throtthle or debounce
    imageCollection.orderBy('created', 'desc').onSnapshot((querySnapshot) => {
      listener(querySnapshot);
    });
  },
  onTagsSnapshot (listener) {
    // TODO: implement some throtthle or debounce
    tagCollection.orderBy('text').onSnapshot((querySnapshot) => {
      listener(querySnapshot);
    });
  },
  onUserStateSnapshot (listener) {
    firebase.auth().onAuthStateChanged((user) => {
      listener(user);
    });
  },
  logUserIn(payload) {
    return firebase.auth().signInWithEmailAndPassword(payload.username, payload.password);
  },
  logUserOut() {
    return firebase.auth().signOut();
  }
}
