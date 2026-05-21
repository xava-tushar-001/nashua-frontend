import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SingleTemplate, UpdateTemplate } from "../../api/api_client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function EditEmail() {
    const { id } = useParams();

    const navigate = useNavigate();


    const [template, setTemplate] = useState({
        name: "",
        subject: "",
        html_content: "",
        dynamic_constants: [],
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTemplate();
    }, []);

    const getTemplate = async () => {
        try {
            setLoading(true);

            const response = await SingleTemplate({ id });

            const temp = response?.data?.body?.template;

            setTemplate(temp);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // update name & subject
    const handleChange = (e) => {
        setTemplate({
            ...template,
            [e.target.name]: e.target.value,
        });
    };

    // update dynamic constants
    const handleDynamicChange = (index, value) => {
        const updatedConstants = [...template.dynamic_constants];

        updatedConstants[index].value = value;

        setTemplate({
            ...template,
            dynamic_constants: updatedConstants,
        });
    };

    // generate preview html
    const generatePreview = () => {
        let updatedHtml = template.html_content;

        template.dynamic_constants.forEach((item) => {
            const regex = new RegExp(`\\$\\{${item.key}\\}`, "g");

            updatedHtml = updatedHtml.replace(regex, item.value);
        });

        return updatedHtml;
    };

    // update api
    const handleUpdate = async () => {
        try {
            const payload = {
                id,
                name: template.name,
                subject: template.subject,
                html_content: template.html_content,
                dynamic_constants: template.dynamic_constants,
            };

            const response = await UpdateTemplate(payload);
            toast.success("Template Updated Successfully")
            navigate('/template')
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">

                    {/* Name */}
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">
                            Template Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={template.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Subject */}
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">
                            Subject
                        </label>

                        <input
                            type="text"
                            name="subject"
                            value={template.subject}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Dynamic Constants */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-4">
                            Dynamic Constants
                        </h2>

                        <div className="space-y-4">
                            {template.dynamic_constants?.map((item, index) => (
                                <div
                                    key={item._id}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <input
                                        type="text"
                                        value={item.key}
                                        disabled
                                        className="border rounded-lg px-4 py-2 bg-gray-100"
                                    />

                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) =>
                                            handleDynamicChange(index, e.target.value)
                                        }
                                        className="border rounded-lg px-4 py-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-4">
                            Email Preview
                        </h2>

                        <div
                            className="border rounded-lg p-4 bg-gray-50"
                            dangerouslySetInnerHTML={{
                                __html: generatePreview(),
                            }}
                        />
                    </div>

                    {/* Update Button */}
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Update Template
                    </button>
                </div>
            )}
        </div>
    );
}