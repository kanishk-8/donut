// "use client";
// import React, { useState, useEffect } from "react";
// import { useTheme } from "@/context/themecontext";
// import { useAuth } from "@/context/authcontext";
// // import { account } from "@/lib/appwrite";
// import {
//   Plus,
//   Book,
//   Search,
//   Edit2,
//   Trash2,
//   FileText,
//   Tag,
//   Calendar,
//   Save,
//   X,
//   Loader2,
// } from "lucide-react";

// const KnowledgeBasePage = () => {
//   const { theme } = useTheme();
//   const { user } = useAuth();
//   const [documents, setDocuments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isCreating, setIsCreating] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [newDocument, setNewDocument] = useState({
//     title: "",
//     content: "",
//     category: "general",
//   });

//   const categories = [
//     { id: "all", name: "All Categories" },
//     { id: "general", name: "General" },
//     { id: "billing", name: "Billing" },
//     { id: "technical", name: "Technical Support" },
//     { id: "shipping", name: "Shipping" },
//     { id: "returns", name: "Returns & Refunds" },
//     { id: "product", name: "Product Information" },
//   ];

//   useEffect(() => {
//     loadDocuments();
//   }, []);

//   const loadDocuments = async () => {
//     setIsLoading(true);
//     try {
//       const projectId = window.location.pathname.split("/")[3];

//       // Get session token for authentication
//       const session = await account.getSession("current");

//       const response = await fetch(
//         `/api/v1/knowledge-base?projectId=${projectId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.secret}`,
//           },
//         }
//       );
//       const data = await response.json();

//       if (response.ok) {
//         setDocuments(data.documents || []);
//       } else {
//         console.error("Failed to load documents:", data.error);
//         setDocuments([]);
//       }

//       console.log("API Response:", data); // Debug log
//     } catch (error) {
//       console.error("Failed to load documents:", error);
//       // Set empty array on error instead of mock data
//       setDocuments([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateDocument = async (e) => {
//     e.preventDefault();
//     if (!newDocument.title.trim() || !newDocument.content.trim()) return;

//     try {
//       const projectId = window.location.pathname.split("/")[3];
//       console.log("Creating document with projectId:", projectId); // Debug log

//       // Get session token for authentication
//       const session = await account.getSession("current");

//       const response = await fetch("/api/v1/knowledge-base", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session.secret}`,
//         },
//         body: JSON.stringify({
//           ...newDocument,
//           projectId,
//         }),
//       });

//       const data = await response.json();
//       console.log("API Response:", data); // Debug log

//       if (data.success) {
//         setDocuments([data.document, ...documents]);
//         setNewDocument({ title: "", content: "", category: "general" });
//         setIsCreating(false);
//         // Reload documents to ensure consistency
//         await loadDocuments();
//       } else {
//         console.error("Failed to create document:", data.error || data.details);
//         alert(`Failed to save document: ${data.error || data.details}`);
//       }
//     } catch (error) {
//       console.error("Failed to create document:", error);
//       alert(`Error creating document: ${error.message}`);
//     }
//   };

//   const filteredDocuments = documents.filter((doc) => {
//     const matchesSearch =
//       doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doc.content.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       selectedCategory === "all" || doc.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       general:
//         theme === "dark"
//           ? "bg-gray-500/20 text-gray-300"
//           : "bg-gray-100 text-gray-700",
//       billing:
//         theme === "dark"
//           ? "bg-green-500/20 text-green-300"
//           : "bg-green-100 text-green-700",
//       technical:
//         theme === "dark"
//           ? "bg-blue-500/20 text-blue-300"
//           : "bg-blue-100 text-blue-700",
//       shipping:
//         theme === "dark"
//           ? "bg-purple-500/20 text-purple-300"
//           : "bg-purple-100 text-purple-700",
//       returns:
//         theme === "dark"
//           ? "bg-orange-500/20 text-orange-300"
//           : "bg-orange-100 text-orange-700",
//       product:
//         theme === "dark"
//           ? "bg-indigo-500/20 text-indigo-300"
//           : "bg-indigo-100 text-indigo-700",
//     };
//     return colors[category] || colors.general;
//   };

