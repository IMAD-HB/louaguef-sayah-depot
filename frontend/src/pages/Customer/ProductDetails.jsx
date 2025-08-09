import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../services/axios";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const customer = JSON.parse(localStorage.getItem("customerInfo"));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`/products/${id}`);
          setProduct(res.data);
          setError("");
        } catch (err) {
          setError("فشل في تحميل تفاصيل المنتج، حاول لاحقاً.");
        }
      };

      fetchProduct();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [id]);

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center my-16">
        <div className="w-12 h-12 border-4 border-cyan-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const price = product.prices?.[customer?.tier] || product.prices?.retail || 0;
  const image = product.image?.url;

  const descriptionLines = product.description
    ? Object.values(product.description).filter(Boolean)
    : [];

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => {
      const newQty = prev + amount;
      if (newQty < 1) return 1;
      if (newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price,
        image,
      },
      quantity
    );
    toast.success("✅ تمت إضافة المنتج إلى السلة");
  };

  return (
    <div className="max-w-3xl mx-auto bg-cyan-50 p-6 rounded-lg shadow-md">
      <img
        src={image}
        alt={product.name}
        className="w-full h-64 object-contain mb-6 rounded"
      />
      <h2 className="text-3xl font-bold text-cyan-700 mb-3">{product.name}</h2>
      <p className="text-xl text-cyan-800 font-semibold mb-6">{price} د.ج</p>

      {/* الكمية */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-cyan-800 font-semibold text-lg">الكمية:</span>
        <div className="flex items-center border border-cyan-700 rounded-md px-3 py-1 bg-white">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-3 text-2xl font-bold text-cyan-700 hover:text-cyan-900 transition"
          >
            −
          </button>
          <input
            type="number"
            className="w-14 text-center text-cyan-900 font-semibold outline-none"
            value={quantity}
            readOnly
          />
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 text-2xl font-bold text-cyan-700 hover:text-cyan-900 transition"
          >
            +
          </button>
        </div>
        <span className="text-sm text-cyan-600">(المتوفر: {product.stock})</span>
      </div>

      <p className="text-lg text-cyan-800 mb-6">
        الإجمالي: <span className="font-bold">{price * quantity} د.ج</span>
      </p>

      {/* زر السلة */}
      <button
        onClick={handleAddToCart}
        className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-md font-bold shadow-md transition"
      >
        إضافة إلى السلة
      </button>

      {/* الوصف */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-cyan-700 mb-3">الوصف:</h3>
        {descriptionLines.length > 0 ? (
          <ul className="list-disc pl-6 text-cyan-800 space-y-1">
            {descriptionLines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-cyan-500">لا يوجد وصف متاح.</p>
        )}
      </div>

      {/* عودة */}
      <div className="mt-8">
        <Link
          to={`/customer/${product.brand?._id}/products`}
          className="text-cyan-700 underline hover:text-cyan-900 transition"
        >
          ← العودة إلى المنتجات
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
