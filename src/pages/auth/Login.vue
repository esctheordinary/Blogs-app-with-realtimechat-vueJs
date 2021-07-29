<template>
  <div class="fixed-center" style="max-width: 500px; width: 80%">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input filled bottom-slots :rules="emailRules" v-model="user.email" placeholder="Email">
        <template v-slot:append>
          <q-icon
            name="close"
            @click="user.email = ''"
            class="cursor-pointer"
          />
        </template>
      </q-input>

      <q-input
        v-model="user.password"
        filled
        :type="isPwd ? 'password' : 'text'"
        placeholder="Password"
        :rules="passwordRules"
        hint=""
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div>
        <q-btn :disabled="loading" :loading="loading" label="Login" type="submit" color="primary" />
        <div class="q-mt-md">
          <span
            >Don't Have an account,
            <q-btn
              to="/signup"
              label="Sign Up"
              type="reset"
              color="primary"
              dense
              flat
              size="md"
          /></span>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "Login",
  data() {
    return {
      isPwd: true,
      user: {
        email: "",
        password: "",
      },
       emailRules: [
        (val) => !!val || "E-mail is required",
        (val) => /.+@.+/.test(val) || "E-mail must be valid"
      ],
      passwordRules: [
        (val) => !!val || "Password is required",
        (val) =>
          /[a-z]/.test(val) &&
          /[A-Z]/.test(val) &&
          /[0-9]/.test(val) &&
          /\W|_/.test(val) &&
          val.length >= 8 || "Password must be more than 7 characters"
      ]
    };
  },
   computed: {
    loading(){
      return this.$store.getters['auth/loading']
    }
  },
  methods: {
    ...mapActions("auth", ["loginUser"]),
    onSubmit() {
      this.loginUser(this.user);
    },
  }
});
</script>
