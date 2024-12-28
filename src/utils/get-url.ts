"use server";
import clientPromise from "@lib/mongodb";
import { IntegerType, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { doc } from "firebase/firestore";
import { toast } from "react-toastify";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID!,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
});

interface UserData {
  email: string;
  password: string;
  name: string;
  userName: string;
  role: string;
}

interface Coupon {
  coupon_type: string;
  coupon_code: string;
  terms_and_conditions: string;
  claims: number;
  usage_per_user: number;
  issue_date: string; // Assuming ISO date string format
  expiry_date: string; // Assuming ISO date string format
  minimum_purchase: number;
  free_shipping: boolean;
  discount_amount: number;
  discount_type: string;
  max_discount: number;
  applicable_categories: string[]; // Assuming categories are identified by strings
  applicable_products: string[]; // Assuming products are identified by strings
}
interface User {
  _id: string;
  recent_events?: Array<{ _id: ObjectId; timestamp: number }>;
  registered_events?: Array<{ _id: ObjectId; timestamp: number }>;
  wishlisted_events?: Array<{ _id: ObjectId; timestamp: number }>;
  recent_products?: Array<{ _id: ObjectId; timestamp: number }>;
  wishlisted_products?: Array<{ _id: ObjectId; timestamp: number }>;
  add_to_cart_products?: Array<{
    _id: ObjectId;
    timestamp: number;
    quantity: number;
  }>;
  // Add other properties as needed
}

type Event = {
  _id: ObjectId;
  [key: string]: any;
};

interface EventData {
  eventName: string;
  organizedBy: string;
  eventDate: string;
  eventTime: string;
  duration: string;
  description: string;
  type: string;
  fees: number;
  creatorId: string;
  creatorName: string;
  eventImageUrl: string;
}

interface ItemData {
  itemName: string;
  description: string;
  category: string;
  price: number;
  paymentMethod: string;
  nFTLink: string;
  productImage: string;
  sellerId: string;
  stock: number;
  sales: number;
}
interface Product {
  _id: string;
  itemName?: string;
  description?: string;
  category?: string;
  price?: string;
  paymentMethod?: string;
  nFTLink?: string;
  productImage?: string;
  product_views?: number;
  sellerId?: ObjectId;
  stock?: number;
}

interface CartProduct {
  _id: ObjectId;
  quantity: number;
  timestamp: number;
}

interface Address {
  firstName: string;
  lastName: string;
  addressLine: string;
  houseNumber: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  type: string; // can be house or office
}

interface OrderedProduct {
  category: string;
  description: string;
  itemName: string;
  nFTLink: string;
  paymentMethod: string;
  price: string; // If price should be a number, change the type accordingly
  productImage: string;
  product_views: number;
  quantity: number;
  sellerId: string;
  stock: number;
  _id: string;
}

// interface PaymentDetails {
//   razorpay_payment_id: string;
//   // Add any additional payment details fields here
// }

interface OrderDetails {
  address: Address;
  email: string;
  orderedProduct: OrderedProduct[];
  paymentDetails: any;
  shiprocketOrder: any;
  phoneNumber: string;
  shippingEstimate: number;
  subtotal: number;
  taxEstimate: number;
  total: number;
  userId: string;
  isCOD: boolean;
  deliveryType: string;
  deliveryPartnerDetails: any;
}

interface ProductDetails {
  category: string;
  description: string;
  itemName: string;
  nFTLink: string;
  paymentMethod: string;
  price: string;
  productImage: string;
  quantity: number;
  sellerId: ObjectId;
  productId: ObjectId;
}

interface Reviews {
  userId: ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export async function signInUser(collectionName: string, userData: UserData) {
  const client = await clientPromise;
  const collection = client.db().collection(collectionName);

  try {
    // 1. Find the user by email
    let user;
    if (userData.email) {
      user = await collection.findOne({ email: userData.email });
    } else if (userData.userName) {
      user = await collection.findOne({ userName: userData.userName });
    }
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // 2. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!isPasswordValid) {
      return { success: false, error: "Incorrect password" };
    }

    // 3. If successful, return user data (you might remove sensitive fields like passwordHash)
    return {
      success: true,
      user: { id: user._id.toJSON(), name: user.name, role: user.role },
    };
  } catch (error) {
    throw error; // Re-throw so the caller can handle it
  }
  // finally {
  //   await client.close();
  // }
}

// export async function createUserCollectionWithValidation(
//   collectionName: string,
//   document: any
// ) {

//   const client = await clientPromise;

//   // const db = client.db(dbName);

//   // Define the schema validation rules
//   const validator = {
//     $jsonSchema: {
//       bsonType: 'object',
//       required: ['email', 'password', 'name', 'userName'],
//       properties: {
//         email: {
//           bsonType: 'string',
//           description: 'Email must be a string and cannot be null',
//           unique: true, // Ensure this field is unique
//         },
//         password: {
//           bsonType: 'string',
//           description: 'Password must be a string and cannot be null',
//         },
//         name: {
//           bsonType: 'string',
//           description: 'Name must be a string and cannot be null',
//         },
//         userName: {
//           bsonType: 'string',
//           description: 'User Name must be a string and cannot be null',
//         },
//       },
//     },
//   };

//   const collection = await client.db().createCollection(collectionName, { validator });

//   try {
//     const result = await collection.insertOne(document);
//     return result.insertedId.toString();
//   } catch (error) {
//     throw error; // Re-throw so the caller can handle it specifically
//   }

//   // Create the collection with the schema validation rules
//   // await db.createCollection('user', { validator });
// }

