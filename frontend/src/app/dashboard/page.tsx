'use client';
import { myAppHook } from "@/context/AppProvider";
import { API_URL } from "@/utils/utils";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface ProductType {
  id?: number;
  title: string;
  description?: string;
  cost?: number;
  file?: string;
  banner_image?: File | null;
}

export default function Dashboard() {

  const { isLoading, authToken } = myAppHook();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [formData, setFormData] = useState<ProductType>({
    title: '',
    description: '',
    cost: 0,
    file: '',
    banner_image: null
  });

  useEffect(() => {
    if (!authToken) {
      router.push('/auth');
      return;
    }
    fetchAllProducts();
  }, [authToken]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        banner_image: e.target.files[0],
        file: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        toast.success(response.data.message);

        setFormData({
          title: '',
          description: '',
          cost: 0,
          file: '',
          banner_image: null
        });

        if (fileRef.current) {
          fileRef.current.value = '';
        }
      }
      console.log(response);
    } catch (error) {

    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // console.log(response);
      setProducts(response.data.products);
    } catch (error) {

    }
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card p-4">
              <h4>Add Product</h4>
              <form onSubmit={handleFormSubmit}>
                <input
                  className="form-control mb-2"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleOnChange}
                  required
                />
                <input
                  className="form-control mb-2"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleOnChange}
                  required
                />
                <input
                  className="form-control mb-2"
                  name="cost"
                  placeholder="Cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleOnChange}
                  required
                />
                <div className="mb-2">
                  {
                    formData.file && (
                      <Image
                        src={formData.file}
                        alt="Preview"
                        id="bannerPreview"
                        width={100}
                        height={100}
                      />
                    )
                  }
                </div>
                <input
                  className="form-control mb-2"
                  type="file"
                  ref={fileRef}
                  onChange={handleOnChange}
                  id="bannerInput" />
                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Add Product
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Banner</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((singleProduct, index) => (
                  <tr>
                    <td>{singleProduct.id}</td>
                    <td>{singleProduct.title}</td>
                    <td>
                      <Image
                        src={singleProduct.file}
                        alt="Product"
                        width={100}
                        height={100}
                      />
                    </td>
                    <td>${singleProduct.cost}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => setFormData({
                          id: singleProduct.id,
                          title: singleProduct.title,
                          description: singleProduct.description,
                          cost: singleProduct.cost
                        })}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
