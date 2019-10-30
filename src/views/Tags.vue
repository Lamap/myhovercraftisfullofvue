<template>
  <div class="hvr-tag-handling">
    <Header :show-add-button="false"/>
    <md-table
        v-if="loggedUser"
        v-model="tagsArray"
        :md-sort.sync="currentSort"
        :md-sort-order.sync="currentSortOrder"
        :md-sort-fn="customSort"
        md-fixed-header
    >
      <md-table-toolbar>
        <h2 class="md-title">Tags</h2>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{ item }" >
        <md-table-cell md-label="ID" md-sort-by="id" >{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Value" md-sort-by="text">
          <span @click="filterOnTag(item)" class="hvr-tag-handling__tag-link">{{ item.text }}</span>
        </md-table-cell>
        <md-table-cell md-label="Used on image count" md-sort-by="count">{{ item.count }}</md-table-cell>
        <md-table-cell md-label="Actions">
          <span class="hvr-tag-handling__edit-button">
            <md-button class="md-icon-button" @click.stop.prevent="editTag(item)">
              <md-icon>edit</md-icon>
            </md-button>
          </span>
          <span class="hvr-tag-handling__delete-button" v-if="item.count === 0">
            <md-button class="md-icon-button" @click.stop.prevent="deleteTag(item)">
              <md-icon class="hvr-icon-red">delete</md-icon>
            </md-button>
          </span>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div v-if="!loggedUser">
      You need to be logged in for seeing this content.
    </div>
    <md-dialog :md-active.sync="showEditDialog" v-if="showEditDialog">
      <md-dialog-content>
        <form @submit.prevent="submitTagRenaming" class="hvr-tag-handling__edit-dialog">
          <div>{{editedTag.id}}</div>
          <md-field>
            <md-input v-model="editedTag.text" placeholder="Can't leave it blank" type="text"></md-input>
          </md-field>
          <div class="hvr-tag-handling__button">
            <md-button type="submit" class="md-primary" >Submit</md-button>
          </div>
        </form>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue'
  import { mapState } from 'vuex';
  import { FILTERING_TAG_QUERY_NAME } from '../store';

  export default {
    components: {
      Header
    },
    data: () => {
      return {
        currentSort: 'text',
        currentSortOrder: 'asc',
        tagsArray: [],
        showEditDialog: false,
        editedTag: null
      }
    },
    created () {
      console.log('taghandling-created');
    },
    mounted () {
      console.log('taghandling-mounted');
      if (this.tagObjects) {
        this.tagsArray = JSON.parse(JSON.stringify(this.tagObjects));
      }
    },
    methods: {
      customSort (value) {
        return value.sort((a, b) => {
          const sortBy = this.currentSort;

          if (typeof a[sortBy] === 'string') {
            if (this.currentSortOrder === 'desc') {
              return a[sortBy].localeCompare(b[sortBy]);
            }

            return b[sortBy].localeCompare(a[sortBy]);
          }

          if (typeof a[sortBy] === 'number') {
            if (this.currentSortOrder === 'desc') {
              return a[sortBy] - b[sortBy];
            }

            return b[sortBy] - a[sortBy];
          }
        })
      },
      deleteTag (tag) {
        this.$eventBus.$emit('dialog:confirm', {
          title: 'Do u really want to remove this tag?',
          onConfirm: () => {
            this.$store.dispatch('deleteTag', tag);
          }
        });
      },
      editTag (tag) {
        this.editedTag = JSON.parse(JSON.stringify(tag));
        this.showEditDialog = true;
      },
      submitTagRenaming () {
        this.$store.dispatch('renameTag', this.editedTag);
        this.showEditDialog = false;
        this.editedTag = null;
      },
      filterOnTag (tag) {
        let query = {};
        query[FILTERING_TAG_QUERY_NAME] = [tag.text];
        this.$router.push({path: '/', query: query });
      }
    },
    computed: {
      ...mapState(['loggedUser']),
      tagObjects () {
        const tags = this.$store.state.existingTags;
        const images = this.$store.state.fullImageList;

        if (!tags || !tags.length && !images || !images.length) {
          return [];
        }

        const usedTags = {};
        tags.forEach(tag => {
          usedTags[tag.id] = {
            count: 0, // needed for the sorting
            images: [],
            id: tag.id.toString(),
            text: tag.text.toString()
          };
        });

        images.forEach(image => {
          image.tags.forEach(tag => {
            usedTags[tag.id].count++,
            usedTags[tag.id].images.push({
              id: image.id,
              tags: image.tags
            });
          });
        });
        return Object.keys(usedTags).map(key => usedTags[key]);
      }
    },
    watch: {
      tagObjects (newTags, oldTags) {
        this.tagsArray = newTags;
      }
    }
  }
</script>
<style lang="less">
  @import "../global.less";
  .hvr-tag-handling {
    /* until the component would be finished we need this to override theheight */
      .md-content.md-table-content.md-scrollbar.md-theme-default {
        height: calc(100vh - 174px) !important;
        max-height: initial !important;
      }
    &__tag-link {
      cursor: pointer;
      &:hover {
        color: @blue-color;
      }
    }
  }
</style>