export async function getCollectionData(
  collectionName: string,
  limit?: number,
  sort?: any
) {
  try {
    const client = await clientPromise;
    const collectionData = client.db().collection(collectionName);

    // Create a filter for future events if the collection is 'events'
    const filter =
      collectionName === "events"
        ? { eventDateTime: { $gte: new Date() } }
        : {};

    let query = collectionData.find(filter);

    if (sort) {
      query = query.sort(sort);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const links = await query.toArray();
    const userCollection = client.db().collection("user");
    const linksWithStringId: any[] = await Promise.all(
      links.map(async (link) => {
        // Check if creatorId exists and convert it to string
        if (link.creatorId) {
          link.creatorId = link.creatorId.toString();
        }
        if (link.sellerId) {
          link.sellerId = link.sellerId.toString();
        }

        // Check if userId exists and convert it to string
        if (link.userId) {
          link.userId = link.userId.toString();
        }

        // Fetch the creator's name from the users collection
        let creatorName = "";
        if (link.creatorId) {
          const creator = await userCollection.findOne({
            _id: new ObjectId(link.creatorId),
          });
          creatorName = creator ? creator.name : "";
        }
        let sellerName = "";
        if (link.sellerId) {
          const seller = await userCollection.findOne({
            _id: new ObjectId(link.sellerId),
          });
          sellerName = seller ? seller.name : "";
        }

        if (collectionName === "events") {
          return {
            ...link,
            _id: link._id.toString(), // Convert ObjectId to string
            creatorName, // Add the creator's name to the link
          };
        }
        if (collectionName === "Products") {
          return {
            ...link,
            _id: link._id.toString(), // Convert ObjectId to string
            category: link.category.toString(), // Convert ObjectId to string
            sellerName, // Add the creator's name to the link}
          };
        }

        return {
          ...link,
          _id: link._id.toString(), // Convert ObjectId to string
        };
      })
    );
    return linksWithStringId;
  } catch (e) {
    console.log("failed for mongodb", e);
  }
}

export async function getDocument(collectionName: string, id: string) {
  try {
    const client = await clientPromise;
    const collection = client.db().collection(collectionName);
    const document = await collection.findOne({ _id: new ObjectId(id) });
    if (document) {
      const { _id, ...rest } = document;
      return { _id: id, ...rest };
    } else {
      return null;
    }
  } catch (e) {
    console.log("failed at getDocument", e);
  }
}

export async function getUserData(id: string) {
  const client = await clientPromise;
  const collection = client.db().collection("user");
  const user = await collection.findOne({ _id: new ObjectId(id) });
  if (user) {
    const {
      _id,
      recent_events,
      wishlisted_events,
      registered_events,
      ...rest
    } = user;

    // Convert ObjectId fields to strings
    const recentEvents = recent_events?.map((event: Event) => ({
      ...event,
      _id: event._id.toString(),
    }));
    const registeredEvents = registered_events?.map((event: Event) => ({
      ...event,
      _id: event._id.toString(),
    }));
    const wishlistedEvents = wishlisted_events?.map((event: Event) => ({
      ...event,
      _id: event._id.toString(),
    }));

    return {
      _id: id,
      recent_events: recentEvents,
      wishlisted_events: wishlistedEvents,
      registered_events: registeredEvents,
      ...rest,
    };
  } else {
    return null;
  }
}

export async function getEventData(id: string) {
  const client = await clientPromise;
  const collection = client.db().collection("events");
  const event = await collection.findOne({ _id: new ObjectId(id) });
  if (event) {
    event.creatorId = event.creatorId.toString();
    const { _id, ...rest } = event;
    return { _id: id, ...rest };
  } else {
    return null;
  }
}

export async function getProductData(id: string) {
  const client = await clientPromise;
  const collection = client.db().collection("Products");
  const product = await collection.findOne({ _id: new ObjectId(id) });
  if (product) {
    product.sellerId = product.sellerId.toString();
    const { _id, ...rest } = product;

    // Fetch user details for each review
    if (rest.reviews && rest.reviews.length > 0) {
      const userCollection = client.db().collection("user");
      rest.reviews = await Promise.all(
        rest.reviews.map(async (review: Reviews) => {
          const user = await userCollection.findOne({ _id: review.userId });
          return {
            ...review,
            userId: review.userId.toString(),
            userName: user ? user.name : "Unknown User",
          };
        })
      );
    }

    return { _id: id, ...rest };
  } else {
    return null;
  }
}

export async function addProduct(collectionName: string, document: any) {
  const client = await clientPromise;
  const collection = client.db().collection(collectionName);

  let productData = {
    itemName: document.itemName,
    description: document.description,
    specifications: document.specifications,
    productImage: document.imageUrls,
    mrp: document.mrp,
    discount: document.discount,
    price: document.sellingPrice,
    replacementPolicy: document.replacementPolicy,
    warranty: document.warranty,
    stock: parseInt(document.stock),
    physics: {
      length: document.length,
      breadth: document.breadth,
      height: document.height,
      weight: document.weight,
    },
    category: new ObjectId(document.category),
    sellerId: new ObjectId(document.sellerId),
    product_views: 0,
    sales: 0,
  };

  try {
    // Create the collection with the schema validation rules
    const result = await collection.insertOne(productData);
    return result.insertedId.toString();
  } catch (error) {
    throw error; // Re-throw so the caller can handle it specifically
  }
}

export async function createEvent(collectionName: string, document: EventData) {
  const client = await clientPromise;
  const collection = client.db().collection(collectionName);

  // Combine the date and time strings into a single string
  const dateTimeString = `${document.eventDate}T${document.eventTime}`;

  // Convert the combined string to a Date object
  const eventDateTime = new Date(dateTimeString);

  let eventData = {
    eventName: document.eventName,
    organizedBy: document.organizedBy,
    eventDateTime: eventDateTime,
    duration: document.duration,
    description: document.description,
    type: document.type,
    fees: document.fees,
    creatorId: new ObjectId(document.creatorId),
    creatorName: document.creatorName,
    event_count: 0,
    eventImageUrl: document.eventImageUrl,
  };

  try {
    // Create the collection with the schema validation rules
    const result = await collection.insertOne(eventData);
    return result.insertedId.toString();
  } catch (error) {
    throw error; // Re-throw so the caller can handle it specifically
  }
}

//  createUserDocument is used to create a new user (SIGN UP)
export async function createUserDocument(
  collectionName: string,
  document: UserData
) {
  const client = await clientPromise;
  const collection = client.db().collection(collectionName);

  try {
    // Create the collection with the schema validation rules
    await collection.createIndex({ email: 1 }, { unique: true });

    await collection.createIndex({ userName: 1 }, { unique: true });

    const result = await collection.insertOne(document);
    return result.insertedId.toString();
  } catch (error) {
    throw error; // Re-throw so the caller can handle it specifically
  }
}

export async function readDocument(collectionName: string, id: string) {
  const client = await clientPromise;
  const collection = client.db().collection(collectionName);
  const document: any = await collection.findOne({ _id: new ObjectId(id) });
  if (document) {
    const { _id, ...rest } = document;
    return { _id: id, ...rest };
  } else {
    return null;
  }
}

export async function updateDocument(
  collectionName: string,
  id: string,
  document: any
) {
  try {
    const client = await clientPromise;
    const collection = client.db().collection(collectionName);
    console.log("trying to udpate", document);

    // Convert category to ObjectId if it exists
    if (document.category) {
      document.category = new ObjectId(document.category);
    }
    const { _id, ...update } = document;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    console.log(result);
    return result.modifiedCount;
  } catch (e) {
    console.log("failed at update", e);
  }
}

export async function updateEventArrays(userId: string, eventId: string) {
  // Convert eventId to ObjectId format
  const objectId = new ObjectId(eventId);

  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);

  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  // Update the recent_events array
  let recent_events = user.recent_events || [];
  const index = recent_events.findIndex(
    (event) => event._id.toString() === eventId
  );
  if (index !== -1) {
    recent_events.splice(index, 1);
  }
  recent_events.push({ _id: objectId, timestamp: Date.now() });
  if (recent_events.length > 10) {
    recent_events = recent_events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  }

  // Check if event is in registered_events and wishlisted_events
  const registered = (user.registered_events || []).some(
    (event) => event._id.toString() === eventId
  );
  const wishListed = (user.wishlisted_events || []).some(
    (event) => event._id.toString() === eventId
  );

  // Save the updated user document
  const result = await updateDocument("user", userId, {
    ...user,
    recent_events,
  });
  console.log(`Updated ${result} document(s)`);

  return { registered, wishListed };
}