//   return (
//     <div
//       className={`p-4 md:p-8 overflow-y-auto min-h-screen ${
//         theme === "dark" ? "bg-black" : "bg-gray-50/50"
//       }`}
//     >
//       <div className="container mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
//           <div>
//             <h1
//               className={`text-2xl sm:text-3xl font-bold mb-2 ${
//                 theme === "dark" ? "text-white" : "text-gray-900"
//               }`}
//             >
//               Knowledge Base
//             </h1>
//             <p
//               className={`text-sm sm:text-base ${
//                 theme === "dark" ? "text-gray-400" : "text-gray-600"
//               }`}
//             >
//               Manage your AI customer service knowledge base
//             </p>
//           </div>
//           <button
//             onClick={() => setIsCreating(true)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base w-full sm:w-auto"
//           >
//             <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
//             Add Document
//           </button>
//         </div>

//         {/* Search and Filter */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search documents..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
//                 theme === "dark"
//                   ? "bg-gray-800 border-gray-600 text-white"
//                   : "bg-white border-gray-300 text-gray-900"
//               }`}
//             />
//           </div>
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
//               theme === "dark"
//                 ? "bg-gray-800 border-gray-600 text-white"
//                 : "bg-white border-gray-300 text-gray-900"
//             }`}
//           >
//             {categories.map((category) => (
//               <option key={category.id} value={category.id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Create Document Modal */}
//         {isCreating && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div
//               className={`rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto ${
//                 theme === "dark" ? "bg-zinc-800" : "bg-white"
//               }`}
//             >
//               <h2
//                 className={`text-xl font-semibold mb-4 ${
//                   theme === "dark" ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 Add New Document
//               </h2>
//               <form onSubmit={handleCreateDocument}>
//                 <div className="mb-4">
//                   <label
//                     className={`block text-sm font-medium mb-2 ${
//                       theme === "dark" ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     Title *
//                   </label>
//                   <input
//                     type="text"
//                     value={newDocument.title}
//                     onChange={(e) =>
//                       setNewDocument({ ...newDocument, title: e.target.value })
//                     }
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       theme === "dark"
//                         ? "bg-gray-700 border-gray-600 text-white"
//                         : "bg-white border-gray-300 text-gray-900"
//                     }`}
//                     placeholder="Enter document title"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     className={`block text-sm font-medium mb-2 ${
//                       theme === "dark" ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     Category
//                   </label>
//                   <select
//                     value={newDocument.category}
//                     onChange={(e) =>
//                       setNewDocument({
//                         ...newDocument,
//                         category: e.target.value,
//                       })
//                     }
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       theme === "dark"
//                         ? "bg-gray-700 border-gray-600 text-white"
//                         : "bg-white border-gray-300 text-gray-900"
//                     }`}
//                   >
//                     {categories.slice(1).map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="mb-6">
//                   <label
//                     className={`block text-sm font-medium mb-2 ${
//                       theme === "dark" ? "text-gray-300" : "text-gray-700"
//                     }`}
//                   >
//                     Content *
//                   </label>
//                   <textarea
//                     value={newDocument.content}
//                     onChange={(e) =>
//                       setNewDocument({
//                         ...newDocument,
//                         content: e.target.value,
//                       })
//                     }
//                     className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                       theme === "dark"
//                         ? "bg-gray-700 border-gray-600 text-white"
//                         : "bg-white border-gray-300 text-gray-900"
//                     }`}
//                     placeholder="Enter document content"
//                     rows="8"
//                     required
//                   />
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <button
//                     type="submit"
//                     className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-md transition-colors font-medium flex items-center justify-center"
//                   >
//                     <Save className="w-4 h-4 mr-2" />
//                     Save Document
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsCreating(false);
//                       setNewDocument({
//                         title: "",
//                         content: "",
//                         category: "general",
//                       });
//                     }}
//                     className={`flex-1 py-2.5 rounded-md transition-colors font-medium flex items-center justify-center ${
//                       theme === "dark"
//                         ? "bg-gray-600 hover:bg-gray-500 text-white"
//                         : "bg-gray-300 hover:bg-gray-400 text-gray-700"
//                     }`}
//                   >
//                     <X className="w-4 h-4 mr-2" />
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Documents List */}
//         {isLoading ? (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//           </div>
//         ) : filteredDocuments.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredDocuments.map((doc) => (
//               <div
//                 key={doc.$id}
//                 className={`backdrop-blur-sm rounded-xl shadow-lg p-6 border transition-all duration-200 hover:scale-105 ${
//                   theme === "dark"
//                     ? "bg-zinc-800/50 border-gray-700"
//                     : "bg-white border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="flex items-center">
//                     <div className="p-2 rounded-full bg-indigo-600 text-white mr-3">
//                       <Book className="w-4 h-4" />
//                     </div>
//                     <span
//                       className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(
//                         doc.category
//                       )}`}
//                     >
//                       {categories.find((c) => c.id === doc.category)?.name ||
//                         doc.category}
//                     </span>
//                   </div>
//                 </div>

