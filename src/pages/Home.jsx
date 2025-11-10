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
          src="/banner69.jpg"
          className="img-fluid w-100"
          alt="Main Banner"
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
      </div>

      <div className="container-fluid bg-light py-4">
        <div className="text-center">
          <h4 className="mb-4">Shop by Category</h4>
          <div className="row g-3 justify-content-center">
            {categories.map((cat) => (
              <div key={cat.name} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <Link to={`/products/${cat.path}`} className="text-decoration-none text-dark">
                  <div
                    className="card h-100 p-2"
                    style={{
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
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                    <div className="card-body p-2 d-flex align-items-center justify-content-center">
                      <h6 className="card-title mb-0 text-center">{cat.name}</h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="row justify-content-center gap-3 gap-md-4 mt-4">
          <div className="col-12 col-md-5 col-lg-4">
            <Link to="/products/all" className="text-decoration-none">
              <div className="card p-3 shadow-sm h-100">
                <img
                  src="new_arrival1.webp"
                  alt="New Arrivals"
                  className="card-img-top rounded"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <h5 className="mt-3 text-center">New Arrivals</h5>
              </div>
            </Link>
          </div>

          <div className="col-12 col-md-5 col-lg-4">
            <Link to="/products/all" className="text-decoration-none">
              <div className="card p-3 shadow-sm h-100">
                <img
                  src="summer_collection.webp"
                  alt="Summer Collection"
                  className="card-img-top rounded"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <h5 className="mt-3 text-center">Summer Collection</h5>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;