export async function updateProductArrays(userId: string, productId: string) {
  // Convert productId to ObjectId format
  const objectId = new ObjectId(productId);

  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);

  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  // Update the recent_events array
  let recent_products = user.recent_products || [];
  const index = recent_products.findIndex(
    (product) => product._id.toString() === productId
  );
  if (index !== -1) {
    recent_products.splice(index, 1);
  }
  recent_products.push({ _id: objectId, timestamp: Date.now() });
  if (recent_products.length > 10) {
    recent_products = recent_products
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  }

  // Check if event is in registered_events and wishlisted_events
  const wishListed = (user.wishlisted_products || []).some(
    (product) => product._id.toString() === productId
  );

  // Save the updated user document
  const result = await updateDocument("user", userId, {
    ...user,
    recent_products,
  });
  console.log(`Updated ${result} document(s)`);

  return { wishListed };
}

export async function wishlistEvent(userId: string, eventId: string) {
  // Convert string IDs to MongoDB ObjectIDs
  const objectId = new ObjectId(eventId);

  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);
  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  let wishlisted_events = user.wishlisted_events || [];

  // Check if the event is already in the wishlist
  const isPresent = wishlisted_events?.some(
    (event) => event._id.toString() === eventId
  );
  if (isPresent) {
    // If the event is already in the wishlist, remove it
    wishlisted_events = wishlisted_events.filter(
      (event) => !event._id.equals(objectId)
    );
  } else {
    // If the event is not in the wishlist, add it
    wishlisted_events.push({ _id: objectId, timestamp: Date.now() });
  }

  // Update the user document
  const result = await updateDocument("user", userId, {
    wishlisted_events: wishlisted_events,
  });
  console.log(`Updated ${result} document(s)`);

  // Return whether the event is now in the wishlist
  return !isPresent;
}

export async function wishlistProduct(userId: string, productId: string) {
  // Convert string IDs to MongoDB ObjectIDs
  const objectId = new ObjectId(productId);

  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);
  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  let wishlisted_products = user.wishlisted_products || [];

  // Check if the event is already in the wishlist
  const isPresent = wishlisted_products?.some(
    (product) => product._id.toString() === productId
  );
  if (isPresent) {
    // If the event is already in the wishlist, remove it
    wishlisted_products = wishlisted_products.filter(
      (product) => !product._id.equals(objectId)
    );
  } else {
    // If the event is not in the wishlist, add it
    wishlisted_products.push({ _id: objectId, timestamp: Date.now() });
  }

  // Update the user document
  const result = await updateDocument("user", userId, {
    wishlisted_products: wishlisted_products,
  });
  console.log(`Updated ${result} document(s)`);

  // Return whether the event is now in the wishlist
  return !isPresent;
}

export async function addToCartProduct(
  userId: string,
  productId: string,
  quantity: number
) {
  // Convert string IDs to MongoDB ObjectIDs
  const objectId = new ObjectId(productId);

  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);
  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  // Fetch the product document
  const product: Product | null | undefined = await getDocument(
    "Products",
    productId
  );
  // Check if product exists
  if (!product) {
    throw new Error(`Product with id ${productId} not found`);
  }

  // Check if product is out of stock
  if (product.stock === undefined || product.stock < quantity) {
    // Add a toast notification
    // toast("Product is out of stock", {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   // pauseOnHover: true,
    //   // draggable: true,
    //   progress: undefined,
    // });
    throw new Error(`Product with id ${productId} is out of stock`);
  }

  let add_to_cart_products = user.add_to_cart_products || [];

  // Check if the product is already in the cart
  const productInCart = add_to_cart_products?.find(
    (product) => product._id.toString() === productId
  );
  if (productInCart) {
    // If the product is already in the cart, update the quantity
    productInCart.quantity = quantity;

    // If the updated quantity is 0, remove the product from the cart
    if (productInCart.quantity === 0) {
      add_to_cart_products = add_to_cart_products.filter(
        (product) => product._id.toString() !== productId
      );
    }
  } else {
    // If the product is not in the cart and the quantity is not 0, add it
    if (quantity !== 0) {
      add_to_cart_products.push({
        _id: objectId,
        quantity,
        timestamp: Date.now(),
      });
    }
  }
  // Update the user document
  const result = await updateDocument("user", userId, {
    add_to_cart_products: add_to_cart_products,
  });
  console.log(`Updated ${result} document(s)`);

  // Return whether the product is now in the cart
  return productInCart;
}

