import { firestoreDB } from './config';

export const fetchFromFirestore = async (
  collectionName: string,
  id?: string
): Promise<Record<string, any> | null> => {
  try {
    const docRef = id
      ? firestoreDB.collection(collectionName).doc(id)
      : firestoreDB.collection(collectionName).doc();
    const doc = await docRef.get();
    if (doc.exists) {
      console.log(`Document fetched from Firestore: ${collectionName}/${id}`);
      return doc.data() || {};
    } else {
      console.log(`Document not found in Firestore: ${collectionName}/${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch from Firestore: ${error}`);
    throw error;
  }
};
