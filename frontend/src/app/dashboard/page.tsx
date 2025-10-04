'use client';
import { myAppHook } from "@/context/AppProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

interface ProductType {
  title: string;
  description: string;
  cost: number;
  file: File | null;
  bannerUrl: string | '';
}

export default function Dashboard() {

  const { isLoading, authToken } = myAppHook();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductType>({
    title: '',
    description: '',
    cost: 0,
    file: null,
    bannerUrl: '',
  });

  useEffect(() => {
    if (!authToken) {
      router.push('/auth');
      return;
    }
  }, [authToken]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        file: e.target.files[0],
        bannerUrl: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
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
                    formData.bannerUrl && (
                      <Image
                        src={formData.bannerUrl}
                        alt="Preview"
                        id="bannerPreview"
                        style={{ width: '100px', height: '100px', display: 'none' }}
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
                <tr>
                  <td>1</td>
                  <td>Sample Product</td>
                  <td>
                    <Image
                      src="#"
                      alt="Product"
                      style={{ width: '50px', height: '50px' }}
                    />
                  </td>
                  <td>$100</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