export async function getUserCartData2(userId: string) {
  const client = await clientPromise;
  const userCollection = client.db().collection("user");
  const productCollection = client.db().collection("Products");

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  if (user && user.add_to_cart_products) {
    const productIds = user.add_to_cart_products.map(
      (product: any) => new ObjectId(product._id)
    );
    const products = await productCollection
      .find({ _id: { $in: productIds } })
      .toArray();

    const cartProducts = products.map((product: any) => ({
      ...product,
      _id: product._id.toString(),
      // quantity: user.add_to_cart_products.find((p: any) => p._id === product._id.toString())?.quantity ??0,
    }));

    return cartProducts;
  } else {
    return null;
  }
}

export const getUserCartData = async (userId: string) => {
  try {
    const client = await clientPromise;
    const usersCollection = client.db().collection("user");
    const productsCollection = client.db().collection("Products");

    // Find the user document by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return { error: "User not found" };
    }

    // Get the products in the user's cart
    const cartProducts = user.add_to_cart_products;

    if (!cartProducts) {
      console.log(`User with id ${userId} has no products in cart`);
      return [];
    }

    // Fetch the product details for each product in the cart
    const cartProductsData = await Promise.all(
      cartProducts.map(async (cartProduct: CartProduct) => {
        const product = await productsCollection.findOne({
          _id: cartProduct._id,
        });

        if (!product) {
          return { error: "Product not found", productId: cartProduct._id };
        }

        return {
          ...product,
          quantity: cartProduct.quantity,
        };
      })
    );

    return cartProductsData;
  } catch (error) {
    console.error("Error fetching user cart data:", error);
    return { error: "An error occurred while fetching user cart data" };
  }
};

export async function registerEvent(userId: string, eventId: string) {
  // Convert string IDs to MongoDB ObjectIDs
  const objectId = new ObjectId(eventId);

  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);
  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  let registered_events = user.registered_events || [];

  // Check if the event is already registered
  const isPresent = registered_events?.some(
    (event) => event._id.toString() === eventId
  );
  if (isPresent) {
    // If the event is already registered, do nothing
    return false;
  } else {
    // If the event is not registered, add it
    registered_events.push({ _id: objectId, timestamp: Date.now() });

    // Check if the event is in the wishlist
    let wishlisted_events = user.wishlisted_events || [];
    const isWishlisted = wishlisted_events?.some(
      (event) => event._id.toString() === eventId
    );
    if (isWishlisted) {
      // If the event is in the wishlist, remove it
      wishlisted_events = wishlisted_events.filter(
        (event) => !event._id.equals(objectId)
      );
    }

    // Update the user document
    const result = await updateDocument("user", userId, {
      registered_events: registered_events,
      wishlisted_events: wishlisted_events,
    });
    console.log(`Updated ${result} document(s)`);
  }

  // Return true to indicate that the event is now registered
  return true;
}

export async function getUserEventsWithDetails(userId: string) {
  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);
  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  // Connect to MongoDB
  const client = await clientPromise;
  const collection = client.db().collection("events");

  // Define a helper function to fetch and sort events
  const fetchAndSortEvents = async (
    eventIds: ObjectId[],
    eventName: string
  ) => {
    // Perform the "join"
    const events = await collection
      .aggregate([
        {
          $match: {
            _id: { $in: eventIds },
            eventDateTime: { $gt: new Date() },
          },
        }, // Only match future events
        {
          $lookup: {
            from: "user",
            let: { event_id: "$_id" },
            pipeline: [
              { $match: { _id: new ObjectId(userId) } },
              { $unwind: `$${eventName}` },
              {
                $match: { $expr: { $eq: [`$${eventName}._id`, "$$event_id"] } },
              },
              { $project: { timestamp: `$${eventName}.timestamp`, _id: 0 } },
            ],
            as: eventName,
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "creatorId",
            foreignField: "_id",
            as: "creator",
          },
        },
        { $unwind: `$${eventName}` },
        { $unwind: "$creator" },
        {
          $project: {
            creatorName: "$creator.name",
            creatorId: 1,
            _id: 1,
            [eventName]: 1,
            description: 1,
            duration: 1,
            eventDateTime: 1,
            eventImageUrl: 1,
            eventName: 1,
            event_count: 1,
            fees: 1,
            organizedBy: 1,
            type: 1,
          },
        },
      ])
      .toArray();

    // Convert ObjectId's to strings and sort events
    return events
      .map((event) => ({
        ...event,
        _id: event._id.toString(),
        creatorId: event.creatorId.toString(),
        creatorName: event.creatorName,
      }))
      .sort(
        (a, b) =>
          b[eventName as keyof typeof b].timestamp -
          a[eventName as keyof typeof a].timestamp
      );
  };

  let recent_events = user.recent_events || [];
  let registered_events = user.registered_events || [];
  let wishlisted_events = user.wishlisted_events || [];

  // Fetch and sort recent, registered, and wishlisted events
  const recentEvents = await fetchAndSortEvents(
    recent_events.map((event) => event._id),
    "recent_events"
  );
  const registeredEvents = await fetchAndSortEvents(
    registered_events.map((event) => event._id),
    "registered_events"
  );
  const wishlistedEvents = await fetchAndSortEvents(
    wishlisted_events.map((event) => event._id),
    "wishlisted_events"
  );

  return { recentEvents, registeredEvents, wishlistedEvents };
}

