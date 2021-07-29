<template>
  <q-page>
    <Card
      v-for="blog in blogData"
      :key="blog.postId"
      v-bind:blog="blog"
      v-bind:bordered="false"
      v-bind:allComments="allComments"
      v-bind:addComment="addComment"
      v-bind:isCommentingFunc="isCommentingFunc"
      v-bind:likePost="likePost"
    />
    <div v-if="allComments.length" class="text-h6 text-grey-7 q-ml-md">Comments</div>
    <q-list>
      <q-item v-for="comment in allComments" :key="comment">
        <q-item-section>
          <q-item-label>{{comment.user}}</q-item-label>
          <q-item-label caption lines="2">{{comment.commentText}}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{convertDate(comment.createdAt)}}</q-item-label>   
           <q-btn color="grey-7" v-if="showDeleteButton(comment.uid)" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable @click="deleteUserComment(comment.commentId)">
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
        </q-item-section>
      </q-item>

      <q-separator spaced inset />
    </q-list>
  </q-page>
</template>

<script>
import { firestore } from "boot/firebase";
import Card from "../components/Card.vue";
import { mapActions } from "vuex";

export default {
  components: {
    Card
  },
  data() {
    return {
      blogData: "",
      allComments: []
    };
  },

  mounted() {
    this.getPost();
    this.getComments();
  },

  computed: {
    convertDate() {
      return (date) => {
        if (date) {
          var newDate = new Date(date.toMillis());
          var todayDate = new Date();
          var dateString = newDate.toLocaleDateString();
          if (todayDate.toLocaleDateString() == dateString) {
            dateString = "Today";
          }
          var time = dateString + " " + newDate.toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'});
          return time;
        }
      }
    },
     showDeleteButton(){
          return(uid) => {
              var user = this.$store.getters["auth/user"].uid;
              var show;
              if(user == uid){
                  show = true
              }else{
                  show = false
              }
              return show
          }
      }
  },

  methods: {
    ...mapActions("post", ["postComment"]),
    ...mapActions("post", ["addLike"]),
     ...mapActions("post", ["deleteComment"]),

    getPost() {
      var postId = this.$route.params.post;
      firestore
        .collection("blogs")
        .where("postId", "==", postId)
        .onSnapshot((querySnapshot) => {
          var blogs = [];
          querySnapshot.forEach((doc) => {
            blogs.push(doc.data());
          });
          this.blogData = blogs;
        });
    },
    getComments() {
      var postId = this.$route.params.post;
      firestore
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("postId", "==", postId)
        .onSnapshot((querySnapshot) => {
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
        postId: postId
      };
      this.addLike(likeObj);
    },

    addComment(postId, comment) {
      var commentObj = {
        uid: this.$store.getters["auth/user"].uid,
        postId: postId,
        commentText: comment,
         username: this.$store.getters["auth/user"].firstName + " " + this.$store.getters["auth/user"].lastName,
      };
      this.postComment(commentObj);
      this.commentText = "";
      var classList = document.getElementById(postId).classList;
      classList.add("hidden");
    },

    deleteUserComment(commentId){
        this.deleteComment(commentId);
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
    }
  }
};
</script>
