import { db, AuthorizationBase } from '../../constances'

function authorize (Authorization, res) {
  if (Authorization === AuthorizationBase) {
    return true
  } else {
    const prepareResults = {
      results: {
        success: 0,
        message: 'not authentication',
      },
      status: 401
    }
    res.status(401).send(prepareResults)
  }
}

async function hasDocument (collection, doc) {
  const hasDoc = await db.collection(collection).doc(doc).get()
  return hasDoc.exists
}

module.exports = {
  authorize,
  hasDocument
}