export async function getUserProductsWithDetails(userId: string) {
  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);
  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  // Connect to MongoDB
  const client = await clientPromise;
  const collection = client.db().collection("Products");

  // Define a helper function to fetch and sort events
  const fetchAndSortEvents = async (
    // eventIds: ObjectId[],
    itemName: string
  ) => {
    // Perform the "join"
    const products = await collection
      .aggregate([
        // {
        //   $match: {
        //     _id: { $in: eventIds },
        //     eventDateTime: { $gt: new Date() },
        //   },
        // }, // Only match future events
        {
          $lookup: {
            from: "user",
            let: { product_id: "$_id" },
            pipeline: [
              { $match: { _id: new ObjectId(userId) } },
              { $unwind: `$${itemName}` },
              {
                $match: {
                  $expr: { $eq: [`$${itemName}._id`, "$$product_id"] },
                },
              },
              { $project: { timestamp: `$${itemName}.timestamp`, _id: 0 } },
            ],
            as: itemName,
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "sellerId",
            foreignField: "_id",
            as: "seller",
          },
        },
        { $unwind: `$${itemName}` },
        { $unwind: "$seller" },
        {
          $project: {
            sellerName: "$seller.name",
            sellerId: 1,
            _id: 1,
            [itemName]: 1,
            description: 1,
            category: 1,
            discount: 1,
            paymentMethod: 1,
            nFTLink: 1,
            productImage: 1,
            itemName: 1,
            product_views: 1,
            price: 1,
            // organizedBy: 1,
            // type: 1,
          },
        },
      ])
      .toArray();

    // Convert ObjectId's to strings and sort events
    return products
      .map((product) => ({
        ...product,
        _id: product._id.toString(),
        sellerId: product.sellerId.toString(),
        sellerName: product.sellerName,
      }))
      .sort(
        (a, b) =>
          b[itemName as keyof typeof b].timestamp -
          a[itemName as keyof typeof a].timestamp
      );
  };

  let recent_products = user.recent_products || [];
  // let registered_events = user.registered_events || [];
  let wishlisted_products = user.wishlisted_products || [];

  // Fetch and sort recent, registered, and wishlisted events
  const recentProducts = await fetchAndSortEvents(
    // recent_products.map((product) => product._id),
    "recent_products"
  );
  // const registeredEvents = await fetchAndSortEvents(
  //   registered_events.map((event) => event._id),
  //   "registered_events"
  // );
  const wishlistedProducts = await fetchAndSortEvents(
    // wishlisted_products.map((product) => product._id),
    "wishlisted_products"
  );
  console.log(wishlistedProducts, " wishlisted products");
  return { recentProducts, wishlistedProducts };
}

// export async function getUserCartDetails(userId: string) {
//   // Fetch the user document
//   const user = await getDocument("user", userId);

//   // Check if user exists
//   if (!user) {
//     throw new Error(`User with id ${userId} not found`);
//   }

//   // Connect to MongoDB
//   const client = await clientPromise;
//   const collection = client.db().collection("Products");

//   // Define a helper function to fetch and sort products
//   const fetchAndSortProducts = async (itemName: string) => {
//     // Perform the "join"
//     const products = await collection
//       .aggregate([
//         {
//           $lookup: {
//             from: "user",
//             let: { product_id: "$_id" },
//             pipeline: [
//               { $match: { _id: new ObjectId(userId) } },
//               { $unwind: `$${itemName}` },
//               {
//                 $match: { $expr: { $eq: [`$${itemName}._id`, "$$product_id"] } },
//               },
//               { $project: { quantity: `$${itemName}.quantity`, _id: 0 } },
//             ],
//             as: itemName,
//           },
//         },
//         { $unwind: `$${itemName}` },
//         {
//           $project: {
//             _id: 1,
//             itemName: 1,
//             description: 1,
//             category: 1,
//             quantity: `$${itemName}.quantity`,
//           },
//         },
//       ])
//       .toArray();

//     // Convert ObjectId's to strings and sort products
//     return products
//       .map((product) => ({
//         ...product,
//         _id: product._id.toString(),
//         quantity: product[itemName].quantity,
//       }))
//       .sort((a, b) => b.quantity - a.quantity);
//   };

//   let cartProducts = user.cart_products || [];

//   // Fetch and sort cart products
//   const fetchedCartProducts = await fetchAndSortProducts("cart_products");

//   return { cartProducts: fetchedCartProducts };
// }

export async function getRecentEventsWithDetails(userId: string) {
  // Fetch the user document
  const user: User | null | undefined = await getDocument("user", userId);
  // Check if user exists
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  let recentEvents = user.recent_events || [];

  // Convert string IDs to MongoDB ObjectIDs
  const objectIds = recentEvents.map((event) => event._id);

  // Connect to MongoDB
  const client = await clientPromise;
  const collection = client.db().collection("events");

  // Perform the "join"
  const events = await collection
    .aggregate([
      { $match: { _id: { $in: objectIds } } },
      {
        $lookup: {
          from: "user",
          let: { event_id: "$_id" },
          pipeline: [
            { $match: { _id: new ObjectId(userId) } },
            { $unwind: "$recent_events" },
            {
              $match: { $expr: { $eq: ["$recent_events._id", "$$event_id"] } },
            },
            { $project: { timestamp: "$recent_events.timestamp", _id: 0 } },
          ],
          as: "recent_event",
        },
      },
      { $unwind: "$recent_event" },
    ])
    .toArray();

  // Convert ObjectId's to strings
  const eventsWithStrings = events.map((event) => ({
    ...event,
    _id: event._id.toString(),
    creatorId: event.creatorId.toString(),
  }));

  return eventsWithStrings;
}

