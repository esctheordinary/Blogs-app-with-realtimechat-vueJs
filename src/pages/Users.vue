<template>
    <q-page>
         <q-card class="bg-white" flat>
        <q-card-section>
          <div class="text-h6">Users</div>
        </q-card-section>

        <!-- <q-card-section class="q-pt-none">
         <q-input
            round
            filled
            v-model="searchUserText"
            placeholder="Search user"
            dense
             v-on:keyup="searchUser"
          >
            <template v-slot:append>
              <q-btn
                dense
                flat
                :disabled="loading"
                :loading="loading"
                class="bg-primary"
                icon="search"
                @click="searchUser"
              /> 
            </template>
          </q-input>
        </q-card-section> -->
        <q-card-section>
            <q-list v-if="allUsers.length">
               <q-item v-for="user in allUsers" :key="user.uid" class="q-my-sm" clickable :to="{ name: 'chat', params: { user: user.uid } }" v-ripple>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{user.firstName.charAt(0)}}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.firstName + " " + user.lastName }}</q-item-label>
          <!-- <q-item-label caption lines="1">{{ user.lastName }}</q-item-label> -->
        </q-item-section>

        <q-item-section side>
          <q-icon name="chat_bubble" color="green" />
        </q-item-section>
      </q-item>
        </q-list>
       
        </q-card-section>
          <div v-if="!allUsers.length" class="no-tasks text-center absolute-center">
      <q-spinner-facebook color="orange" v-if="loader" size="35px" />
    </div>
      </q-card>
    </q-page>
</template>

<script>
import { firestore } from "boot/firebase";

export default ({
    data() {
        return {
allUsers: "",
loader: false,
        }
    },

mounted() {
    this.getAllUsers()
},
    methods: {
        getAllUsers() {
        var uid = this.$store.getters["auth/user"].uid;
      this.loader = true;
      firestore
        .collection("users")
        .onSnapshot((querySnapshot) => {
          var users = [];
          querySnapshot.forEach((doc) => {
            if(doc.data().uid !== uid){
                    users.push(doc.data());
                }
          });
          this.loader = false;
          this.allUsers = users;
        });
    },
    },
})
</script>
