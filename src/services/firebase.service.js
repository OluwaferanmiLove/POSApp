import firebase from 'firebase'

export const getData = async (collection, document) => {
  try {
    let data = await firebase.firestore().collection(collection).doc(document).get().data();
    return data;

  } catch (error) {
    return error;
  }
}

export const checkLogin = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      return user;
    } else {
      // No user is signed in.
      return null;
    }
  });
}