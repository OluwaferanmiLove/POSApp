import * as SecureStore from 'expo-secure-store';

export async function saveToStorage(key, value) {
  await SecureStore.setItemAsync(key, value)
};

export async function getFromStorage(key) {
  return await SecureStore.getItemAsync(key)
    .then((response) => {
      return response;
    })
    .catch(error => {
      return error
    })
}

export async function deleteFromStorage(key) {
  return await SecureStore.deleteItemAsync(key)
    .then((response) => {
      return response;
    })
    .catch(error => {
      return error
    })
}