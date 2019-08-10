import Vue from 'vue';
import Vuex from 'vuex';
import services from './services/Index';

Vue.use(Vuex);

// TODO: lead out all FB assync methods to a service
/*
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storageRef = firebase.storage().ref();
*/

const store = new Vuex.Store({
  state: {
    isWaiting: false,
    fullImageList: [{src: 'aha', isPublic: false}],
    filteringTags: [],
    listOnlyTagless: false,
    displayedImageCount: 4,
    avalaibleTags: []
  },
  mutations: {
    updateImageList (state, payload) {
      state.fullImageList = payload;
    },
    updateTagsList (state, payload) {
      state.avalaibleTags = payload;
    },
    showPreloader (state, payload) {
      state.isWaiting = payload;
    }
  },
  actions: {
    logIn () {

    },
    logOut () {

    },
    addImages (context, payLoad) {
      store.commit('showPreloader', true);
      services.addImages(payLoad)
        .then(() => {
          store.commit('showPreloader', false);
        })
        .catch(err => {
          store.commit('showPreloader', false);
          console.error(err);
        });
    },
    deleteImages () {

    },
    addTag (payLoad) {
      store.commit('showPreloader', true);
      services.addTag(payLoad)
          .then(() => {
            store.commit('showPreloader', false);
          })
          .catch(err => {
            store.commit('showPreloader', false);
            console.error(err);
          });
    },
    addTagToImage (payload) {

    },
    updateImage (payload) {

    }
  },
  getters: {
    totalCount: state => state.fullImageList.length
  }
});

services.onImagesSnapshot(querySnapshot => {
  const imagesPayload = querySnapshot.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data()
    };
  });
  store.commit('updateImageList', imagesPayload);
  console.log('imagesSnapshot:::', imagesPayload);
});
services.onTagsSnapshot(querySnapshot => {
  const tagsPayload = querySnapshot.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data()
    }
  });
  store.commit('updateTagsList', tagsPayload);
  console.log('tagsSnapshot', tagsPayload);
});

export default store;