export async function updateUserEventsDocument(
  collectionName: string,
  id: string,
  document: any
) {
  try {
    const client = await clientPromise;
    const collection = client.db().collection(collectionName);
    console.log("trying to udpate");
    console.log(id, "id");
    console.log(document, "document");
    // const { _id, ...update } = document;

    // const result = await collection.updateOne(
    //   { _id: new ObjectId(id) },
    //   { $set: update }
    // );
    // return result.modifiedCount;
  } catch (e) {
    console.log("failed at update", e);
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  const client = await clientPromise;
  const collection = client.db().collection(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
}

export async function placingOrder(
  document: OrderDetails,
  couponApplied: boolean,
  couponCode: string
) {
  let collectionName = "Orders";
  const client = await clientPromise;
  const collection = client.db().collection(collectionName);

  console.log("Placing order");
  console.log(document);
  const timestamp = Date.now().toString();
  let orderDetails = {
    subtotal: document.subtotal,
    shippingEstimate: document.shippingEstimate,
    tax: document.taxEstimate,
    total: document.total,
    userId: new ObjectId(document.userId),
    phoneNumber: document.phoneNumber,
    email: document.email,
    address: document.address,
    paymentDetails: document.isCOD ? null : document.paymentDetails,
    shiprocketOrder: document.shiprocketOrder,
    timestamp: timestamp,
    orderedProduct: document.orderedProduct.map((product) => ({
      category: product.category,
      description: product.description,
      itemName: product.itemName,
      nFTLink: product.nFTLink,
      paymentMethod: product.paymentMethod,
      price: product.price,
      productImage: product.productImage,
      quantity: product.quantity,
      sellerId: new ObjectId(product.sellerId),
      productId: new ObjectId(product._id),
    })),
    couponApplied: couponApplied,
    couponCode: couponCode,
    isCOD: document.isCOD,
    deliveryType: document.deliveryType,
    deliveryPartnerDetails: document.deliveryPartnerDetails,
  };
  console.log(orderDetails, "orderDetails");

  if (couponApplied) {
    const couponsCollection = client.db().collection("Coupons");
    try {
      const userId = new ObjectId(document.userId);
      const coupon = await couponsCollection.findOne({
        coupon_code: couponCode,
      });
      if (!coupon) throw new Error("Coupon not found");
      let userCouponUsage = coupon.used_by.find((usage: any) =>
        usage.userId.equals(userId)
      );
      if (userCouponUsage) {
        // If user exists in used_by, increment count
        await couponsCollection.updateOne(
          { _id: coupon._id, "used_by.userId": userId },
          { $inc: { "used_by.$.count": 1 } }
        );
      } else {
        // If user does not exist in used_by, add new entry
        await couponsCollection.updateOne(
          { _id: coupon._id },
          { $push: { used_by: { userId: userId, count: 1 } } }
        );
      }
      await couponsCollection.updateOne(
        { _id: coupon._id },
        {
          $inc: {
            claims_left: -1,
            claimed: +1,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  try {
    // Create the collection with the schema validation rules
    const result = await collection.insertOne(orderDetails);
    console.log(result);

    // After successfully placing the order, empty the add_to_cart_products for the user
    const usersCollection = client.db().collection("user"); // Assuming "Users" is the name of your users collection
    await usersCollection.updateOne(
      { _id: new ObjectId(document.userId) },
      { $set: { add_to_cart_products: [] } }
    );
    console.log(`Cleared add_to_cart_products for user ${document.userId}`);

    // Update the stock of the ordered products in the Product collection
    const productsCollection = client.db().collection("Products"); // Assuming "Product" is the name of your products collection
    for (const product of orderDetails.orderedProduct) {
      await productsCollection.updateOne(
        { _id: product.productId },
        {
          $inc: {
            stock: -product.quantity, // Decrement the stock by the ordered quantity
            sales: +product.quantity, // Increment the sales by the ordered quantity
          },
        }
      );
    }
    console.log("Updated product stock based on the order.");

    return {
      status: 200,
      message: "Order placed successfully",
    };
  } catch (error) {
    console.log(error, "error");
    return {
      status: 500,
      message: "Error placing order",
      // error: error,
    };
  }
}

export async function getOrdersData(userId: string) {
  const client = await clientPromise;
  const collection = client.db().collection("Orders");

  const orders = await collection
    .find({ userId: new ObjectId(userId) })
    .toArray();
  const ordersWithStringId = orders.map((order) => {
    const orderedProduct = order.orderedProduct.map(
      (product: ProductDetails) => ({
        ...product,
        _id: product.productId.toString(),
        sellerId: product.sellerId.toString(),
        // Ensure productId is a string if it's not already
        productId: product.productId.toString(),
      })
    );
    return {
      ...order,
      _id: order._id.toString(),
      userId: order.userId.toString(),
      orderedProduct,
      // Ensure any complex objects in `address` and `paymentDetails` are also converted to plain objects or strings
      address: {
        ...order.address,
        // Convert any complex objects within address to strings or simpler objects here
      },
      paymentDetails: {
        ...order.paymentDetails,
        // Convert any complex objects within paymentDetails to strings or simpler objects here
      },
    };
  });

  console.log(ordersWithStringId, "Orders");

  console.log(ordersWithStringId, "Orders");

  return ordersWithStringId;
}

export async function createRazorPayOrder(amount: number, currency: string) {
  var options = {
    amount: amount * 100,
    currency: currency,
    receipt: "rcp1",
  };
  const order = await razorpay.orders.create(options);
  console.log(order);
  return order;
}

export async function getProductsBySeller(sellerId: string) {
  const client = await clientPromise;
  const collection = client.db().collection("Products");
  const sellerObjectId = new ObjectId(sellerId); // Convert sellerId to ObjectId if necessary
  const productsCursor = collection.find({ sellerId: sellerObjectId });
  const products = await productsCursor.toArray();
  return products.map((product) => {
    const { _id, ...rest } = product;
    return { _id: _id.toString(), ...rest }; // Convert _id to string for each product
  });
}

export async function getOrderDetails(id: string) {
  const client = await clientPromise;
  const collection = client.db().collection("Orders");
  const document: any = await collection.findOne({ _id: new ObjectId(id) });
  if (document) {
    // Convert _id and userId to string
    const { _id, userId, orderedProduct, ...rest } = document;
    const modifiedOrderedProduct = orderedProduct.map((product: any) => {
      const { sellerId, productId, ...productRest } = product;
      // Convert sellerId and productId within each orderedProduct to string
      return {
        ...productRest,
        sellerId: sellerId.toString(),
        productId: productId.toString(),
      };
    });
    // console.log(
    //   {
    //     _id: _id.toString(),
    //     userId: userId.toString(),
    //     orderedProduct: modifiedOrderedProduct,
    //     ...rest,
    //   },
    //   "Data"
    // );
    return {
      _id: _id.toString(),
      userId: userId.toString(),
      orderedProduct: modifiedOrderedProduct,
      ...rest,
    };
  } else {
    return null;
  }
}

export async function CreateCoupon(document: Coupon, sellerId: string) {
  const client = await clientPromise;
  const collection = client.db().collection("Coupons");

  let couponData = {
    sellerId: new ObjectId(sellerId),
    coupon_type: document.coupon_type,
    coupon_code: document.coupon_code,
    terms_and_conditions: document.terms_and_conditions,
    claims_left: document.claims,
    claimed: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    usage_per_user: document.usage_per_user,
    issue_date: document.issue_date,
    expiry_date: document.expiry_date,
    minimum_purchase: document.minimum_purchase,
    free_shipping: document.free_shipping,
    discount_amount: document.discount_amount,
    discount_type: document.discount_type,
    max_discount: document.max_discount,
    applicable_categories: document.applicable_categories,
    applicable_products: document.applicable_products,
    used_by: [],
  };
  console.log(couponData);
  try {
    // Ensure the collection has the unique index on coupon_code
    await collection.createIndex({ coupon_code: 1 }, { unique: true });

    // Check if a coupon with the same code already exists
    const existingCoupon = await collection.findOne({
      coupon_code: document.coupon_code,
    });
    if (existingCoupon) {
      // Handle the case where the coupon code already exists
      let response = {
        status: "409",
        error: `A coupon with the code ${document.coupon_code} already exists.`,
      };
      return response;
    }
    // If no existing coupon is found, insert the new coupon
    const result = await collection.insertOne(couponData);
    return result.insertedId.toString();
  } catch (error) {
    throw error; // Re-throw so the caller can handle it specifically
  }
}

export async function getCouponsOfSeller(sellerID: string) {
  try {
    const client = await clientPromise;
    const collectionData = client.db().collection("Coupons");

    // Create a filter to find coupons associated with the given sellerID
    const filter = { sellerId: new ObjectId(sellerID) };
    // Fetch the coupons from the database
    const coupons = await collectionData.find(filter).toArray();
    const couponsData = coupons.map((coupon) => ({
      ...coupon,
      _id: coupon._id.toString(),
      sellerId: coupon.sellerId.toString(),
      // Convert any other ObjectId fields if necessary
    }));
    console.log("Coupons", couponsData);
    return couponsData; // Return the found coupons
  } catch (e) {
    console.log("Failed for MongoDB", e);
    throw e; // It's better to throw the error so the caller can handle it
  }
}

export async function getCouponById(couponId: string) {
  try {
    const client = await clientPromise;
    const collection = client.db().collection("Coupons");

    // Create a filter to find the coupon by its _id
    const filter = { _id: new ObjectId(couponId) };
    // Fetch the coupon from the database
    const coupon = await collection.findOne(filter);

    if (!coupon) {
      console.log(`No coupon found with _id: ${couponId}`);
      return null; // Or throw an error, depending on your error handling strategy
    }

    // Convert ObjectId fields to string for easier handling
    const couponData = {
      ...coupon,
      _id: coupon._id.toString(),
      sellerId: coupon.sellerId.toString(),
      // Convert any other ObjectId fields if necessary
    };

    console.log("Coupon", couponData);
    return couponData; // Return the found coupon
  } catch (e) {
    console.log("Failed to fetch coupon from MongoDB", e);
    throw e; // It's better to throw the error so the caller can handle it
  }
}

export async function updateCoupon(couponId: string, updateData: object) {
  try {
    const client = await clientPromise;
    const collection = client.db().collection("Coupons");

    // Create a filter to find the coupon by its _id
    const filter = { _id: new ObjectId(couponId) };
    // Update the coupon in the database
    const updateResult = await collection.updateOne(filter, {
      $set: updateData,
    });

    if (updateResult.matchedCount === 0) {
      console.log(`No coupon found with _id: ${couponId}`);
      return null; // Or throw an error, depending on your error handling strategy
    }

    console.log(`Coupon updated successfully: ${couponId}`);
    return updateResult; // Return the result of the update operation
  } catch (e) {
    console.log("Failed to update coupon in MongoDB", e);
    throw e; // It's better to throw the error so the caller can handle it
  }
}

export async function deleteCouponById(couponId: string) {
  try {
    const client = await clientPromise;
    const collection = client.db().collection("Coupons");

    // Convert the string ID to an ObjectId and delete the coupon
    const result = await collection.deleteOne({ _id: new ObjectId(couponId) });

    if (result.deletedCount === 1) {
      console.log(`Successfully deleted coupon with _id: ${couponId}`);
      return {
        status: 200,
        message: `Successfully deleted coupon`,
      };
    } else {
      console.log(`No coupon found with _id: ${couponId}`);
      throw new Error(`No coupon found with _id: ${couponId}`);
    }
  } catch (e) {
    console.error("Error deleting coupon:", e);
    throw e; // It's better to throw the error so the caller can handle it
  }
}

export async function getOrdersBySellerID(
  collectionName: string,
  sellerID: string
) {
  try {
    const client = await clientPromise;
    const collection = client.db().collection(collectionName);

    const query = {
      orderedProduct: {
        $elemMatch: {
          sellerId: new ObjectId(sellerID),
        },
      },
    };

    const documents = await collection.find(query).toArray();

    if (documents.length > 0) {
      return documents.map((document) => {
        const { _id, ...rest } = document;
        return { _id: _id.toString(), ...rest };
      });
    } else {
      return [];
    }
  } catch (e) {
    console.log("Failed at getOrdersBySellerID", e);
    return null; // or throw an error depending on your error handling strategy
  }
}

export async function addCategory(categoryName: string, categoryImage: string) {
  const client = await clientPromise;
  const collection = client.db().collection("category");

  // Convert the category name to lower case
  const lowerCaseCategoryName = categoryName.toLowerCase();

  try {
    // Check if a category with the same name already exists
    const existingCategory = await collection.findOne({
      name: lowerCaseCategoryName,
    });

    if (existingCategory) {
      return {
        status: 409,
        error: "A category with this name already exists",
      };
    }

    // If not, insert the new category
    const result = await collection.insertOne({
      name: lowerCaseCategoryName,
      categoryImage: categoryImage,
    });

    return result.insertedId.toString();
  } catch (error) {
    throw error; // Re-throw so the caller can handle it specifically
  }
}

export async function editCategory(categoryId: string, updateData: any) {
  const client = await clientPromise;
  const collection = client.db().collection("category");

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(categoryId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      throw new Error(`Category with id ${categoryId} not found or no changes made`);
    }

    return {
      status: 200,
      message: "Category updated successfully",
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      status: 500,
      message: `Error updating category ${error}`,
    };
  }
}

export async function getProductsByCategoriesAndSeller(
  categories: string[],
  sellerId: string
) {
  const client = await clientPromise;
  const collection = client.db().collection("Products");

  try {
    // Convert categories to ObjectId array
    const categoryObjectIds = categories.map(
      (category) => new ObjectId(category)
    );
    // Convert sellerId to ObjectId
    const sellerObjectId = new ObjectId(sellerId);

    // Query to find products by categories and sellerId
    const query = {
      category: { $in: categoryObjectIds },
      sellerId: sellerObjectId,
    };

    const products = await collection.find(query).toArray();

    // Convert ObjectId fields to strings for the response
    const productsWithConvertedIds = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      category: product.category.toString(),
      sellerId: product.sellerId.toString(),
    }));

    return productsWithConvertedIds;
  } catch (error) {
    console.error("Error fetching products by categories and sellerId:", error);
    throw error; // Re-throw so the caller can handle it
  }
}

export async function getProductsByCategory(category: string) {
  const client = await clientPromise;
  const collection = client.db().collection("Products");

  try {
    // Convert category to ObjectId
    const categoryObjectId = new ObjectId(category);

    // Query to find products by category
    const query = {
      category: categoryObjectId,
    };

    const products = await collection.find(query).toArray();

    // Convert ObjectId fields to strings for the response
    const productsWithConvertedIds = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      category: product.category.toString(),
      // Assuming products have sellerId, convert it as well
      sellerId: product.sellerId ? product.sellerId.toString() : null,
    }));

    return productsWithConvertedIds;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error; // Re-throw so the caller can handle it
  }
}

