import firebaseConfig from '../../firebaseConfig';
import firebase from 'firebase';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storageRef = firebase.storage().ref();

const imageCollection = db.collection('images');
const tagCollection = db.collection('tags');

const imageStorageBasePath = 'hvr';

const saveOneImage = (file) => {
  const origFileName = file.name;
  const fileName = 'spg-' + (new Date()).getTime().toString();
  const filePath = `${imageStorageBasePath}/${fileName}`;

  return storageRef.child(filePath).put(file)
      .then(snapshot => {
        return storageRef.child(filePath).getDownloadURL().then(url => {
          return imageCollection.add({
            src: url,
            filePath: filePath,
            originalName: origFileName,
            created: new Date().getTime()
          })
        });
      });
};

export default {
  addImages (files) {
    const allImageSavings = files.map( file => {
      console.log('filename', file.name);
      return saveOneImage(file);
    })
    return Promise.all(allImageSavings);
  },
  addTag (tag) {
    return tagCollection.add({
      value: tag
    });
  },
  onImagesSnapshot (listener) {
    // TODO: implement some throtthle or debounce
    imageCollection.onSnapshot((querySnapshot) => {
      listener(querySnapshot);
    });
  },
  onTagsSnapshot (listener) {
    // TODO: implement some throtthle or debounce
    tagCollection.onSnapshot((querySnapshot) => {
      listener(querySnapshot);
    });
  }
}
