import { MongoClient, MongoClientOptions } from "mongodb"

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
  var _mongoClientPromiseSales: Promise<MongoClient> | undefined
}

// Main database connection
const uri = process.env.MONGODB_URI!
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Sale database connection
const saleUri = process.env.MONGODB_SALE!

let saleClient: MongoClient
let saleClientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable for sale DB
  if (!global._mongoClientPromiseSales) {
    saleClient = new MongoClient(saleUri, options)
    global._mongoClientPromiseSales = saleClient.connect()
  }
  saleClientPromise = global._mongoClientPromiseSales
} else {
  // In production mode, it's best to not use a global variable.
  saleClient = new MongoClient(saleUri, options)
  saleClientPromise = saleClient.connect()
}

// Export both connections
export default clientPromise
export const saleDbClient = saleClientPromise