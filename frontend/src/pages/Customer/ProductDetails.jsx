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
        } catch (err) {
          setError("فشل في تحميل تفاصيل المنتج، حاول لاحقاً.");
        }
      };

      fetchProduct();
    }, 300); 

    return () => clearTimeout(timeoutId); 
  }, [id]);

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-600">جاري تحميل المنتج...</p>;
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
    toast.success("تمت إضافة المنتج إلى السلة");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <img
        src={image}
        alt={product.name}
        className="w-full h-64 object-contain mb-4"
      />
      <h2 className="text-2xl font-bold text-orange-700 mb-2">
        {product.name}
      </h2>
      <p className="text-lg text-gray-800 mb-4">{price} د.ج</p>

      {/* الكمية */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-gray-700 font-semibold">الكمية:</span>
        <div className="flex items-center border rounded px-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-2 text-lg font-bold text-orange-600"
          >
            −
          </button>
          <input
            type="number"
            className="w-12 text-center outline-none"
            value={quantity}
            readOnly
          />
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-2 text-lg font-bold text-orange-600"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500">
          (المتوفر: {product.stock})
        </span>
      </div>

      <p className="text-md text-gray-700 mb-6">
        الإجمالي: <span className="font-bold">{price * quantity} د.ج</span>
      </p>

      {/* زر السلة */}
      <button
        onClick={handleAddToCart}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-bold"
      >
        إضافة إلى السلة
      </button>

      {/* الوصف */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">الوصف:</h3>
        {descriptionLines.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            {descriptionLines.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">لا يوجد وصف متاح.</p>
        )}
      </div>

      {/* عودة */}
      <div className="mt-6">
        <Link
          to={`/customer/${product.brand?._id}/products`}
          className="text-orange-600 underline"
        >
          ← العودة إلى المنتجات
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
