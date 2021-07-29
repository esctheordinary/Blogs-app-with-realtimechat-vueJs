import { firebaseAuth, firestore } from 'boot/firebase'
import { LocalStorage } from 'quasar'
import { dispatchNotification } from 'src/components/Notification'

const state = {
  isAuth: false,
  user: "",
  isLoading: false,
  userRole: "",
}

const mutations = {
  setAuth(state, value) {
    state.isAuth = value
  },
  setUser(state, value) {
    state.user = value
  },
  setLoading(state, value) {
    state.isLoading = value
  },
  setUserRole(state, value) {
    state.userRole = value
  }
}

const actions = {
  registerUser({ commit }, payload) {
    commit('setLoading', true)
    firebaseAuth.createUserWithEmailAndPassword(
      payload.email, payload.password
    )
      .then((data) => {
        const currentUser = firebaseAuth.currentUser;
        const name = `${payload.firstName} ${payload.lastName}`;
        currentUser
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            firestore.collection("users")
              .doc(data.user.uid)
              .set({
                firstName: payload.firstName,
                lastName: payload.lastName,
                uid: data.user.uid,
                createdAt: new Date(),
                role: "user"
              })
              .then(() => {
                const loggedInUser = {
                  firstName: payload.firstName,
                  lastName: payload.lastName,
                  uid: data.user.uid,
                  email: payload.email,
                  role: "user"
                };
                commit('setLoading', false)
                LocalStorage.set("User", loggedInUser);
                dispatchNotification("SuccessFully registered", 'green')
                commit('setUser', loggedInUser)
                commit('setLoading', false)
              })
              .catch((err) => {
                commit('setLoading', false)
                dispatchNotification(err.message, 'red')
              })
          })
          .catch((err) => {
            commit('setLoading', false)
            dispatchNotification(err.message, 'red')
          })

      }).catch((err) => {
        commit('setLoading', false)
        dispatchNotification(err.message, 'red')
      });
  },

  loginUser({ commit }, payload) {
    commit('setLoading', true)
    firebaseAuth.signInWithEmailAndPassword(
      payload.email, payload.password
    )
      .then((data) => {
        firestore.collection("users")
          .doc(data.user.uid)
          .get()
          .then((doc) => {
            const loggedInUser = {
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              uid: doc.data().uid,
              email: doc.data().email,
              role: doc.data().role,
            };
            commit('setUser', loggedInUser)
            commit('setUserRole', doc.data().role)
            LocalStorage.set("User", loggedInUser);
            if (doc.data().currentCity) {
              LocalStorage.set('currentCity', doc.data().currentCity)
            }
            commit('setLoading', false)
            dispatchNotification("SuccessFully Logged In", 'green')
          })
          .catch((err) => {
            dispatchNotification(err.message, 'red')
          });
      }).catch((err) => {
        commit('setLoading', false)
        dispatchNotification(err.message, 'red')
      });
  },

  updateUserProfile({ commit }, payload) {
    commit('setLoading', true)
    var users = firestore.collection("users");
    users.doc(payload.uid)
      .update({
        firstName: payload.firstName,
        lastName: payload.lastName
      })
      .then(() => {
        users.doc(payload.uid)
          .get()
          .then((doc) => {
            const loggedInUser = {
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              uid: doc.data().uid,
              email: doc.data().email,
              role: doc.data().role,
            };
            commit('setUser', loggedInUser)
            commit('setUserRole', doc.data().role)
            LocalStorage.set("User", loggedInUser);
          })
        commit('setLoading', false)
        dispatchNotification("Your profile is updated", "green")
      }).catch((err) => {
        commit('setLoading', false)
        dispatchNotification("Something went wrong", 'red')
      });
  },

  logoutUser() {
    firebaseAuth.signOut()
    LocalStorage.remove('User')
    dispatchNotification("Logged out successfully", 'orange')
  },

  isAuthenticate({ commit }) {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        commit('setUser', LocalStorage.getItem('User'))
        commit('setAuth', true)
        commit('setUserRole', LocalStorage.getItem('User'))
        LocalStorage.set('isAuth', true)
        this.$router.replace('/home')
      } else {
        commit('setAuth', false);
        LocalStorage.set('isAuth', false)
        this.$router.replace('/')
      }
    })
  }
}

const getters = {
  loading: (state) => {
    return state.isLoading
  },
  user: (state) => {
    return state.user
  }
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}