//                 <h3
//                   className={`text-lg font-semibold mb-2 ${
//                     theme === "dark" ? "text-white" : "text-gray-900"
//                   }`}
//                 >
//                   {doc.title}
//                 </h3>

//                 <p
//                   className={`text-sm mb-4 line-clamp-3 ${
//                     theme === "dark" ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 >
//                   {doc.summary || doc.content.substring(0, 120) + "..."}
//                 </p>

//                 <div className="flex items-center justify-between text-xs">
//                   <div className="flex items-center">
//                     <Calendar className="w-3 h-3 mr-1" />
//                     <span
//                       className={
//                         theme === "dark" ? "text-gray-400" : "text-gray-500"
//                       }
//                     >
//                       {formatDate(doc.createdAt)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       className={`p-1.5 rounded transition-colors ${
//                         theme === "dark"
//                           ? "hover:bg-gray-600 text-gray-400"
//                           : "hover:bg-gray-100 text-gray-500"
//                       }`}
//                     >
//                       <Edit2 className="w-3 h-3" />
//                     </button>
//                     <button
//                       className={`p-1.5 rounded transition-colors ${
//                         theme === "dark"
//                           ? "hover:bg-red-500/20 text-red-400"
//                           : "hover:bg-red-50 text-red-500"
//                       }`}
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div
//             className={`text-center py-12 backdrop-blur-sm rounded-2xl shadow-lg border ${
//               theme === "dark"
//                 ? "bg-zinc-800/50 border-gray-700"
//                 : "bg-white border-gray-200"
//             }`}
//           >
//             <div className="text-6xl mb-4">📚</div>
//             <h3
//               className={`text-xl font-medium mb-2 ${
//                 theme === "dark" ? "text-gray-300" : "text-gray-600"
//               }`}
//             >
//               No documents found
//             </h3>
//             <p
//               className={`mb-4 ${
//                 theme === "dark" ? "text-gray-400" : "text-gray-500"
//               }`}
//             >
//               {searchTerm || selectedCategory !== "all"
//                 ? "Try adjusting your search or filter"
//                 : "Create your first knowledge base document to get started"}
//             </p>
//             {!searchTerm && selectedCategory === "all" && (
//               <button
//                 onClick={() => setIsCreating(true)}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium mx-auto"
//               >
//                 <Plus className="w-5 h-5" />
//                 Add First Document
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default KnowledgeBasePage;

import React from "react";

export const page = () => {
  return <div>page</div>;
};
