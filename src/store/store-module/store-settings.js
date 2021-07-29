import axios from 'axios';
import { LocalStorage } from 'quasar';
import { dispatchNotification } from 'src/components/Notification'
import { firebaseAuth, firestore } from 'boot/firebase'

const state = {
    currentLocation: "",
    currentLocationWeather: "",
    isLoading: false
}

const mutations = {
    setCurrentCity(state, value) {
        state.currentLocation = value
    },
    setWeather(state, value) {
        state.currentLocationWeather = value
    },
    setLoading(state, value) {
        state.isLoading = value
    },

}

const actions = {
    changeLocation({ commit, dispatch}, payload){
        const currentUser = firebaseAuth.currentUser
            if(currentUser){
               firestore.collection("users")
               .doc(currentUser.uid)
               .update({
                   currentCity: payload
               })
               .then(() => {
                  commit('setCurrentCity', payload)
                  LocalStorage.set('currentCity', payload)
                  dispatch('fetchWeather',payload)
                  dispatchNotification("Location updated", 'green')
               })
            }
    },

    fetchWeather({ commit }, payload) {
        axios({
            method: "get",
            url: `https://api.openweathermap.org/data/2.5/weather`,
            params: {
                q: payload,
                appid: "f0a9a5977f9fbd3d898384a600267f32",
            },
        })
            .then((res) => {
                LocalStorage.set('weather', res.data);
                commit('setWeather', res.data)
            })
            .catch(() => {
                commit('setLoading', false)
            });

    },

    clearLocation({ commit }) {
        commit('setCurrentCity', "")
        LocalStorage.remove('currentCity')
    },

    resetUserSettings({ commit }) {
        commit('setWeather', LocalStorage.getItem('weather'))
        commit('setCurrentCity', LocalStorage.getItem('currentCity'))
    }
}

const getters = {
    location: (state) => {
        return state.currentLocation
    },
    locationWeather: (state) => {
        return state.currentLocationWeather
    },
    loading: (state) => {
        return state.isLoading
    }
}

export default {
    namespaced: true,
    getters,
    mutations,
    actions,
    state
}

