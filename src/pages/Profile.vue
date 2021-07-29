<template>
  <q-page>
<div class="q-pa-md" v-if="user === ''">
    <div class="q-gutter-md">
      <q-skeleton width="150px" />
      <q-skeleton height="100px" />
    </div>
  </div>
    <q-card v-else class="my-card q-mt-md" flat>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-h5 q-mt-sm q-mb-xs">
            {{ user.firstName + " " + user.lastName }}
          </div>
          <div class="text-caption text-grey">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-icon name="person" size="70px" />
        </q-card-section>
      </q-card-section>
      <q-separator />
    </q-card>
     <div style="min-width: 300px; max-width: 700px" class="q-ma-sm">
      <q-card v-for="blog in allBlogs" :key="blog.uid" flat bordered  class="my-card bg-grey-1 q-mt-md">
         <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-icon name="person" size="35px"/>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label to="/profile" ><router-link style="text-decoration: none; color:black"  :to="{name: 'profile', params:{user: blog.uid}}">{{ blog.user}}</router-link></q-item-label>
          <q-item-label caption>{{convertDate(blog.createdAt)}}</q-item-label>
        </q-item-section>
  
      </q-item>
       <div class="q-pa-xs q-ml-md q-mr-md">
          <p class="text-justify">{{ blog.blogText }}</p>
       </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { firestore } from "boot/firebase";

export default {
  data() {
    return {
      loader: false,
      user: "",
      allBLogs: ""
    };
  },

  mounted() {
    this.getUser();
    this.getBlogs()
  },

    computed: {
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
    }
  },


  methods: {
    getUser() {
      var uid = this.$route.params.user;
      firestore
        .collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
          this.user = doc.data();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getBlogs() {
    var uid = this.$route.params.user;
      firestore
        .collection("blogs")
        .where("uid", "==", uid)
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
          var blogs = [];
          querySnapshot.forEach((doc) => {
            blogs.push(doc.data());
          });
          this.allBlogs = blogs;
          this.loader = false;
        });
    }
  }
};
</script>
