<template>
  <q-page class="q-pa-sm">
    <div class="text-h5  q-mt-sm q-mb-md text-grey-7">My blogs</div>
     <q-card v-for="blog in myBlogs" :key="blog.postId" flat bordered class="my-card q-mt-md bg-grey-1">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-subtitle">{{blog.user}}</div>
            <div class="text-caption text-grey-6">{{convertDate(blog.createdAt)}}</div>
          </div>
      

          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable @click="deleteBlog(blog.postId)">
                    <q-item-section>Delete blog</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
         {{blog.blogText}} 
      </q-card-section>

      <q-separator />
    </q-card>
      <div v-if="!myBlogs.length" class="no-tasks absolute-center">
           <q-spinner-facebook color="orange" size="35px" v-if="loader" />
      <div v-else class="text-subtitle text-grey text-center">You didn't posted any blogs.</div>
    </div>
  </q-page> 
</template>
<script>
import { firestore } from "boot/firebase";
import { LocalStorage } from "quasar";
import { mapActions } from 'vuex';

export default {
  name: "MyBlogs",
  data() {
    return {
      myBlogs: "",
      loader: false
    };
  },
  mounted() {
    this.getPosts();
  },

  computed: {
    convertDate(){
      return date => {
        var newDate = new Date(date.toMillis())
        var todayDate = new Date();
        var dateString = newDate.toLocaleDateString()
        if(todayDate.toLocaleDateString() == dateString){
          dateString = "Today"
        }
        var time = dateString + " ," + newDate.toLocaleTimeString()
        return time
      }
    }
  },

  methods: {
       ...mapActions("post", ["deletePost"]),
    getPosts() {
        this.loader = true;
      firestore
        .collection("blogs")
        .where("uid", "==", LocalStorage.getItem("User").uid)
         .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot) => {
          var blogs = [];
          querySnapshot.forEach((doc) => {
            blogs.push(doc.data());
          });
          this.myBlogs = blogs;
          this.loader = false
        });
    },

    deleteBlog(post_id) {
      this.$q
        .dialog({
          dark: true,
          title: "",
          message: "Do you want to delete this blog?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deletePost(post_id)
        });
    }
  }
};
</script>
