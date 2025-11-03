import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const categories = [
    { name: "Men", img: "category_men.webp", path: "men" },
    { name: "Women", img: "category_women.webp", path: "women" },
    { name: "Kids", img: "category_kids.webp", path: "kids" },
    { name: "Electronics", img: "category_electronics.webp", path: "electronics" },
    { name: "All", img: "category_all.webp", path: "all" },
  ];

  return (
    <>
      <div className="w-100">
        <img
          src="/banner3.jpg"
          className="img-fluid w-100"
          alt="Main Banner"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
      </div>

      <div className="container mt-4 text-center bg-light border-rounded">
        <h4 className="mb-3 py-3">Shop by Category</h4>
        <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products/${cat.path}`}
              className="text-decoration-none text-dark"
            >
              <div
                className="card p-2"
                style={{
                  width: "180px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src={cat.img}
                  className="card-img-top"
                  alt={cat.name}
                  style={{ height: "120px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title">{cat.name}</h6>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <Link to="/products/all" className="text-decoration-none">
            <div className="card p-3 shadow-sm" style={{ width: "350px" }}>
              <img
                src="new_arrival1.webp"
                alt="New Arrivals"
                className="card-img-top rounded"
                style={{ objectFit: "cover" }}
              />
              <h5 className="mt-3">New Arrivals</h5>
            </div>
          </Link>

          <Link to="/products/all" className="text-decoration-none">
            <div className="card p-3 shadow-sm" style={{ width: "350px" }}>
              <img
                src="summer_collection.webp"
                alt="Summer Collection"
                className="card-img-top rounded"
                style={{ objectFit: "cover" }}
              />
              <h5 className="mt-3">Summer Collection</h5>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
