import Vue from 'vue';
import Vuex from 'vuex';
import services from './services/Index';
import _ from 'lodash';

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
    loggedUser: null,
    fullImageList: [],
    partialImageList: [],
    filteringTags: [],
    listOnlyTagless: false,
    displayedImageCount: 4,
    existingTags: []
  },
  mutations: {
    updateImageList (state, payload) {
      state.fullImageList = payload;
    },
    updateTagsList (state, payload) {
      state.existingTags = payload;
    },
    showPreloader (state, payload) {
      state.isWaiting = payload;
    },
    setUser (state, payload) {
      state.loggedUser = payload.user;
    },
    setFiltering (state, payload) {
      state.filteringTags = payload.tags;
      if (payload.onlyNontagged) {
        return state.partialImageList = state.fullImageList.filter(image => !image.tags.length);
      }
      if (!payload.tags.length) {
        return state.partialImageList = state.fullImageList;
      }
      // TODO: change to ID-based comparision
      state.partialImageList = state.fullImageList.filter(image => {
        if (!image.tags.length) {
          return false;
        }
        for (let { text } of payload.tags) {
          if (!image.tags.find(tagOnImage => tagOnImage.text === text)) {
            return false;
          }
        }
        return true;
      });
    }
  },
  actions: {
    login (context, payload) {
      services.logUserIn(payload)
        .catch(err => {
          console.error(err);
        });
    },
    logout () {
      services.logUserOut()
        .catch(err => {
          console.error(err);
        });
    },
    addImages (context, payload) {
      store.commit('showPreloader', true);
      services.addImages(payload)
        .then(() => {
          store.commit('showPreloader', false);
        })
        .catch(err => {
          store.commit('showPreloader', false);
          console.error(err);
        });
    },
    deleteImages (context, images) {
      services.deleteImages(images).catch(err => {
        console.error(err);
      });
    },
    addTagToImage (context, payload) {
      if (!payload.tag.id) {
        return services.createTag(payload.tag.text).then(tagDocRef => {
          console.log('tag is created:::::', tagDocRef);
          const newTag = {
            id: tagDocRef.id,
            text: payload.tag.text
          };
          payload.imageData.tags.push(newTag);
          return services.updateTagsOnImage(payload.imageData).catch(err => {
            console.error(err);
          });
        });
      }

      payload.imageData.tags.push({
        text: payload.tag.text,
        id: payload.tag.id
      });
      services.updateTagsOnImage(payload.imageData).catch(err => {
        console.error(err);
      });
    },
    addTagsToImages (context, { tags, images }) {
      const tagCreationJobs = [];
      const existingTags = [];
      let allTagsToAdd = [];
      const allImageSavesJobs = [];

      console.log(tags);
      tags.forEach(tag => {
        if (!tag.id) {
          tagCreationJobs.push(services.createTag(tag.text));
        } else {
          existingTags.push(tag);
        }
      });
      Promise.all(tagCreationJobs).then((newTags) => {
        newTags = newTags.map(tag => {
          return {
            id: tag.id,
            text: tag.text
          };
        });
        console.log('newwwwtagss::::::::', newTags, 'exisingTags:::', existingTags);
        allTagsToAdd = newTags.concat(existingTags);
        console.log('allTagsToAdd', allTagsToAdd);
        images.forEach( image => {
          image.tags = _.unionBy(allTagsToAdd, image.tags, 'id');
          image.tags = image.tags.map(({text, id}) => {
            return {
              id,
              text
            }
          });
          console.log('allimages - tags: ', image.tags);
          allImageSavesJobs.push(services.updateTagsOnImage(image));
        });
        Promise.all(allImageSavesJobs)
          .catch(err => {
            console.error(err);
          });
      }).catch(err => {
        console.error(err);
      });

    },
    removeTagFromImage (context, payload) {
      context.commit('setFiltering', { tags: context.state.filteringTags });
      payload.imageData.tags = payload.imageData.tags.filter(({id}) => payload.tag.id !== id);
      services.updateTagsOnImage(payload.imageData)
        .catch(err => {
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
      tags: [],
      ...data
    };
  });
  store.commit('updateImageList', imagesPayload);
  store.commit('setFiltering', { tags: store.state.filteringTags });
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
services.onUserStateSnapshot(user => {
  console.log('user:::::.', user);
  store.commit('setUser', { user: user ? user.email : null });
});
export default store;