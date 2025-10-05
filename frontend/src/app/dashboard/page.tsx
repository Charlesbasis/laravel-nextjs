'use client';
import { myAppHook } from "@/context/AppProvider";
import { API_URL } from "@/utils/utils";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

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
  const [isEdit, setIsEdit] = useState(false);
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

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEdit) {
        const response = await axios.post(`${API_URL}/products/${formData.id}`, {
          ...formData,
          '_method': 'PUT'
        }, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        toast.success(response.data.message);
        fetchAllProducts();

      } else {
        const response = await axios.post(`${API_URL}/products`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.status) {
          fetchAllProducts();
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
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (id: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(`${API_URL}/products/${id}`, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            if (response.data.status) {
              toast.success(response.data.message);
              // Swal.fire({
              //   title: "Deleted!",
              //   text: "Your file has been deleted.",
              //   icon: "success"
              // });
              fetchAllProducts();
            }
          } catch (error) {
            console.log(error)
          }
        }
      });
    } catch (error) {

    }
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card p-4">
              <h4>{isEdit ? 'Edit' : 'Add'} Product</h4>
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
                  {isEdit ? 'Update' : 'Add'} Product
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
                  <tr key={singleProduct.id}>
                    <td>{singleProduct.id}</td>
                    <td>{singleProduct.title}</td>
                    <td>
                      {singleProduct.banner_image ? (
                        <Image
                          src={singleProduct.banner_image}
                          alt="Product"
                          width={50}
                          height={50}
                        />
                      ) : 'No Image'
                      }
                    </td>
                    <td>${singleProduct.cost}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setFormData({
                            id: singleProduct.id,
                            title: singleProduct.title,
                            description: singleProduct.description,
                            cost: singleProduct.cost,
                            file: singleProduct.banner_image
                          })
                          setIsEdit(true)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(singleProduct.id)}
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
