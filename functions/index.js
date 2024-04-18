const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const firestore = admin.firestore();

async function updateStrategyCollection(collectionName, userStrategies) {
  console.log('Updating collection: ', collectionName);
  console.log('With: ', JSON.stringify(userStrategies));

  const collectionRef = firestore.collection(collectionName);
  const snapshot = await collectionRef.get();
  const batch = firestore.batch();

  snapshot.forEach(doc => {
    const strategiesByAsset = doc.data(); // This holds the strategies for each asset like AAPL, GOOGL, etc.

    let newStrategies = {};

    // Process each asset in the document
    Object.keys(strategiesByAsset).forEach(assetKey => {
      const assetStrategies = strategiesByAsset[assetKey];

      // Determine strategies to add or update
      const updatedStrategies = userStrategies
        .filter(userStrategy => {
          //TODO: assetStrategies is not a function!!!!!!
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
    // Set updated strategies back to Firestore, merging with existing data
    batch.set(doc.ref, newStrategies, { merge: true });
  });

  batch.commit();
}

exports.updateStrategies = functions.firestore
  .document('userStrategy/{userId}')
  .onWrite(async change => {
    console.log('Starting function...');
    const newValue = change.after.exists ? change.after.data() : null;

    if (!newValue) {
      console.log('No new data. Exiting function.');
      return null;
    }

    try {
      await Promise.all([
        await updateStrategyCollection('stocksStrategy', newValue.stocks),
        await updateStrategyCollection('reitsStrategy', newValue.reits),
      ]);

      console.log('Strategies updated successfully.');
    } catch (error) {
      console.error('Error updating strategies: ', error);
    }

    return null;
  });
