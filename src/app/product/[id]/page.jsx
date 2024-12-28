"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductImageSlider } from "./ProductImageSlider";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Search,
  Star,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Send,
  User,
} from "lucide-react";
import {
  getUserData,
  updateDocument,
  getDocument,
  getProductData,
  updateProductArrays,
  wishlistProduct,
  addToCartProduct,
  addReviewToProduct,
} from "@/src/utils/get-url";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

export default function ProductDetailPage(props) {
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSpecifications, setShowSpecifications] = useState(false);
  const [product, setProduct] = useState(null);
  const [wishListed, setWishListed] = useState(false);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [averageRating, setAverageRating] = useState(0);

  const router = useRouter();

  const fetchData = async () => {
    const id = props.params.id;
    const user_id = localStorage.getItem("id");
    if (localStorage.getItem("id")) {
      const { wishListed } = await updateProductArrays(user_id, id);
      setWishListed(wishListed);
    }

    const productData = await getProductData(id);
    if (productData) {
      setProduct(productData);
      setSeller(await getUserData(productData.sellerId));
      setReviews(productData.reviews || []);

      // Calculate average rating
      if (productData.reviews && productData.reviews.length > 0) {
        const totalRating = productData.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating(totalRating / productData.reviews.length);
      }
    }

    let product_views = productData.product_views;
    product_views++;

    const updatedProduct = await updateDocument("Products", id, {
      product_views,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddReview = async () => {
    if (!localStorage.getItem("id")) {
      router.push("/signin");
      return;
    }

    const userId = localStorage.getItem("id");
    const result = await addReviewToProduct(
      props.params.id,
      userId,
      newReview.rating,
      newReview.comment
    );

    if (result.success) {
      toast("Review added successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      });
      fetchData();
      setNewReview({ rating: 0, comment: "" });
    } else {
      toast.error("Failed to add review. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      });
    }
  };

  const handleWishList = async () => {
    const id = props.params.id;
    if (localStorage.getItem("id")) {
      const user_id = localStorage.getItem("id");
      const data = await wishlistProduct(user_id, id);
      setWishListed(data);
    } else router.push("/signin");
  };

  const handleAddToCartList = async () => {
    const id = props.params.id;
    if (localStorage.getItem("id")) {
      const user_id = localStorage.getItem("id");
      const data = await addToCartProduct(user_id, id, quantity);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      toast("Cart updated!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      });
    } else router.push("/signin");
  };

  const StockStatus = ({ stock }) => {
    if (stock === 0) {
      return <div className="text-red-500 font-bold">Out of Stock</div>;
    } else if (stock < 10) {
      return (
        <div className="text-yellow-500 font-bold">Hurry up, low stock!</div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      {product != null && (
        <div className=" mx-auto  bg-gray-100 min-h-screen">
          <div className="bg-white md:flex">
            <ProductImageSlider images={product.productImage} />
            {/* <div className="w-1/2"> */}
            <div className="col-xl-5 col-lg-6 mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
              <div className="bg-[#59af37] text-white font-semibold rounded-lg px-2 mr-4">
                  {/* <span className="off  ">  {product.mrp - product.price}  Off</span> */}
                  <span className={`off ${product.mrp === product.price ? 'hidden' : 'visible'}`}>
                      { product.mrp - product.price} Off
                    </span>
                  
                </div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Heart
                  className={`w-6 h-6 ${
                    wishListed ? "text-red-400" : "text-gray-400"
                  }`}
                  onClick={handleWishList}
                />
                <Share2
                  className="w-6 h-6 text-gray-400"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "WebSite Title",
                          url: window.location.href,
                        })
                        .then(() => {
                          toast("Thanks for sharing!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            progress: undefined,
                          });
                        })
                        .catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href).then(
                        () => {
                          toast("Link copied to clipboard!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            progress: undefined,
                          });
                        },
                        (err) => {
                          console.error("Failed to copy: ", err);
                        }
                      );
                    }
                  }}
                />
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold my-6">{product.itemName}</h1>

            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 line-through mr-2">
                Rs {product.mrp}
              </span>
              <span className="text-xl font-bold text-green-600">
                Rs {product.price}/-
              </span>
            </div>

            <StockStatus stock={product.stock} />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-1 text-xl"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-3 py-1 border-l border-r">{quantity}</span>
                <button
                  className="px-3 py-1 text-xl"
                  onClick={() => {
                    if (product.stock > quantity) {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
              <div className="product-details-content mb-30 wow fadeInRight delay-0-2s">
                 
                 
                {/* <p>
                  Sorem ipsum dolor sit amet consectetur adipiscing elit do
                  eiusmod tempor incididunt ut labore et dolore magna aliquauis
                  ipsum suspendisse ultrices gravida
                </p> */}
                 <ul className="category-tags pt-10">
                  <li>
                    <b>Category</b>
                    <span>:</span>
                    <a href="#"> {product.category}</a>
                    
                  </li>
                  <li>
                    <b>Tags</b>
                    <span>:</span>
                    <a href="#">Organic</a>
                  </li>
                </ul>
                
                <hr />
                {product.stock === 0 ? null : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  className="bg-orange-500 text-white py-2 rounded font-medium text-sm"
                  onClick={handleAddToCartList}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-green-500 text-white py-2 rounded font-medium text-sm"
                  onClick={() => {
                    if (product.stock >= quantity) {
                      handleAddToCartList();
                      if (localStorage.getItem("id")) {
                        router.push("/checkout");
                      } else router.push("/signin");
                    }
                  }}
                >
                  Buy Now
                </button>
              </div>
            )}
                 
                <hr />
               
              </div>
            </div>
            {/* </div> */}
          </div>
          <div className="p-4 bg-white w-full">
            {/* <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <div className="flex space-x-2">
                <Heart
                  className={`w-6 h-6 ${
                    wishListed ? "text-red-400" : "text-gray-400"
                  }`}
                  onClick={handleWishList}
                />
                <Share2
                  className="w-6 h-6 text-gray-400"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "WebSite Title",
                          url: window.location.href,
                        })
                        .then(() => {
                          toast("Thanks for sharing!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            progress: undefined,
                          });
                        })
                        .catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href).then(
                        () => {
                          toast("Link copied to clipboard!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            progress: undefined,
                          });
                        },
                        (err) => {
                          console.error("Failed to copy: ", err);
                        }
                      );
                    }
                  }}
                />
              </div>
            </div>

            <h1 className="text-xl font-bold mb-2">{product.itemName}</h1>

            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 line-through mr-2">
                Rs {product.mrp}
              </span>
              <span className="text-xl font-bold text-green-600">
                Rs {product.price}/-
              </span>
            </div>

            <StockStatus stock={product.stock} />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-1 text-xl"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-3 py-1 border-l border-r">{quantity}</span>
                <button
                  className="px-3 py-1 text-xl"
                  onClick={() => {
                    if (product.stock > quantity) {
                      setQuantity(quantity + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div> */}
            {/* {product.stock === 0 ? null : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  className="bg-orange-500 text-white py-2 rounded font-medium text-sm"
                  onClick={handleAddToCartList}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-green-500 text-white py-2 rounded font-medium text-sm"
                  onClick={() => {
                    if (product.stock >= quantity) {
                      handleAddToCartList();
                      if (localStorage.getItem("id")) {
                        router.push("/checkout");
                      } else router.push("/signin");
                    }
                  }}
                >
                  Buy Now
                </button>
              </div>
            )} */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-screen overflow-y-auto">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  className="prose lg:h-auto prose-sm max-w-none"
                >
                  {product.description}
                </ReactMarkdown>
              </div>
            </div>
            {console.log(product.specifications, "specifications")}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Specification</h2>
              <button
                className="text-blue-500 text-sm mt-2 flex items-center"
                onClick={() => setShowSpecifications(!showSpecifications)}
              >
                {showSpecifications ? "Hide" : "View"} Specifications
                {showSpecifications ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>
              {showSpecifications && (
                <table className="w-full mt-4 text-sm">
                  {/* <thead>
        <tr>
          <th className="border px-4 py-2 text-left">Key</th>
          <th className="border px-4 py-2 text-left">Value</th>
        </tr>
      </thead> */}
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{spec.key}</td>
                        <td className="border px-4 py-2">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Reviews</h2>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= newReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <textarea
                  placeholder="Add a comment?"
                  className="w-full bg-white rounded p-2 mb-2 text-sm"
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                ></textarea>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-full flex items-center text-sm"
                  onClick={handleAddReview}
                >
                  <Send className="w-4 h-4 mr-2" /> Send
                </button>
              </div>

              <div className=" flex m-6 w-full p-4  ">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4 w-[300px] ">
                    <div className="flex items-center mb-2">
                      <User className="w-8 h-8 text-gray-400 bg-gray-200 rounded-full p-1 mr-2" />
                      <div>
                        <h3 className="font-medium text-sm">
                          {review.userName}
                        </h3>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-xs text-gray-600">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
