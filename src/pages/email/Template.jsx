import React, { useEffect, useState } from 'react';
import { GetTemplate } from "../../api/api_client";
import { Mail, FileText, Calendar, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Template() {

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getTemplates = async () => {
        try {

            setLoading(true);

            const response = await GetTemplate();

            setTemplates(
                response?.data?.body?.templates || []
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        getTemplates();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">

                    <div className="flex items-center gap-3 mb-2">

                        <Mail className="w-8 h-8 text-blue-600" />

                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Email Templates
                        </h1>

                    </div>

                    <p className="text-gray-600">
                        Manage and monitor all email templates in your platform
                    </p>

                </div>

                {/* Loading */}
                {
                    loading ? (

                        <div className="flex justify-center items-center h-64">

                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                        </div>

                    ) : (

                        <>
                            {/* Empty State */}
                            {
                                templates.length === 0 ? (

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">

                                        <Mail className="w-16 h-16 mx-auto text-gray-300 mb-4" />

                                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                                            No Templates Found
                                        </h2>

                                        <p className="text-gray-500">
                                            You have not created any email templates yet.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                        {
                                            templates.map((item) => (

                                                <div
                                                    key={item._id}
                                                    className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                                >

                                                    {/* Top */}
                                                    <div className="p-5 border-b border-gray-100">

                                                        <div className="flex justify-between items-start">

                                                            <div>

                                                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                                                    {item.name}
                                                                </h2>

                                                                <div className="flex items-center gap-2 text-gray-500 text-sm">

                                                                    <FileText className="w-4 h-4" />

                                                                    <span>
                                                                        {item.subject}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">

                                                                <Mail className="w-5 h-5" />

                                                            </div>

                                                        </div>

                                                    </div>

                                                    {/* Body */}
                                                    <div className="p-5">

                                                        <div className="mb-4">

                                                            <p className="text-sm text-gray-500 mb-2">
                                                                Dynamic Variables
                                                            </p>

                                                            <div className="flex flex-wrap gap-2">

                                                                {
                                                                    item.dynamic_constants?.map((dynamic, index) => (

                                                                        <span
                                                                            key={index}
                                                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                                                        >
                                                                            {dynamic.key}
                                                                        </span>

                                                                    ))
                                                                }

                                                            </div>

                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">

                                                            <Calendar className="w-4 h-4" />

                                                            <span>
                                                                {
                                                                    new Date(item.createdAt)
                                                                        .toLocaleDateString()
                                                                }
                                                            </span>

                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-3">

                                                            {/* <button
                                                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl transition-all"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                Preview
                                                            </button> */}

                                                            <button
                                                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-all"
                                                                onClick={() => navigate(`/edit-email/${item._id}`)}
                                                            >
                                                                <Pencil className="w-4 h-4" />

                                                                Edit
                                                            </button>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                )
                            }
                        </>

                    )
                }

            </div>

        </div>
    );
}