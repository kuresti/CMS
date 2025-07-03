const Sequence = require('../models/sequence');

let maxDocumentId;
let maxMessageId;
let maxContactId;
let sequenceId = null;

// This has been refactored because in Mongoose v8, .exec(callback)
// is no longer valid

// Initialize the counters immediately when this module loads
async function initializeCounters() {
  const sequence = await Sequence.findOne();
  if (!sequence) {
    throw new Error('Sequence document not found.');
  }
  sequenceId = sequence._id;
  maxDocumentId = sequence.maxDocumentId;
  maxMessageId = sequence.maxMessageId;
  maxContactId = sequence.maxContactId;
  console.log('[SequenceGenerator] Counters initialized.');
}


// run the initialization
initializeCounters().catch((err) => {
  console.error('Error initializing SequenceGenerator: ', err);
});

// var maxDocumentId;
// var maxMessageId;
// var maxContactId;
// var sequenceId = null;

// async function SequenceGenerator() {
//  const sequence = await Sequence.findOne();
//  if (!sequence) {
//   throw new Error('Sequence not found');
//  }
//  return{
//   sequenceId: sequence._id,
//   maxDocumentId: sequence.maxDocumentId,
//   maxMessageId: sequence.maxMessageId,
//   maxContactId: sequence.maxContactId
//  };
// }
//  }
//   Sequence.findOne()
//     .exec(function(err, sequence) {
//       if (err) {
//         return res.status(500).json({
//           title: 'An error occurred',
//           error: err
//         });
//       }

//       sequenceId = sequence._id;
//       maxDocumentId = sequence.maxDocumentId;
//       maxMessageId = sequence.maxMessageId;
//       maxContactId = sequence.maxContactId;
//     });
// }

function nextId(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = {maxDocumentId: maxDocumentId};
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = {maxMessageId: maxMessageId};
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = {maxContactId: maxContactId};
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  Sequence.updateOne({_id: sequenceId}, {$set: updateObject})
    .catch(err => {
      console.error("nextId erro = ", err);
    });
  return nextId;
}

module.exports = { nextId };