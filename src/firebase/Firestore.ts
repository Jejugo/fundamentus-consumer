import {
  getFirestore,
  updateDoc,
  setDoc,
  getDoc,
  doc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  deleteField,
} from '@firebase/firestore';

import {
  IFirebaseAddToArray,
  IFirebaseRemoveFromArray,
  IFirebaseRemoveFieldFromObject,
  IFirebaseGetAllItems,
  IFirebaseAddListAsObject,
  IFirebaseAddListsAsObjectWithList,
  IFirebaseRemoveObjectKey,
  IFirebaseAddAllItems,
} from './interfaces';

export default function initalizeFirestore() {
  const db = getFirestore();

  return {
    /**
     * {
     *    [key: string]: string[]
     * }
     */
    singleKeyAddArrayItem: async function ({
      collection,
      id,
      itemKey,
      item,
    }: IFirebaseAddToArray) {
      try {
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.info('Adding data to existing collection.');
          await updateDoc(docRef, {
            [itemKey]: arrayUnion(item),
          });
        } else {
          console.info(`
            Creating a new collection and adding the item. 
            Collection name: ${collection}`);
          await setDoc(docRef, {
            [itemKey]: arrayUnion(item),
          });
        }
      } catch (err) {
        console.error('There was an error when adding data to firestore.');
        throw err;
      }
    },

    /**
     * {
     *    [key: string]: string[]
     * }
     */
    singleKeyRemoveArrayItem: async function ({
      collection,
      id,
      item,
    }: IFirebaseRemoveFromArray) {
      try {
        const docRef = doc(db, collection, id);
        await updateDoc(docRef, {
          shares: arrayRemove(item),
        });
        console.info('Data was successfully updated.');
      } catch (err) {
        console.error('There was an error when removing data from firebase.');
        throw err;
      }
    },

    /**
     * {
     *    [field1: whatever]: {
     *
     *    },
     *    [field2: whatever]: {
     *
     *    }
     * }
     */
    deletePropertyFromObject: async function ({
      collection,
      id,
      field,
    }: IFirebaseRemoveFieldFromObject) {
      try {
        const docRef = doc(db, collection, id);
        await updateDoc(docRef, {
          [field]: deleteField(),
        });
        console.info('Data was successfully deleted.');
      } catch (err) {
        console.error('There was an error when removing data from firebase.');
        throw err;
      }
    },

    getAllItems: async function ({
      collection,
      id,
    }: IFirebaseGetAllItems): Promise<any> {
      const docRef = doc(db, collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) return docSnap.data();
      return;
    },

    /**
     * item = {
     *    [key1]: {}
     *    [key1]: {}
     *    [key1]: {}
     *    [key1]: {}
     * }
     *
     */
    addAllItems: async function ({
      collection,
      id,
      item,
    }: IFirebaseAddAllItems) {
      const docRef = doc(db, collection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) await updateDoc(docRef, item);
      else await setDoc(docRef, item);
    },

    addObjectByKey: async function ({
      collection,
      id,
      list,
      key = undefined,
    }: IFirebaseAddListAsObject) {
      try {
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);

        const firebaseState = list.reduce((acc, item, index) => {
          return {
            ...acc,
            [key || index]: {
              ...item,
            },
          };
        }, {});

        if (!Object.keys(firebaseState).length) {
          await deleteDoc(docRef);
          return;
        }
        if (docSnap.exists()) await updateDoc(docRef, firebaseState);
        else await setDoc(docRef, firebaseState);
      } catch (err) {
        console.error(
          'There was an error while adding the list as an object to Firestore.',
        );
        throw err;
      }
    },

    addListByKey: async function ({
      collection,
      id,
      list,
      key = undefined,
    }: IFirebaseAddListsAsObjectWithList) {
      const docRef = doc(db, collection, id);
      const docSnap = await getDoc(docRef);
      if (key) {
        const firebaseState = list.reduce(
          (
            acc: { [key: string]: IStatement[] },
            item: IStatement,
            index: number,
          ) => {
            return {
              ...acc,
              [key || index]: [...acc[key], item],
            };
          },
          {
            [key]: [],
          },
        );

        if (!Object.keys(firebaseState).length) {
          await deleteDoc(docRef);
          return;
        }
        if (docSnap.exists()) await updateDoc(docRef, firebaseState);
        else await setDoc(docRef, firebaseState);
      }
      return;
    },

    removeObjectKey: async function ({
      collection,
      id,
      item,
    }: IFirebaseRemoveObjectKey) {
      try {
        const firebaseState = await this.getAllItems({ collection, id });
        if (firebaseState) {
          const keyToDelete = Object.keys(firebaseState).find(
            key => firebaseState[key].statement === item,
          );

          if (keyToDelete) delete firebaseState[keyToDelete];

          const docRef = doc(db, collection, id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            await updateDoc(docRef, firebaseState);
            console.info('Data was successfully updated.');
          } else throw new Error('Collection does not exist.');
        }
      } catch (err) {
        console.error(
          'There was an error when removing the key from Firestore.',
        );
        throw err;
      }
    },
  };
}
