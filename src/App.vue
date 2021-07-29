<template>
  <router-view />
</template>
<script>
import { LocalStorage } from 'quasar';
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('auth', ['isAuthenticate']),
    ...mapActions('userSettings', ['fetchWeather']),
    ...mapActions('userSettings', ['resetUserSettings']),
  },
  mounted(){
    this.isAuthenticate();
    this.resetUserSettings();
    this.fetchWeather(LocalStorage.getItem('currentCity'));
  }
}
</script>
