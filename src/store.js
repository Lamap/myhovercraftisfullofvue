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
    addTagToImage (context, payload) {
      const existingTag = context.state.avalaibleTags.find(tag => payload.tag === tag.text);
      if (!payload.imageData.tags) {
        payload.image.tags = [];
      }

      if (!existingTag) {
        return services.createTag(payload.tag).then(tagDocRef => {
          console.log('tag is created:::::', tagDocRef);
          const newTag = {
            id: tagDocRef.id,
            text: payload.tag
          };
          payload.imageData.tags.push(newTag);
          return services.updateTagsOnImage(payload.imageData).catch(err => {
            console.error(err);
          });
        });
      }
      services.updateTagsOnImage(payload.imageData).catch(err => {
        console.error(err);
      });
    },
    removeTagFromImage (context, payload) {
      payload.imageData.tags = payload.imageData.tags.filter(({id}) => payload.tag.id !== id);
      services.updateTagsOnImage(payload.imageData).catch(err => {
        console.error(err);
      });
    },
    updateImage (context, payload) {

    }
  },
  getters: {
    totalCount: state => state.fullImageList.length
  }
});

services.onImagesSnapshot(querySnapshot => {
  const imagesPayload = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      tags: [
        {
          text: 'jenőserceg',
          id: 'tagIddddd2323123'
        }
      ],
      ...data
    };
  });
  store.commit('updateImageList', imagesPayload);
  console.log('imagesSnapshot:::', imagesPayload);
});
services.onTagsSnapshot(querySnapshot => {

  /// TODO: tags needs to be mapped from tagId => tagValue structure to index => {tagValue, tagId} (component needs this)
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