import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SingleTemplate, UpdateTemplate } from "../../api/api_client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    Save,
    Eye,
    ArrowLeft,
    Edit2,
    Variable,
    Code,
    Mail,
    FileText,
    AlertCircle,
    CheckCircle,
    Play,
    RefreshCw,
    Plus,
    Trash2,
    X,
    Move,
    GripVertical
} from "lucide-react";

export default function EditEmail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const emptyTemplate = {
        name: "",
        subject: "",
        html_content: "",
        dynamic_constants: [],
    };

    const [template, setTemplate] = useState(emptyTemplate);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("edit");
    const [previewHtml, setPreviewHtml] = useState("");
    const [editingVariableIndex, setEditingVariableIndex] = useState(null);
    const [newVariableKey, setNewVariableKey] = useState("");
    const [newVariableValue, setNewVariableValue] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        getTemplate();
    }, []);

    const getTemplate = async () => {
        try {
            setLoading(true);
            const response = await SingleTemplate({ id });
            const temp =
                response?.data?.body?.template ||
                response?.data?.body ||
                response?.data ||
                emptyTemplate;

            const normalizedTemplate = {
                ...emptyTemplate,
                ...temp,
                dynamic_constants: Array.isArray(temp?.dynamic_constants)
                    ? temp.dynamic_constants
                    : [],
                html_content: temp?.html_content || "",
            };

            setTemplate(normalizedTemplate);
            generatePreview(normalizedTemplate);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load template");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const newTemplate = {
            ...template,
            [e.target.name]: e.target.value,
        };
        setTemplate(newTemplate);
        generatePreview(newTemplate);
    };

    const handleDynamicChange = (index, value) => {
        const updatedConstants = [...template.dynamic_constants];
        updatedConstants[index].value = value;

        const newTemplate = {
            ...template,
            dynamic_constants: updatedConstants,
        };
        setTemplate(newTemplate);
        generatePreview(newTemplate);
    };

    const addNewVariable = () => {
        if (!newVariableKey.trim()) {
            toast.error("Variable key is required");
            return;
        }

        // Check for duplicate keys
        const exists = template.dynamic_constants.some(
            item => item.key.toLowerCase() === newVariableKey.toLowerCase()
        );

        if (exists) {
            toast.error("Variable with this key already exists");
            return;
        }

        const newVariable = {
            _id: `temp_${Date.now()}`,
            key: newVariableKey.trim(),
            value: newVariableValue || "",
        };

        const updatedConstants = [...template.dynamic_constants, newVariable];
        const newTemplate = {
            ...template,
            dynamic_constants: updatedConstants,
        };
        setTemplate(newTemplate);
        generatePreview(newTemplate);

        setNewVariableKey("");
        setNewVariableValue("");
        setShowAddModal(false);
        toast.success("Variable added successfully");
    };

    const updateVariable = (index) => {
        if (!newVariableKey.trim()) {
            toast.error("Variable key is required");
            return;
        }

        // Check for duplicate keys (excluding current index)
        const exists = template.dynamic_constants.some(
            (item, idx) => idx !== index && item.key.toLowerCase() === newVariableKey.toLowerCase()
        );

        if (exists) {
            toast.error("Variable with this key already exists");
            return;
        }

        const updatedConstants = [...template.dynamic_constants];
        updatedConstants[index].key = newVariableKey.trim();
        updatedConstants[index].value = newVariableValue;

        const newTemplate = {
            ...template,
            dynamic_constants: updatedConstants,
        };
        setTemplate(newTemplate);
        generatePreview(newTemplate);

        setEditingVariableIndex(null);
        setNewVariableKey("");
        setNewVariableValue("");
        toast.success("Variable updated successfully");
    };

    const deleteVariable = (index) => {
        if (window.confirm("Are you sure you want to delete this variable?")) {
            const updatedConstants = template.dynamic_constants.filter((_, i) => i !== index);
            const newTemplate = {
                ...template,
                dynamic_constants: updatedConstants,
            };
            setTemplate(newTemplate);
            generatePreview(newTemplate);
            toast.success("Variable deleted successfully");
        }
    };

    const moveVariable = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= template.dynamic_constants.length) return;

        const updatedConstants = [...template.dynamic_constants];
        [updatedConstants[index], updatedConstants[newIndex]] =
            [updatedConstants[newIndex], updatedConstants[index]];

        const newTemplate = {
            ...template,
            dynamic_constants: updatedConstants,
        };
        setTemplate(newTemplate);
        generatePreview(newTemplate);
    };

    const generatePreview = (temp = template) => {
        let updatedHtml = temp?.html_content || "";

        temp.dynamic_constants?.forEach((item) => {
            const escapedKey = String(item.key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(`\\$\\{${escapedKey}\\}`, "g");
            const value = item.value || `{{${item.key}}}`;
            updatedHtml = updatedHtml.replace(regex, () => value);
        });

        setPreviewHtml(updatedHtml);
        return updatedHtml;
    };

    const previewDocument = previewHtml || "<!DOCTYPE html><html><body></body></html>";

    const handleUpdate = async () => {
        try {
            setSaving(true);
            const payload = {
                id,
                name: template.name,
                subject: template.subject,
                html_content: template.html_content,
                dynamic_constants: template.dynamic_constants,
            };

            await UpdateTemplate(payload);
            toast.success("Template Updated Successfully");
            setTimeout(() => navigate('/template'), 1500);
        } catch (error) {
            console.log(error);
            toast.error("Failed to update template");
        } finally {
            setSaving(false);
        }
    };

    const hasUnfilledVariables = () => {
        return template.dynamic_constants?.some(item => !item.value);
    };

    if (loading) {
        return (
            <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                        <Mail className="w-8 h-8 text-blue-600 absolute top-6 left-6 animate-pulse" />
                    </div>
                    <p className="text-gray-600 font-medium">Loading template...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50">
            {/* Animated Background */}
            <div className="fixed inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-transparent to-purple-400/20" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/template')}
                        className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Templates</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                    <Edit2 className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                                    Edit Template
                                </h1>
                            </div>
                            <p className="text-gray-600 ml-1">
                                Modify your email template content and dynamic variables
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setActiveTab("edit")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "edit"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                <Code className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => setActiveTab("preview")}
                                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === "preview"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Panel - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Template Info Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                <h2 className="text-white font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Template Information
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Template Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={template.name}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Enter template name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={template.subject}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Enter email subject"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Variables Card with CRUD */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-white font-semibold flex items-center gap-2">
                                    <Variable className="w-5 h-5" />
                                    Dynamic Variables
                                    {hasUnfilledVariables() && (
                                        <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                                            Requires attention
                                        </span>
                                    )}
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Variable
                                </button>
                            </div>
                            <div className="p-6">
                                {template.dynamic_constants?.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Variable className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 mb-3">No variables added yet</p>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mx-auto"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add your first variable
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {template.dynamic_constants.map((item, index) => (
                                            <div key={item._id} className="group">
                                                {editingVariableIndex === index ? (
                                                    // Edit Mode
                                                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-400">
                                                        <div className="flex gap-3 mb-3">
                                                            <div className="flex-1">
                                                                <label className="block text-xs font-semibold text-gray-600 mb-1">Variable Key</label>
                                                                <input
                                                                    type="text"
                                                                    value={newVariableKey}
                                                                    onChange={(e) => setNewVariableKey(e.target.value)}
                                                                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 font-mono text-sm focus:border-blue-500 outline-none"
                                                                    placeholder="variable_name"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label className="block text-xs font-semibold text-gray-600 mb-1">Default Value (Optional)</label>
                                                                <input
                                                                    type="text"
                                                                    value={newVariableValue}
                                                                    onChange={(e) => setNewVariableValue(e.target.value)}
                                                                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                                                                    placeholder="Default value"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => setEditingVariableIndex(null)}
                                                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-all"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => updateVariable(index)}
                                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all"
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // View Mode
                                                    <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                                                        <div className="flex items-center gap-1 text-gray-400 cursor-move">
                                                            <GripVertical className="w-4 h-4" />
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-mono text-sm font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                                                                    {'{{'}{item.key}{'}}'}
                                                                </span>
                                                                {!item.value && (
                                                                    <span className="text-xs text-yellow-600 flex items-center gap-1">
                                                                        <AlertCircle className="w-3 h-3" />
                                                                        No value set
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={item.value || ''}
                                                                onChange={(e) => handleDynamicChange(index, e.target.value)}
                                                                className={`w-full border rounded-lg px-3 py-1.5 text-sm transition-all ${!item.value
                                                                        ? 'border-yellow-300 bg-yellow-50 focus:border-blue-500'
                                                                        : 'border-gray-200 focus:border-blue-500'
                                                                    } focus:ring-2 focus:ring-blue-200 outline-none`}
                                                                placeholder={`Enter value for ${item.key}`}
                                                            />
                                                        </div>

                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingVariableIndex(index);
                                                                    setNewVariableKey(item.key);
                                                                    setNewVariableValue(item.value || '');
                                                                }}
                                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                title="Edit variable"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveVariable(index, -1)}
                                                                disabled={index === 0}
                                                                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                                title="Move up"
                                                            >
                                                                ↑
                                                            </button>
                                                            <button
                                                                onClick={() => moveVariable(index, 1)}
                                                                disabled={index === template.dynamic_constants.length - 1}
                                                                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                                title="Move down"
                                                            >
                                                                ↓
                                                            </button>
                                                            <button
                                                                onClick={() => deleteVariable(index)}
                                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Delete variable"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-blue-800 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span>Use {'${variable_key}'} in your HTML to insert dynamic content. Variables without values will show as {'{{key}}'} in preview.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Add Variable Modal */}
                        {showAddModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                                        <h3 className="text-white font-semibold text-lg">Add New Variable</h3>
                                        <button
                                            onClick={() => setShowAddModal(false)}
                                            className="text-white hover:bg-white/20 p-1 rounded-lg transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Variable Key *
                                            </label>
                                            <input
                                                type="text"
                                                value={newVariableKey}
                                                onChange={(e) => setNewVariableKey(e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none font-mono"
                                                placeholder="e.g., user_name, product_price"
                                                autoFocus
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Use only letters, numbers, and underscores
                                            </p>
                                        </div>
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Default Value (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={newVariableValue}
                                                onChange={(e) => setNewVariableValue(e.target.value)}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                                                placeholder="Enter a default value"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowAddModal(false)}
                                                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={addNewVariable}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all"
                                            >
                                                Add Variable
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* HTML Content Card */}
                        {activeTab === "edit" && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gradient from-gray-800 to-gray-900 px-6 py-4">
                                    <h2 className="text-white font-semibold flex items-center gap-2">
                                        <Code className="w-5 h-5" />
                                        HTML Content
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <textarea
                                        name="html_content"
                                        value={template.html_content}
                                        onChange={handleChange}
                                        rows={15}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder='<div>Your HTML content here...</div>'
                                    />
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {template.dynamic_constants?.map((item) => (
                                            <button
                                                key={item._id}
                                                onClick={() => {
                                                    const textarea = document.querySelector('textarea[name="html_content"]');
                                                    const start = textarea.selectionStart;
                                                    const end = textarea.selectionEnd;
                                                    const text = template.html_content;
                                                    const variable = `\${${item.key}}`;
                                                    const newText = text.substring(0, start) + variable + text.substring(end);
                                                    handleChange({ target: { name: 'html_content', value: newText } });
                                                    setTimeout(() => {
                                                        textarea.focus();
                                                        textarea.setSelectionRange(start + variable.length, start + variable.length);
                                                    }, 0);
                                                }}
                                                className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-mono transition-all"
                                            >
                                                {'${'}{item.key}{'}'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preview Card */}
                        {activeTab === "preview" && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 flex justify-between items-center">
                                    <h2 className="text-white font-semibold flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Email Preview
                                    </h2>
                                    <button
                                        onClick={() => generatePreview()}
                                        className="text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-all flex items-center gap-2 text-sm"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Refresh
                                    </button>
                                </div>
                                <div className="p-6">
                                    {hasUnfilledVariables() && (
                                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-2 text-yellow-800">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">
                                                Some dynamic variables don't have values. They will appear as {'{{key}}'} in the preview.
                                            </span>
                                        </div>
                                    )}
                                    <div className="border-2 border-gray-200 rounded-xl bg-gray-100 overflow-hidden">
                                        <iframe
                                            title="Email HTML preview"
                                            srcDoc={previewDocument}
                                            className="block w-full h-[640px] bg-white"
                                            sandbox=""
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Sidebar */}
                    <div className="space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-blue-600" />
                                    Actions
                                </h3>

                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        generatePreview();
                                        setActiveTab("preview");
                                    }}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-5 h-5" />
                                    Preview Email
                                </button>
                            </div>

                            <div className="border-t border-gray-100 p-6">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Quick Tips
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">•</span>
                                        Click variable buttons to insert into HTML
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">•</span>
                                        Use meaningful variable names
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">•</span>
                                        Reorder variables using arrow buttons
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt.5">•</span>
                                        Test preview before saving
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h4 className="font-semibold text-gray-700 mb-3">Template Stats</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total Variables</span>
                                    <span className="font-semibold text-gray-800">
                                        {template.dynamic_constants?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Variables with Values</span>
                                    <span className="font-semibold text-green-600">
                                        {template.dynamic_constants?.filter(v => v.value).length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">HTML Length</span>
                                    <span className="font-semibold text-gray-800">
                                        {template.html_content?.length.toLocaleString() || 0} chars
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                .bg-grid-slate-900\\/[0.04] {
                    background-image: linear-gradient(to right, #0f172a 1px, transparent 1px),
                                      linear-gradient(to bottom, #0f172a 1px, transparent 1px);
                }
            `}</style>
        </div>
    );
}



// import { useState } from "react";

// export default function App() {
//   const [html, setHtml] = useState("<h1>Hello</h1>");

//   return (
//     <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      
//       {/* Editor */}
//       <textarea
//         value={html}
//         onChange={(e) => setHtml(e.target.value)}
//         style={{
//           width: "50%",
//           height: "400px",
//           fontSize: "16px",
//           padding: "10px",
//         }}
//       />

//       {/* Preview */}
//       <iframe
//         title="preview"
//         srcDoc={html}
//         style={{
//           width: "50%",
//           height: "400px",
//           border: "1px solid #ccc",
//           background: "white",
//         }}
//       />
//     </div>
//   );
// }
