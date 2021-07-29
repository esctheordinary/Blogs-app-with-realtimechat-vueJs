<template>
  <div>
    <q-item
      class="q-mb-sm bg-grey-3 fixed-top"
      style="width: 100%; margin-top: 180px; z-index: 1"
      v-if="user !== ''"
      clickable
      v-ripple
    >
      <q-item-section avatar>
       <q-btn icon="arrow_back" flat dense to="/users"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ user.firstName + " " + user.lastName }}</q-item-label>
        <q-item-label caption lines="1">online</q-item-label>
      </q-item-section>
    </q-item>
   <q-item v-else style="max-width: 300px">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" width="65%" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <div style="width: 100%;  max-width: 700px; margin-top: 55px"  v-if="conversations.length" class="q-pa-lg">
      <q-chat-message
        v-for="(message, index) in conversations"
        :key="index"
        :text="[message.message]"
        :sent="uid === message.user_uid_1"
        bg-color="#1976d2"
      />
    </div>
      <div class="fixed-bottom q-pr-xs q-pl-xs bg-white ">
        <q-input bottom-slots v-model="message" rounded outlined >
          <template v-slot:before>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
            </q-avatar>
          </template>
          <template v-slot:after>
            <q-btn round dense flat icon="send" @click="sendMessage" />
          </template>
        </q-input>
      </div>
  </div>
</template>

<script>
import { firestore } from "boot/firebase";
import { LocalStorage } from 'quasar';

export default {
  data() {
    return {
      uid: LocalStorage.getItem('User').uid,
      user: "",
      message: "",
      conversations: ""
    };
  },

  mounted() {
    this.getUser();
    this.getRealTimeMessage()
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

    sendMessage() {
      var messageObj = {
        user_uid_1: this.$store.getters["auth/user"].uid,
        user_uid_2: this.$route.params.user,
        message: this.message,
      };
      if (this.message !== "") {
        firestore
          .collection("conversations")
          .add({
            ...messageObj,
            isView: false,
            createdAt: new Date(),
          })
          .then(() => {
           this.message = ""
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    getRealTimeMessage() {
      var user_uid_1 = LocalStorage.getItem('User').uid;
      var user_uid_2 = this.$route.params.user
      firestore
        .collection("conversations")
        .where("user_uid_1", "in", [user_uid_1, user_uid_2])
        .orderBy("createdAt", "asc")
        .onSnapshot((querySnapshot) => {
          const conversation = [];
          querySnapshot.forEach((doc) => {
            if (
              (doc.data().user_uid_1 == user_uid_1 &&
                doc.data().user_uid_2 == user_uid_2) ||
              (doc.data().user_uid_1 == user_uid_2 &&
                doc.data().user_uid_2 == user_uid_1)
            ) {
              conversation.push(doc.data());
            }
          });
         this.conversations = conversation
        });
    },
  },
};
</script>
