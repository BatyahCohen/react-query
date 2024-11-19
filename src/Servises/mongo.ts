import { MongoClient, ObjectId } from "mongodb";

export async function connectDatabase() {
  const dbConnection: any = process.env.PUBLIC_DB_CONNECTION;
  return await MongoClient.connect(dbConnection);
}

// export async function insertDocument(
//   client: any,
//   collection: string,
//   document: object
// ) {
//   const db = client.db("db1");
//   const result = await db.collection(collection).insertOne(document);
//   return result;
// }

export async function insertDocument(
  client: any,
  collection: string,
  document: object
) {
  const db = client.db("db1");
  const result = await db.collection(collection).insertOne(document);

  if (result.acknowledged) {
    const insertedDocument = await db
      .collection(collection)
      .findOne({ _id: result.insertedId });

    return { acknowledged: result.acknowledged, insertedDocument };
  }

  throw new Error("Failed to insert document");
}


export async function deleteDocument(
  client: any,
  collection: string,
  id: any
) {
  const db = client.db("db1");
  const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id)});
  return result;
}

export async function updateDocument(
  client: any,
  collection: string,
  update: object,
  id: string,
) {
  const db = client.db("db1");

  console.log(update)

  try {
    const result = await db.collection(collection).updateOne(
      { _id: new ObjectId(id) }, 
      { $set: update }    
    );
    return result;
  } catch (error) {
    console.error("Error during update operation:", error); 
    throw new Error("Failed to update the document");
  }
}


export async function getAllDocuments(client: any, collection: string) {
  const db = client.db("db1");
  const documents = await db.collection(collection).find().toArray();
  return documents;
}


export async function getDocumentById(client: any, collection: string,id:string) {
  const db = client.db("db1");
  const documents = await db.collection(collection).findOne({ _id: id });
  return documents;
}

