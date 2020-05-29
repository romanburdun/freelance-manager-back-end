exports.datesRangeQuery = async(user, model, dates ) => {
     const {taxYearStart, taxYearEnd} = dates;
     let response = null;
     let modelCollectionName = model.collection.collectionName

     if(modelCollectionName === 'invoices') {
         response = await model.find({user: user, paymentDate: {$gte: taxYearStart, $lte: taxYearEnd}});
     }

     if(modelCollectionName === 'expenses') {
         response = await model.find({user:user, expenseDate: {$gte:taxYearStart, $lte: taxYearEnd}});
     }

    return response;
}