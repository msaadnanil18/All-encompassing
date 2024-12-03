import { firestoreDB } from './config';

export const deleteFromFirestore = async (
  collectionName: string,
  id: string
): Promise<void> => {
  try {
    const docRef = firestoreDB.collection(collectionName).doc(id);
    await docRef.delete();
    console.log(`Document deleted from Firestore: ${collectionName}/${id}`);
  } catch (error) {
    console.error(`Failed to delete from Firestore: ${error}`);
    throw error;
  }
};

export const deleteFirestoreDoc = setTimeout(async (docRef) => {
  await docRef.delete();
}, 5000);
