import React, { useEffect, useState } from "react";
import { GetUsers, SyncUser, SendEmail, EmailTemplate, TestEmail } from "../../api/api_client";
import { toast } from "react-toastify";
import { Search, RefreshCw, Mail, X, Send, User as UserIcon, CheckCircle, XCircle, Crown, Star, Users as UsersIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailOption, setEmailOption] = useState("free");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showTestEmailModal, setShowTestEmailModal] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testTemplate, setTestTemplate] = useState("");
  const [testDropdown, setTestDropdown] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);


  useEffect(() => {
    fetchUsers();
    GetEmailTemplate();
  }, [page]);

  const selectedTemplateData = templates.find(
    (item) => item.id === selectedTemplate
  );

  const fetchUsers = async (searchValue = search) => {
    try {
      setLoading(true);
      const response = await GetUsers({
        params: {
          page,
          search: searchValue,
        },
      });
      setUsers(response?.data?.body?.users || []);
      setTotalPages(response?.data?.body?.pagination.totalPages || 1);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers(search);
  };

  const handleSyncUsers = async () => {
    try {
      setSyncLoading(true);
      await SyncUser();
      fetchUsers();
      toast.success("Users synced successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to sync users"
      );
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSendEmail = () => {
    setEmailOption("free");
    setShowEmailModal(true);
  };

  const GetEmailTemplate = async () => {
    try {
      let response = await EmailTemplate()
      setTemplates(response?.data?.body?.data?.templates || []);


    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirmSendEmail = async () => {
    let SendEmails = await SendEmail({
      type: emailOption,
      template_id: selectedTemplate,
    })

    toast.success(`Email sent to all users with ${emailOption} plan option!`);
    setShowEmailModal(false);
    setEmailOption("free");
  };

  const getPlanBadgeColor = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'paid':
        return <Star className="w-4 h-4" />;
      case 'premium':
        return <Crown className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };


  const handleSendTestEmail = async () => {
    try {
      if (!testEmail) {
        return toast.error("Please enter email");
      }

      if (!testTemplate) {
        return toast.error("Please select template");
      }

      setSendingTestEmail(true);

      await TestEmail({
        template_id: testTemplate,
        emails: [testEmail],
      });

      toast.success("Test email sent successfully!");

      setShowTestEmailModal(false);
      setTestEmail("");
      setTestTemplate("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send test email"
      );
    } finally {
      setSendingTestEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              User Management
            </h1>
          </div>
          <p className="text-gray-600">Manage and monitor all users in your platform</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105"
              >
                <Search className="w-4 h-4" />
                Search
              </button>

              <button
                onClick={handleSyncUsers}
                disabled={syncLoading}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <RefreshCw className={`w-4 h-4 ${syncLoading ? 'animate-spin' : ''}`} />
                {syncLoading ? "Syncing..." : "Sync Users"}
              </button>

              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
              >
                <Mail className="w-4 h-4" />
                Send Email to Users
              </button>

              <button
                onClick={() => setShowTestEmailModal(true)}
                className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
                Test Email
              </button>

            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">User</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Subscribed</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Membership Plan</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Membership Type</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-12">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-gray-500">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {/* User */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar_image || "https://via.placeholder.com/40"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name || "N/A"}</p>
                            {/* <p className="text-xs text-gray-500">ID: {user._id?.slice(-8)}</p> */}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4">
                        <p className="text-gray-700">{user.email}</p>
                      </td>

                      {/* Subscribed */}
                      <td className="p-4">
                        {user.subscribed ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Yes
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500">
                            <XCircle className="w-4 h-4" />
                            No
                          </span>
                        )}
                      </td>

                      {/* Membership Plan */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getPlanBadgeColor(user.membership_plan)}`}>
                          {getPlanIcon(user.membership_plan)}
                          <span className="capitalize">{user.membership_plan || "free"}</span>
                        </span>
                      </td>

                      {/* Membership Type */}
                      <td className="p-4">
                        <span className="capitalize text-gray-700">{user.membership_type || "standard"}</span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${user.membership_plan === "paid"
                          ? "bg-green-100 text-green-700"
                          : user.membership_plan === "premium"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${user.membership_plan === "paid"
                            ? "bg-green-500"
                            : user.membership_plan === "premium"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                            }`} />
                          <span className="capitalize">{user.membership_plan || "free"}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-12">
                      <div className="flex flex-col items-center gap-3">
                        <UsersIcon className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500">No users found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:hover:bg-white"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all ${page === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Send Email to Users</h2>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-2">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> This will send emails to users based on their selected plan type.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select User Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setEmailOption("free")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${emailOption === "free"
                      ? "bg-gray-900 text-white ring-2 ring-offset-2 ring-gray-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <UserIcon className="w-5 h-5" />
                      <span>Free Users</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setEmailOption("paid")}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${emailOption === "paid"
                      ? "bg-green-600 text-white ring-2 ring-offset-2 ring-green-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Star className="w-5 h-5" />
                      <span>Paid Users</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setEmailOption("premium")}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${emailOption === "premium"
                      ? "bg-purple-600 text-white ring-2 ring-offset-2 ring-purple-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Crown className="w-5 h-5" />
                      <span>Premium Users</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Email Template
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl hover:border-green-500 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>

                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-800">
                          {selectedTemplateData?.name || "Choose Template"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {selectedTemplateData?.type || "Select email template"}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${showTemplateDropdown ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {showTemplateDropdown && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                      <div className="max-h-72 overflow-y-auto">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              setShowTemplateDropdown(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none ${selectedTemplate === template.id
                              ? "bg-green-50"
                              : ""
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedTemplate === template.id
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                                  }`}
                              >
                                <Mail
                                  className={`w-5 h-5 ${selectedTemplate === template.id
                                    ? "text-green-600"
                                    : "text-gray-500"
                                    }`}
                                />
                              </div>

                              <div className="text-left">
                                <p className="text-sm font-semibold text-gray-800 capitalize">
                                  {template.name}
                                </p>

                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">
                                    {template.type}
                                  </span>

                                  {template.active ? (
                                    <span className="px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded-full">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {selectedTemplate === template.id && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Summary:</p>

                <p className="text-sm text-gray-800">
                  Sending email to{" "}
                  <strong className="capitalize">{emailOption}</strong> users
                </p>

                <p className="text-sm text-gray-800 mt-1">
                  Template:{" "}
                  <strong>
                    {templates.find((t) => t.id == selectedTemplate)?.name || "Not Selected"}
                  </strong>
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  All users with {emailOption} membership plan will receive this email
                </p>
              </div>


            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSendEmail}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Email Modal */}
      {showTestEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-fadeIn">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Send className="w-5 h-5 text-orange-600" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Send Test Email
                  </h2>
                  <p className="text-sm text-gray-500">
                    Send email to a specific address
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTestEmailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTestDropdown(!testDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-xl hover:border-orange-500 transition-all"
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-800">
                        {
                          templates.find((t) => t.id === testTemplate)?.name ||
                          "Choose Template"
                        }
                      </p>

                      <p className="text-xs text-gray-500">
                        {
                          templates.find((t) => t.id === testTemplate)?.type ||
                          "Select email template"
                        }
                      </p>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${testDropdown ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {testDropdown && (
                    <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => {
                              setTestTemplate(template.id);
                              setTestDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-none ${testTemplate === template.id
                                ? "bg-orange-50"
                                : ""
                              }`}
                          >
                            <p className="font-medium text-gray-800 capitalize">
                              {template.name}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {template.type}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong>{" "}
                  {testEmail || "Not entered"}
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  <strong>Template:</strong>{" "}
                  {templates.find((t) => t.id === testTemplate)?.name ||
                    "Not selected"}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t">
              <button
                onClick={() => setShowTestEmailModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSendTestEmail}
                disabled={sendingTestEmail}
                className="flex-1 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />

                {sendingTestEmail
                  ? "Sending..."
                  : "Send Test Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}