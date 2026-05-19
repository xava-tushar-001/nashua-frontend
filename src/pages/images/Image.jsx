import React, { useEffect, useState } from "react";
import {
  UploadImage,
  GetImages,
  UpdateImage,
} from "../../api/api_client";

import { toast } from "react-toastify";
import { Pencil, X } from "lucide-react";

const sections = [
  {
    key: "header_top",
    title: "Header Top",
  },
  {
    key: "sidebar_ad",
    title: "Sidebar Ad",
  },
  {
    key: "footer_banner",
    title: "Footer Banner",
  },
  {
    key: "postpage_middle",
    title: "Post Page Middle",
  }
];

const STICK_LINK =
  "https://www.nashuaindependent.com/advertise-with-us";

export default function Image() {
  const [loading, setLoading] = useState(false);

  const [editMode, setEditMode] = useState({
    header_top: false,
    sidebar_ad: false,
    footer_banner: false,
  });

  const [formData, setFormData] = useState({
    header_top: {
      image_id: "",
      image: null,
      preview: "",
      start_date: "",
      end_date: "",
    },

    sidebar_ad: {
      image_id: "",
      image: null,
      preview: "",
      start_date: "",
      end_date: "",
    },

    footer_banner: {
      image_id: "",
      image: null,
      preview: "",
      start_date: "",
      end_date: "",
    },

    postpage_middle: {
      image_id: "",
      image: null,
      preview: "",
      start_date: "",
      end_date: "",
    },

  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await GetImages();

      const images = response?.data?.body?.image || [];

      const imageMap = {};

      images.forEach((item) => {
        imageMap[item.section] = item;
      });

      setFormData((prev) => ({
        ...prev,

        header_top: {
          ...prev.header_top,
          image_id: imageMap?.header_top?._id || "",
          preview: imageMap?.header_top?.image || "",
          start_date: formatDate(
            imageMap?.header_top?.start_date
          ),
          end_date: formatDate(
            imageMap?.header_top?.end_date
          ),
        },

        sidebar_ad: {
          ...prev.sidebar_ad,
          image_id: imageMap?.sidebar_ad?._id || "",
          preview: imageMap?.sidebar_ad?.image || "",
          start_date: formatDate(
            imageMap?.sidebar_ad?.start_date
          ),
          end_date: formatDate(
            imageMap?.sidebar_ad?.end_date
          ),
        },

        footer_banner: {
          ...prev.footer_banner,
          image_id: imageMap?.footer_banner?._id || "",
          preview: imageMap?.footer_banner?.image || "",
          start_date: formatDate(
            imageMap?.footer_banner?.start_date
          ),
          end_date: formatDate(
            imageMap?.footer_banner?.end_date
          ),
        },

        postpage_middle: {
          ...prev.postpage_middle,
          image_id: imageMap?.postpage_middle?._id || "",
          preview: imageMap?.postpage_middle?.image || "",
          start_date: formatDate(
            imageMap?.postpage_middle?.start_date
          ),
          end_date: formatDate(
            imageMap?.postpage_middle?.end_date
          ),
        },

      }));
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const pad = (num) => String(num).padStart(2, "0");

    return `${d.getFullYear()}-${pad(
      d.getMonth() + 1
    )}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const handleFileChange = (section, file) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        image: file,
        preview: URL.createObjectURL(file),
      },
    }));
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const toggleEditMode = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleUpload = async (section) => {
    try {
      const sectionData = formData[section];

      if (!sectionData.start_date || !sectionData.end_date) {
        return toast.error("Please select start and end date");
      }

      setLoading(true);

      const payload = new FormData();

      payload.append("section", section);
      payload.append("link", STICK_LINK);
      payload.append("start_date", sectionData.start_date);
      payload.append("end_date", sectionData.end_date);

      if (sectionData.image) {
        payload.append("image", sectionData.image);
      }

      let response;

      // UPDATE
      if (sectionData.image_id) {
        payload.append("image_id", sectionData.image_id);

        response = await UpdateImage(payload);

        toast.success(
          response?.data?.message ||
          "Image updated successfully"
        );
      }

      // UPLOAD
      else {
        if (!sectionData.image) {
          return toast.error("Please select image");
        }

        response = await UploadImage(payload);

        toast.success(
          response?.data?.message ||
          "Image uploaded successfully"
        );
      }

      setEditMode((prev) => ({
        ...prev,
        [section]: false,
      }));

      fetchImages();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sections.map((item) => {
          const sectionData = formData[item.key];

          const isEditing = editMode[item.key];

          return (
            <div
              key={item.key}
              className="bg-white rounded-2xl shadow-md border p-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {item.title}
                </h2>

                {sectionData.image_id && (
                  <button
                    onClick={() =>
                      toggleEditMode(item.key)
                    }
                    className="p-2 rounded-lg border hover:bg-gray-100 transition"
                  >
                    {isEditing ? (
                      <X size={18} />
                    ) : (
                      <Pencil size={18} />
                    )}
                  </button>
                )}
              </div>

              {/* Image Preview */}
              {sectionData.preview && (
                <div className="relative mb-4">
                  <img
                    src={sectionData.preview}
                    alt="preview"
                    className="w-full h-52 object-cover rounded-xl border"
                  />

                  {!isEditing &&
                    sectionData.image_id && (
                      <button
                        onClick={() =>
                          toggleEditMode(item.key)
                        }
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                </div>
              )}

              {/* FORM */}
              {(!sectionData.image_id || isEditing) && (
                <>
                  {/* Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Upload Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          item.key,
                          e.target.files[0]
                        )
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  {/* Start Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Start Date
                    </label>

                    <input
                      type="datetime-local"
                      value={sectionData.start_date}
                      onChange={(e) =>
                        handleInputChange(
                          item.key,
                          "start_date",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  {/* End Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      End Date
                    </label>

                    <input
                      type="datetime-local"
                      value={sectionData.end_date}
                      onChange={(e) =>
                        handleInputChange(
                          item.key,
                          "end_date",
                          e.target.value
                        )
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  {/* Link */}
                  {/* <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">
                      Fixed Redirect Link
                    </label>

                    <input
                      type="text"
                      value={STICK_LINK}
                      disabled
                      className="w-full border rounded-lg p-2 bg-gray-100"
                    />
                  </div> */}

                  {/* Button */}
                  <button
                    onClick={() =>
                      handleUpload(item.key)
                    }
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
                  >
                    {loading
                      ? "Processing..."
                      : sectionData.image_id
                        ? "Update Image"
                        : "Upload Image"}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}