export async function ApplyCoupon(
  coupon_code: String,
  cart: any[],
  user_id: string
) {
  const client = await clientPromise;
  console.log(user_id, "User id");
  const userId = new ObjectId(user_id);
  const couponsCollection = client.db().collection("Coupons");
  const productsCollection = client.db().collection("Products");
  try {
    // Find the coupon by code
    const coupon = await couponsCollection.findOne({
      coupon_code: coupon_code,
    });
    if (!coupon)
      return {
        status: 404,
        error: "Coupon not found",
      };

    // Check if the coupon is expired or has no claims left
    const currentDate = new Date();
    if (new Date(coupon.expiry_date) < currentDate) {
      return {
        status: 400,
        error: "Coupon has expired",
      };
    }

    if (new Date(coupon.issue_date) > currentDate) {
      return {
        status: 400,
        error: "Coupon not activated yet",
      };
    }

    if (coupon.claims_left <= 0) {
      return {
        status: 400,
        error: "Coupon has been already claimed",
      };
    }
    // Calculate total cart value
    const cartValue = await calculateCartValue(cart, productsCollection);

    // Check minimum purchase requirement
    if (cartValue < coupon.minimum_purchase) {
      return {
        status: 400,
        error: "Minimum purchase requirement not met",
      };
    }

    let userCouponUsage = coupon.used_by.find((usage: any) =>
      usage.userId.equals(userId)
    );

    if (userCouponUsage) {
      // If user exists in used_by, increment count
      if (userCouponUsage.count >= coupon.usage_per_user) {
        return {
          status: 400,
          error: "Coupon has been already claimed by the user",
        };
      }
    }

    // Check if the coupon applies to the products/categories in the cart
    const isApplicable = await checkCouponApplicability(
      coupon,
      cart,
      productsCollection
    );
    if (!isApplicable) {
      return {
        status: 400,
        error: "Coupon does not apply to the items in your cart",
      };
    }

    // If all checks pass, return true indicating the coupon is applicable
    return {
      status: 200,
      coupon,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      error: "An error occurred while applying the coupon",
    }; // Or you could return the error message for more detailed feedback
  }
}

