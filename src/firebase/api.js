import { db, firebase } from "./firebase";

const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();

const getActiveAccount = async () => {
  const web3 = window?.web3;
  if (!web3?.eth) {
    return "";
  }
  try {
    const accounts = await web3.eth.getAccounts();
    return accounts?.[0] || "";
  } catch (error) {
    console.warn("Unable to fetch connected account", error);
    return "";
  }
};

const enqueueRequest = async (collection, payload) => {
  if (!db) {
    console.warn("Firebase has not been initialised. Please set REACT_APP_FIREBASE_* env vars and restart the dev server.");
    return null;
  }

  return db.collection(collection).add({
    ...payload,
    createdAt: serverTimestamp(),
  });
};

export const messageAdmin = async (info, message) => {
  const requester = await getActiveAccount();
  return enqueueRequest("adminMessages", {
    requester,
    message,
    ...info,
  });
};

export const reqEducationEndorsementFunc = async (education) => {
  const requester = await getActiveAccount();
  return enqueueRequest("endorsementRequests", {
    requester,
    type: "education",
    payload: education,
  });
};

export const reqCertiEndorsementFunc = async (certification) => {
  const requester = await getActiveAccount();
  return enqueueRequest("endorsementRequests", {
    requester,
    type: "certification",
    payload: certification,
  });
};

export const reqWorkexpEndorsementFunc = async (workExperience) => {
  const requester = await getActiveAccount();
  return enqueueRequest("endorsementRequests", {
    requester,
    type: "work-experience",
    payload: workExperience,
  });
};
