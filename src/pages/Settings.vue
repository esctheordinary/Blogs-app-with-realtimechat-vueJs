<template>
  <q-page class="bg-white column q-pa-md">
  <div class="text-h5  q-mt-sm q-mb-md text-grey-7">User settings</div>
    <div class="row bg-white">
     <div class="col">
        <q-input
        round
        filled
        v-model="location"
        placeholder="Add city "
        :rules="inputRules"
        dense
      >
        <template v-slot:append>
          <q-btn
            dense
            flat
            :disabled="loading" :loading="loading"
            class="bg-primary"
            icon="check"
            @click="setLocation"
          />
        </template>
      </q-input>
        <q-input
        round
        filled
        v-model="firstName"
        placeholder="Change your firstname  "
        dense
      >
      </q-input>
       <q-input
        round
        class="q-mt-md q-mb-md"
        filled
        v-model="lastName"
        placeholder="Change your lastname "
        dense
      >
      </q-input>
           <q-btn :disabled="disabled" outline color="primary" icon="update" :loading="loading" label="Update profile" @click="updateProfile" />
     </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex"

export default {
  data() {
    return {
      location: "",
      firstName:"",
      lastName: "",
      inputRules: [(val) => !!val || "Please input something"]
    };
  },

  computed: {
    loading(){
      return this.$store.getters['userSettings/loading']
    },
    disabled(){
      var disable = true;
      if(this.firstName == "" || this.lastName == ""){
        disable = true
      }else{
        disable = false
      } 
      return disable;
    }
  },
  methods: {
    ...mapActions("userSettings", ["changeLocation"]),
    ...mapActions("auth", ["updateUserProfile"]),
    setLocation() {
      this.changeLocation(this.location);
      this.$router.push('/home')
    },

    updateProfile(){
      var userObj = {
        uid: this.$store.getters['auth/user'].uid,
        firstName: this.firstName,
        lastName: this.lastName
      }
      this.updateUserProfile(userObj);
      this.firstName = "";
      this.lastName = ""
    }
  }
};
</script>
