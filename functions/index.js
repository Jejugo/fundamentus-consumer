const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const firestore = admin.firestore();

async function updateStrategyCollection(
  collectionName,
  userStrategies,
  documentId,
) {
  const docRef = firestore.collection(collectionName).doc(documentId);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.log(`Document ${documentId} does not exist. Exiting function.`);
    return;
  }

  const strategiesByAsset = doc.data(); // This holds the strategies for each asset like AAPL, GOOGL, etc.

  let newStrategies = {};

  // Process each asset in the document
  Object.keys(strategiesByAsset).forEach(assetKey => {
    const assetStrategies = strategiesByAsset[assetKey];

    // Determine strategies to add or update
    const updatedStrategies = userStrategies
      .filter(userStrategy => {
        return !assetStrategies.some(
          assetStrategy => assetStrategy.statement === userStrategy.statement,
        );
      })
      .map(strategy => ({ ...strategy, checked: false }));

    // Merge new strategies with existing ones and filter out any that are not in the userStrategies
    const finalStrategies = assetStrategies
      .filter(assetStrategy =>
        userStrategies.some(us => us.statement === assetStrategy.statement),
      )
      .concat(updatedStrategies);

    newStrategies[assetKey] = finalStrategies;
  });

  await docRef.update(newStrategies);
}

exports.updateStrategies = functions.firestore
  .document('userStrategy/{userId}')
  .onWrite(async change => {
    console.log('Starting function...');
    const newValue = change.after.exists ? change.after.data() : null;
    const userId = change.after.id;

    console.log('userId: ', userId);

    if (!newValue) {
      console.log('No new data. Exiting function.');
      return null;
    }

    try {
      await Promise.all([
        await updateStrategyCollection(
          'stocksStrategy',
          newValue.stocks,
          userId,
        ),
        await updateStrategyCollection('reitsStrategy', newValue.reits, userId),
      ]);

      console.log('Strategies updated successfully.');
    } catch (error) {
      console.error('Error updating strategies: ', error);
    }

    return null;
  });

// const updateUserStocks = async (stock, newValue) => {
//   const collectionRef = firestore.collection('userStocks');

//   const snapshot = await collectionRef.get();
//   const batch = firestore.batch();

//   snapshot.forEach(doc => {
//     if (!(stock.toLowerCase() in doc.data())) return;

//     const newData = {
//       ...doc.data(),
//       [stock.toLowerCase()]: newValue,
//     };

//     batch.set(doc.ref, newData, { merge: true });
//   });

//   batch.commit();
// };

// exports.updateAssets = functions.firestore
//   .document('stocks/{stock}')
//   .onWrite(async change => {
//     console.log('Starting function...');
//     const stock = change.after.id; // added this line to get the stock id
//     const newValue = change.after.exists ? change.after.data() : null;

//     if (!newValue) {
//       console.log('No new data. Exiting function.');
//       return null;
//     }

//     await updateUserStocks(stock, newValue);
//     console.log('Stocks updated successfully for asset: ', stock);
//     return null;
//   });
