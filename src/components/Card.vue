<template>
  <div class="q-pa-sm">
    <div class="q-gutter-y-md q-pa-md" v-if="blog == ''">
      <q-skeleton bordered type="circle" />
      <q-skeleton bordered />
      <q-skeleton bordered square />
    </div>
    <q-card :bordered="bordered" flat class="my-card q-mt-md">
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="person" size="35px" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label to="/profile"
            ><router-link
              style="text-decoration: none; color: black"
              :to="{ name: 'profile', params: { user: blog.uid } }"
              >{{ blog.user }}</router-link
            ></q-item-label
          >
          <q-item-label caption>{{ convertDate(blog.createdAt) }}</q-item-label>
        </q-item-section>
      </q-item>
      <router-link
        style="text-decoration: none; color: black"
        :to="{ name: 'post', params: { post: blog.postId } }"
      >
        <div class="q-pa-xs q-ml-md q-mr-md">
          <p class="text-justify">{{ blog.blogText }}</p>
        </div>
      </router-link>
      <q-card-actions align="left">
        <q-btn
          flat
          round
          color="red"
          icon="favorite"
          @click="likePost(blog.postId)"
        />
        <!-- <q-btn
            v-else
            flat
            round
            color="red"
            icon="favorite_border"
            @click="likePost(blog.postId)"
          /> -->
        <q-item-label caption>{{ blog.likeCount }}</q-item-label>
        <!-- <q-btn flat round color="teal" icon="bookmark" /> -->
        <q-btn
          flat
          round
          color="primary"
          icon="comment"
          @click="isCommentingFunc(blog.postId)"
        />
        <q-item-label caption>{{ commentCount(blog.postId) }}</q-item-label>
      </q-card-actions>
      <q-card-actions :id="blog.postId" class="flex hidden flex-center">
        <q-input
          v-model="commentText"
          placeholder="Comment"
          style="width: 80%"
        />
        <q-btn
          flat
          :disabled="loading"
          :loading="loading"
          size="md"
          color="primary"
          icon="send"
          @click="addComment(blog.postId, commentText)"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    blog: {
      type: Object,
    },
    allComments: {
      type: Array,
    },
    addComment: {
      type: Function,
    },
    isCommentingFunc: {
      type: Function,
    },
    likePost: {
      type: Function,
    },
    bordered: {
      type: Boolean,
    },
  },
  data() {
    return {
      commentText: "",
    };
  },
  computed: {
    loading() {
      return this.$store.getters["post/loading"];
    },
    convertDate() {
      return (date) => {
        if (date) {
          var newDate = new Date(date.toMillis());
          var todayDate = new Date();
          var dateString = newDate.toLocaleDateString();
          if (todayDate.toLocaleDateString() == dateString) {
            dateString = "Today";
          }
          var time =
            dateString +
            " " +
            newDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          return time;
        }
      };
    },

    commentCount() {
      return (postId) => {
        var arr = [];
        if (this.allComments) {
          this.allComments.map((com) => {
            if (com.postId == postId) {
              arr.push(com);
            }
          });
        }
        return arr.length;
      };
    },
  },
};
</script>
