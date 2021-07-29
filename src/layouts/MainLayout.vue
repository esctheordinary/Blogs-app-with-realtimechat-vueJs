<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-toolbar>
      <div class="row" v-if="currentLocation">
        <div class="col q-px-lg q-pt-xl q-mb-md">
          <div class="text-h4">{{ currentLocation }}</div>
          <div class="text-subtitle1">
            {{ todaysDate }}
          </div>
        </div>
        <div class="col q-px-lg q-ml-xl q-pt-xl">
          <div v-if="getTemprature" class="text-h4">{{ getTemprature }}C</div>
          <div v-if="getWeatherData" class="text-h6">
            {{ getWeatherData.weather[0].main }}
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col q-px-lg q-pt-xl q-mb-md">
          <div class="text-h4">Add city</div>
          <div class="text-subtitle1">
            {{ todaysDate }}
          </div>
        </div>
      </div>
      <q-img
        v-if="currentLocation"
        :src="setImage"
        class="header-image absolute-top"
      />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="600"
    >
      <q-scroll-area
        style="
          height: calc(100% - 192px);
          margin-top: 192px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item to="/" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section> Home </q-item-section>
          </q-item>

           <q-item to="/my-blogs" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>

            <q-item-section> My Blogs </q-item-section>
          </q-item>

             <!-- <q-item  :to="{ name: 'profile', params: { user: getUser.uid } }" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>

            <q-item-section> Profile </q-item-section>
          </q-item> -->

          <q-item to="/settings" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section> Setting </q-item-section>
          </q-item>

          <q-item to="/help" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>

            <q-item-section> Help </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-ripple class="absolute-bottom">
            <q-item-section>
              <q-btn
                label="Logout"
                :disabled="loading"
                :loading="loading"
                @click="logout"
                flat
                size="md"
                icon="logout"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.yourpng.com/uploads/preview/stone-editing-cb-background-download-115929855319bxbynkmkz.jpg"
        style="height: 182px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <q-icon name="account_circle" />
          </q-avatar>
          <div class="text-weight-bold">
            {{ getUser.firstName }} {{ getUser.lastName }}
          </div>
          <div>@esctheordinary</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { date } from "quasar";
import { mapActions } from "vuex";

export default defineComponent({
  name: "MainLayout",

  data() {
    return {
      leftDrawerOpen: false
    };
  },

  computed: {
    getUser() {
      return this.$store.getters["auth/user"];
    },
    todaysDate() {
      const timeStamp = Date.now();
      return date.formatDate(timeStamp, "DD MMMM YYYY");
    },
    loading() {
      return this.$store.getters["auth/loading"];
    },
    currentLocation() {
      return this.$store.getters["userSettings/location"];
    },
    getWeatherData() {
      return this.$store.getters["userSettings/locationWeather"];
    },
    getTemprature() {
      let temp =
        this.$store.getters["userSettings/locationWeather"].main.temp - 273.15;
      return temp.toFixed(1);
    },
    setImage() {
      let weatherType =
        this.$store.getters["userSettings/locationWeather"].weather[0].main;
      let imageType;
      if (weatherType === "Haze") {
        imageType =
          "http://images.unsplash.com/photo-1487621167305-5d248087c724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8Zm9nZ3klMjBiYWNrZ3JvdW5kfHwwfHx8fDE2MjY4NzgzNzc&ixlib=rb-1.2.1&q=80&w=1080";
      }
      if (weatherType === "Drizzle") {
        imageType = "https://wallpapercave.com/wp/wp2733241.png";
      }
      if (weatherType === "Rain") {
        imageType =
          "https://i.pinimg.com/originals/c1/02/46/c10246ad3b1a5981c44e3963890017b5.jpg";
      }
      if (weatherType === "Clouds") {
        imageType =
          "https://videohive.img.customer.envatousercontent.com/files/7ac0a2f3-5f81-460a-93ee-fa260c3b619c/inline_image_preview.jpg?auto=compress%2Cformat&fit=crop&crop=top&max-h=8000&max-w=590&s=d74ec489fbaf6b456c5fcb043c3bd28f";
      }
      return imageType;
    }
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
    ...mapActions("userSettings", ["clearLocation"]),
    logout() {
      this.$q
        .dialog({
          dark: true,
          title: "",
          message: "Do you want to logout?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.logoutUser();
          this.clearLocation();
        });
    }
  }
});
</script>
<style lang="scss">
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.8;
  filter: grayscale(50%);
}
</style>