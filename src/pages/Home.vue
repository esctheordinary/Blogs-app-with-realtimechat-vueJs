<template>
  <q-page class="column">
    <div class="row q-pa-sm">
      <q-input
        class="col"
        outlined
        autogrow
        v-model="blog"
        placeholder="What's in your mind ?"
        bg-color="white"
      />
      <q-btn
        class="q-ml-sm"
        outline
        dense
        :disabled="loading"
        :loading="loading"
        size="xl"
        color="grey-5"
        icon="add"
        @click="AddPost"
      />
    </div>
    <div style="min-width: 300px; max-width: 700px">
      <Card
        v-for="blog in allBlogs"
        :key="blog.postId"
        v-bind:blog="blog"
        v-bind:allComments="allComments"
        v-bind:bordered="true"
        v-bind:addComment="addComment"
        v-bind:isCommentingFunc="isCommentingFunc"
        v-bind:likePost="likePost"
        v-bind:commentText="commentText"
      />
    </div>

    <div v-if="!allBlogs.length" class="no-tasks absolute-center">
      <q-spinner-facebook color="orange" size="35px" v-if="loader" />
      <div v-else class="text-h5 text-primary text-center">No Blogs</div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="chat_bubble"
        padding="sm"
        class="q-pa-sm"
        color="primary"
        to="/users"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { firestore } from "boot/firebase";
import Card from "../components/Card.vue";

export default {
  name: "Home",
  components: {
    Card,
  },
  data() {
    return {
      blog: "",
      allBlogs: "",
      loader: false,
      commentText: "",
      allComments: [],
      userArr: [],
      dialog: false,
      maximizedToggle: true,
      searchUserText: "",
    };
  },

  mounted() {
    this.fetchWeather(this.$store.getters["userSettings/location"]);
    this.getPosts();
    this.getComments();
  },

  computed: {
    loading() {
      return this.$store.getters["post/loading"];
    },

    convertDate() {
      return (date) => {
        var newDate = new Date(date.toMillis());
        var todayDate = new Date();
        var dateString = newDate.toLocaleDateString();
        if (todayDate.toLocaleDateString() == dateString) {
          dateString = "Today";
        }
        var time = dateString + " " + newDate.toLocaleTimeString();
        return time;
      };
    },

    isLiked() {
      return async (postId) => {
        var uid = this.$store.getters["auth/user"].uid;
        var bloglikes = firestore.collection("blogLikes").doc(postId).get();
        var liked;
        bloglikes.then((doc) => {
          if (doc.data()[uid] == true) {
            liked = true;
          } else {
            liked = false;
          }
        });
        return liked;
      };
    },
  },

  methods: {
    ...mapActions("userSettings", ["fetchWeather"]),
    ...mapActions("post", ["addPost"]),
    ...mapActions("post", ["postComment"]),
    ...mapActions("post", ["addLike"]),

    AddPost() {
      if (this.blog !== "") {
        this.addPost(this.blog);
        this.blog = "";
        this.getPosts();
      } else {
        this.$q.notify({
          message: "Write something",
          color: "Orange",
        });
      }
    },

    getPosts() {
      this.loader = true;
      firestore
        .collection("blogs")
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
          var blogs = [];
          var allBlogsData = [];
          querySnapshot.forEach((doc) => {
            blogs.push(doc.data());
            firestore
              .collection("users")
              .doc(doc.data().uid)
              .get()
              .then((user) => {
                this.userArr.push(user.data());
              });
          });
          // blogs.map((blog, i) => {
          //    if(this.userArr[i] !== undefined){
          //      console.log("object")
          //      if(blog.uid == this.userArr[i].uid){
          //        blogs.push(Object.assign({}, blog, this.userArr[i]))
          //      }
          //    }
          // })
          this.allBlogs = blogs;
          this.loader = false;
        });
    },

    getComments() {
      firestore.collection("comments").onSnapshot((querySnapshot) => {
        var comments = [];
        querySnapshot.forEach((doc) => {
          comments.push(doc.data());
        });
        this.allComments = comments;
      });
    },

    likePost(postId) {
      var likeObj = {
        uid: this.$store.getters["auth/user"].uid,
        postId: postId,
      };
      this.addLike(likeObj);
    },

    addComment(postId, comment) {
      var commentObj = {
        uid: this.$store.getters["auth/user"].uid,
        postId: postId,
        commentText: comment,
        username:
          this.$store.getters["auth/user"].firstName +
          " " +
          this.$store.getters["auth/user"].lastName,
      };
      this.postComment(commentObj);
      this.commentText = "";
      var classList = document.getElementById(postId).classList;
      classList.add("hidden");
    },


    isCommentingFunc(postId) {
      var classList = document.getElementById(postId).classList;
      classList.forEach((classes) => {
        if (classes == "hidden") {
          classList.remove("hidden");
        } else {
          classList.add("hidden");
        }
      });
    },
  },
};
</script>

<style lang="scss">
.done {
  .q-item__label {
    text-decoration: line-through;
    color: #bbb;
  }
}
.no-task {
  opacity: 0.3;
}
</style>
