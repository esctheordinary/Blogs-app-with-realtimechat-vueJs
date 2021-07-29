import { firebaseAuth, firestore } from 'boot/firebase';
import { LocalStorage } from 'quasar';
import { dispatchNotification } from 'src/components/Notification';

const state = {
    loading: false,
    blogs: ''
}

const mutations = {
    setLoading(state, value) {
        state.loading = value
    },
    setBlogs(state, value) {
        state.blogs = value
    }
}

const actions = {
    addPost({ commit }, payload) {
        commit('setLoading', true)
        const postCollection = firestore.collection("blogs")
        const user = firebaseAuth.currentUser;
            postCollection
                .add({
                    blogText: payload,
                    uid: user.uid,
                    createdAt: new Date(),
                    likeCount: 0
                }).then((docRef) => {
                    postCollection.doc(docRef.id).update({
                        postId: docRef.id,
                        user: LocalStorage.getItem('User').firstName + " " + LocalStorage.getItem('User').lastName
                    })
                        .then(() => {
                            firestore.collection("blogLikes")
                            .doc(docRef.id)
                            .set({
                                postId: docRef.id
                            })
                            commit('setLoading', false)
                            dispatchNotification("Your blog is posted", "green")
                        })
                        .catch(() => {
                            commit('setLoading', false)
                        })
                })
                .catch(() => {
                    commit('setLoading', false)
                })
    },

    postComment({}, payload){
        console.log(payload)
        var posts = firestore.collection("blogs");
        var commentDoc = firestore.collection("comments");
        posts
          .doc(payload.postId)
          .get()
          .then((postDoc) => {
            commentDoc
            .add({
              postId: postDoc.id,
              commentText: payload.commentText,
              uid: payload.uid,
              user: payload.username,
              createdAt: new Date(),
            })
            .then((docRef)=> {
              dispatchNotification("Your comment is posted","green")
              commentDoc.doc(docRef.id)
              .update({
                  commentId: docRef.id
              })
            })
          })
          .catch(err => console.log(err))
    },

    addLike({}, payload){
        var posts = firestore.collection("blogs");
      var bloglikes = firestore.collection("blogLikes");
      posts
        .doc(payload.postId)
        .get()
        .then((postDoc) => {
          bloglikes
            .doc(payload.postId)
            .get()
            .then((doc) => {
              if (doc.data()[payload.uid] == true) {
                posts.doc(payload.postId).update({
                  likeCount: postDoc.data().likeCount - 1
                });
              } else {
                posts.doc(payload.postId).update({
                  likeCount: postDoc.data().likeCount + 1
                });
              }
            })
            .then(() => {
              bloglikes
                .doc(payload.postId)
                .get()
                .then((doc) => {
                  if (doc.data()[payload.uid] == true) {
                    bloglikes.doc(payload.postId).update({
                      [payload.uid]: false
                    });
                  } else {
                    bloglikes.doc(payload.postId).update({
                      [payload.uid]: true
                    });
                  }
                });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    },

    deletePost({ commit }, payload) {
        commit('setLoading', true)
        firestore
            .collection("blogs")
            .doc(payload)
            .delete()
            .then(() => {
                commit('setLoading', false)
            })
            .catch((error) => {
                commit('setLoading', false)
                dispatchNotification("Something went wrong, try again", "red")
            });
    },

    deleteComment({ commit }, payload) {
        firestore
            .collection("comments")
            .doc(payload)
            .delete()
            .then(() => {
                commit('setLoading', false)
            })
            .catch((error) => {
                commit('setLoading', false)
                dispatchNotification("Something went wrong, try again", "red")
            });
    }
}

const getters = {
    loading: (state) => {
        return state.loading
    },
    allBlogs: (state) => {
        return state.blogs
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}