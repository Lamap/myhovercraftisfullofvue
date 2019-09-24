import Vue from 'vue';
import Vuex from 'vuex';
import services from './services/Index';
import _ from 'lodash';

Vue.use(Vuex);
const minDisplayImageCount = 12;
const store = new Vuex.Store({
  state: {
    isWaiting: false,
    loggedUser: null,
    fullImageList: [],
    filteredImageList: [],
    displayedImageList: [],
    displayedImageCount: 3,
    filteringTags: [],
    listOnlyTagless: false,
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
      let tagFilters = state.route.query[FILTERING_TAG_QUERY_NAME];
      if (!tagFilters) {
        tagFilters = [];
      }
      if (typeof tagFilters === 'string') {
        tagFilters = [tagFilters]
      }

      if (payload && payload.onlyNontagged) {
        state.filteredImageList = state.fullImageList.filter(image => !image.tags.length);
      } else if (!tagFilters.length){
        state.filteredImageList = state.fullImageList;
      } else {
        state.filteredImageList = state.fullImageList.filter(image => {
          if (!image.tags.length) {
            return false;
          }
          for (let filterTag of tagFilters) {
            if (!image.tags.find(tagOnImage => tagOnImage.text === filterTag)) {
              return false;
            }
          }
          return true;
        });
      }
      state.displayedImageList = state.filteredImageList.slice(0, minDisplayImageCount);
    },
    requestMoreImage (state, payload) {
      console.log('more more more', payload.increase);
      state.displayedImageCount = Math.min(state.displayedImageCount + payload.increase, state.filteredImageList.length);
      state.displayedImageList = state.filteredImageList.slice(0, state.displayedImageCount);
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
    setUser (context, user) {
      context.commit('setUser', { user: user ? user.email : null });
      const throttledImageSnapshots = _.throttle((querySnapshot) => {
        context.dispatch('setImages', querySnapshot);
      }, 800);
      services.onImagesSnapshot(throttledImageSnapshots, store.state.loggedUser);
    },
    setImages (context, querySnapshot) {
      const imagesPayload = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          tags: [],
          ...data
        };
      });
      context.commit('updateImageList', imagesPayload);
      context.commit('setFiltering');
    },
    setTags (context, querySnapshot) {
      const tagsPayload = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      });
      store.commit('updateTagsList', tagsPayload);
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
        allTagsToAdd = newTags.concat(existingTags);
        images.forEach( image => {
          image.tags = _.unionBy(allTagsToAdd, image.tags, 'id');
          image.tags = image.tags.map(({text, id}) => {
            return {
              id,
              text
            }
          });
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
      context.commit('setFiltering');
      payload.imageData.tags = payload.imageData.tags.filter(({id}) => payload.tag.id !== id);
      services.updateTagsOnImage(payload.imageData)
        .catch(err => {
          console.error(err);
        });
    },
    updateImage (context, payload) {
      // TODO: should set only specific fields and never save local stored objects as they are
    },
    updatePublicStateOnImages (context, payload) {
      services.updatePublicStateOnImages(payload.images)
        .catch(err => {
          console.error(err);
        });
    }
  },
  getters: {
    totalCount: state => state.fullImageList.length,
    filteredCount: state => state.filteredImageList.length,
    displayedCount: state => state.displayedImageList.length,
    tagObjectsFromFilter: state => {
      if (!state.route.query[FILTERING_TAG_QUERY_NAME]) {
        return [];
      }
      if (typeof state.route.query[FILTERING_TAG_QUERY_NAME] === 'string') {
        return [{
          text: state.route.query[FILTERING_TAG_QUERY_NAME]
        }]
      }
      return state.route.query[FILTERING_TAG_QUERY_NAME].map(tag => {
        return {
          text: tag
        };
      });
    }
  }
});

services.onTagsSnapshot(querySnapshot => {
  store.dispatch('setTags', querySnapshot);
});
services.onUserStateSnapshot(user => {
  store.dispatch('setUser', user);
});
export default store;
export const FILTERING_TAG_QUERY_NAME = 'tagfilters';