async function calculateCartValue(cart: any[], productsCollection: any) {
  let total = 0;
  for (const item of cart) {
    const product = await productsCollection.findOne({
      _id: new ObjectId(item._id),
    });
    if (product) {
      total += product.price * item.quantity; // Assuming each product document has a price field
    }
  }
  return total;
}

async function checkCouponApplicability(
  coupon: any,
  cart: any[],
  productsCollection: any
) {
  if (
    coupon.applicable_products.length === 0 &&
    coupon.applicable_categories.length === 0
  ) {
    // Coupon is applicable to all products
    return true;
  }

  for (const item of cart) {
    const product = await productsCollection.findOne({
      _id: new ObjectId(item._id),
    });
    if (product) {
      // Check if product is in applicable_products or its category is in applicable_categories
      if (
        coupon.applicable_products.includes(item._id) ||
        coupon.applicable_categories.includes(product.category.toString())
      ) {
        return true;
      }
    }
  }

  return false; // No products in the cart match the coupon's criteria
}

export async function addReviewToProduct(
  productId: string,
  userId: string,
  rating: number,
  comment: string
) {
  const client = await clientPromise;
  const collection = client.db().collection("Products");

  const review = {
    userId: new ObjectId(userId),
    rating: rating,
    comment: comment,
    createdAt: new Date(),
  };

  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(productId) },
      { $push: { reviews: review } }
    );

    if (result.modifiedCount === 1) {
      return { success: true, message: "Review added successfully" };
    } else {
      return { success: false, message: "Failed to add review" };
    }
  } catch (error) {
    console.error("Error adding review:", error);
    return {
      success: false,
      message: "An error occurred while adding the review",
    };
  }
}
