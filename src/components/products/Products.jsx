import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addCart } from '../../redux/action'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import './products.css'

const Products = () => {
  const [data, setData] = useState([]) // Dữ liệu từ API
  const [filter, setFilter] = useState([]) // Dữ liệu được hiển thị (có thể lọc)
  const [loading, setLoading] = useState(false) // Trạng thái loading
  const [currentPage, setCurrentPage] = useState(1) // Trang hiện tại
  const [pageSize] = useState(10) // Số sản phẩm mỗi trang
  const [totalCount, setTotalCount] = useState(0) // Tổng số sản phẩm từ API

  const dispatch = useDispatch()

  // Thêm sản phẩm vào giỏ hàng
  const addProduct = (product) => {
    dispatch(addCart(product))
  }

  // Hàm gọi API để lấy dữ liệu sản phẩm theo trang
  const getProducts = async (pageNumber) => {
    setLoading(true) // Bật trạng thái loading
    try {
      const response = await fetch(
        `https://ahoang.onrender.com/api/Item?pageNumber=${pageNumber}&pageSize=${pageSize}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json() // Parse JSON

      setData(data.items) // Cập nhật danh sách sản phẩm
      setFilter(data.items) // Hiển thị dữ liệu ban đầu
      setTotalCount(data.totalCount) // Cập nhật tổng số sản phẩm
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false) // Tắt trạng thái loading
    }
  }

  // Gọi API khi `currentPage` thay đổi
  useEffect(() => {
    getProducts(currentPage)
  }, [currentPage])

  // Hàm xử lý chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalCount / pageSize)) {
      setCurrentPage(page)
    }
  }

  // Hiển thị trạng thái loading
  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {[...Array(6)].map((_, index) => (
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4" key={index}>
          <Skeleton height={592} />
        </div>
      ))}
    </>
  )

  // Hiển thị danh sách sản phẩm
  const ShowProducts = () => (
    <>
      {filter.map((product) => (
        <div
          id={product.id}
          key={product.id}
          className="col-md-3 col-sm-6 col-xs-8 col-12 mb-4"
        >
          <div className="card text-center h-100">
            <img
              className="card-img-top p-3"
              src="/assets/img/anhchung5.jpg"
              alt={product.name}
              height={300}
            />
            <div className="card-body">
              <h6 style={{ textAlign: 'left' }}>
                {product.name.substring(0, 30)}...
              </h6>
              <p className="card-text" style={{ textAlign: 'left' }}>
                {product.type}
              </p>
            </div>
            <div className="card-body hover-buttons">
              <Link
                to={`/product/${product.id}`}
                className="btn btn-card btn-primary m-1"
              >
                Buy Now
              </Link>
              <button
                className="btn btn-card btn-secondary m-1"
                onClick={() => {
                  toast.success('Added to cart')
                  addProduct(product)
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  )

  // Thành phần phân trang
  const Pagination = () => {
    const totalPages = Math.ceil(totalCount / pageSize)

    return (
      <div className="pagination d-flex justify-content-center align-items-center mt-3">
        <button
          className="btn btn-primary mx-1"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span className="mx-3">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary mx-1"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    )
  }

  // Kết quả trả về
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
        {!loading && <Pagination />}
      </div>
    </>
  )
}

export default Products
