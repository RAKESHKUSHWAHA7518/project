import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  FileIcon,
  Filter,
  Search,
} from 'lucide-react';
import { collection, getDocs, query, where, and } from 'firebase/firestore';
import { db, storage, auth } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';

interface Document {
  id: string;
  title: string;
  date: string;
  fileUrl: string;
  imageUrl?: string;
  fileType: 'image' | 'pdf' | 'doc' | 'docx';
  description: string;
  menuItemId: string;
  tags: string[];
  status: 'private' | 'public';
  createdAt: Date;
}

interface DocumentViewerProps {
  sectionId: string;
  selectedTags: string[];
}

export default function DocumentViewer({
  sectionId,
  selectedTags,
}: DocumentViewerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [embeddedUrl, setEmbeddedUrl] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [yearRange, setYearRange] = useState({ start: 1840, end: 2025 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        let q;
        const isAuthenticated = !!auth.currentUser;

        // Base query conditions
        const conditions = [];

        // Add section filter if not 'all'
        if (sectionId !== 'all') {
          conditions.push(where('section', '==', sectionId));
        }

        // Add status filter based on authentication
        if (!isAuthenticated) {
          conditions.push(where('status', '==', 'public'));
        }

        // Build the query
        if (conditions.length > 0) {
          q = query(collection(db, 'historical-documents'), and(...conditions));
        } else {
          q = query(collection(db, 'historical-documents'));
        }

        const querySnapshot = await getDocs(q);
        const docs: Document[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          docs.push({
            id: docSnap.id,
            title: data.title || '',
            date: data.date || '',
            fileUrl: data.fileUrl || '',
            imageUrl: data.imageUrl || undefined,
            fileType: data.fileType || 'image',
            description: data.description || '',
            section: data.section || '',
            tags: data.tags || [],
            status: data.status || 'private',
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });

        setDocuments(docs);
      } catch (err) {
        setError('Error fetching documents');
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [sectionId, auth.currentUser]);

  const handleSelectDoc = async (doc: Document) => {
    setSelectedDoc(doc);
    setEmbeddedUrl('');
console.log(doc);

    try {
      if (doc.fileType === 'image' && doc.imageUrl) {
        setEmbeddedUrl(doc.imageUrl);
      } else if (doc.fileType === 'pdf' || doc.fileType === 'doc' || doc.fileType === 'docx') {
        const storagePath = doc.fileUrl.split('/o/')[1]?.split('?')[0];
        if (!storagePath) throw new Error('Invalid storage path in fileUrl');
        const decodedPath = decodeURIComponent(storagePath);
        const storageRef = ref(storage, decodedPath);
        const directLink = await getDownloadURL(storageRef);

        setEmbeddedUrl(
          `https://docs.google.com/gview?url=${encodeURIComponent(
            directLink
          )}&embedded=true`
        );
      }
    } catch (err) {
      console.error('Error generating preview:', err);
      setEmbeddedUrl('');
    }
  };

  // const handleDownload = async (doc: Document) => {
  //   if (!doc.fileUrl && !doc.imageUrl) {
  //     alert('No file available for download');
  //     return;
  //   }

  //   setDownloadLoading(true);
  //   try {
  //     let downloadUrl;
  //     let filename;

  //     if (doc.fileType === 'image' && doc.imageUrl) {
  //       // For images, use the direct imageUrl
  //       downloadUrl = doc.imageUrl;
  //       filename = `${doc.title || 'image'}.${doc.imageUrl.split('.').pop()}`;
  //     } else {
  //       // For other files, use Firebase Storage
  //       const storagePath = doc.fileUrl.split('/o/')[1]?.split('?')[0];
  //       if (!storagePath) throw new Error('Invalid storage path');
  //       const decodedPath = decodeURIComponent(storagePath);
  //       const storageRef = ref(storage, decodedPath);
  //       downloadUrl = await getDownloadURL(storageRef);
  //       filename = decodedPath.split('/').pop() || 'document';
  //     }

  //     // Create a temporary anchor element to trigger download
  //     const link = document.createElement('a');
  //     console.log(link);
      
  //     link.href = downloadUrl;
  //     link.download = "filename"; // Set the download attribute
  //     // link.target = '_blank'; // Open in new tab
  //     // link.rel = 'noopener noreferrer'; // Security best practice
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (err) {
  //     console.error('Error downloading document:', err);
  //     alert('Error downloading document. Please try again.');
  //   } finally {
  //     setDownloadLoading(false);
  //   }
  // };

  // Filter documents by search, date, tags
  
  const handleDownload = async (doc: Document) => {
    if (!doc.fileUrl && !doc.imageUrl) {
      alert('No file available for download');
      return;
    }
  
    setDownloadLoading(true);
    try {
      let downloadUrl: string;
      let filename: string;
  
      if (doc.fileType === 'image' && doc.imageUrl) {
        downloadUrl = doc.imageUrl;
        filename = `${doc.title || 'image'}.${doc.imageUrl.split('.').pop()}`;
      } else {
        const storagePath = doc.fileUrl.split('/o/')[1]?.split('?')[0];
        if (!storagePath) throw new Error('Invalid storage path');
        const decodedPath = decodeURIComponent(storagePath);
        const storageRef = ref(storage, decodedPath);
        downloadUrl = await getDownloadURL(storageRef);
        filename = decodedPath.split('/').pop() || 'document';
      }
  
      // Debug logging
      console.log('Download URL:', downloadUrl);
      console.log('Filename:', filename);
  
      // Fetch the file as a blob
      const response = await fetch(downloadUrl);
      // const response = await fetch(downloadUrl, { mode: 'no-cors' });
      console.log(response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
  
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);
  
      // Create and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.rel = 'noopener noreferrer'; // For security
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Delay revoking the blob URL to ensure the download has started
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Error downloading document. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };
  
  
  const filteredDocs = documents.filter((doc) => {
    const matchTitle = doc.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchYear =
      parseInt(doc.date) >= yearRange.start &&
      parseInt(doc.date) <= yearRange.end;
    const matchTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => doc.tags.includes(tag));
    return matchTitle && matchYear && matchTags;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Search + Range Filter */}
      <div className="mb-8 flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{yearRange.start}</span>
          <input
            type="range"
            min="1840"
            max="2025"
            value={yearRange.start}
            onChange={(e) =>
              setYearRange((prev) => ({
                ...prev,
                start: parseInt(e.target.value),
              }))
            }
            className="w-32"
          />
          <input
            type="range"
            min="1840"
            max="2025"
            value={yearRange.end}
            onChange={(e) =>
              setYearRange((prev) => ({
                ...prev,
                end: parseInt(e.target.value),
              }))
            }
            className="w-32"
          />
          <span className="text-sm text-gray-600">{yearRange.end}</span>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105 relative"
            onClick={() => handleSelectDoc(doc)}
          >
            <div className="relative">
              {doc.fileType === 'image' ? (
                <img
                  src={doc.fileUrl}
                  alt={doc.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">
                      {doc.fileType.toUpperCase()} Document
                    </span>
                  </div>
                </div>
              )}

              {/* Status badge */}
              <div className="absolute top-2 right-2">
                {doc.status === 'public' ? (
                  <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <Globe size={16} />
                  </div>
                ) : (
                  <div className="bg-gray-700 text-white p-2 rounded-full shadow-lg">
                    <Lock size={16} />
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-500">{doc.date}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {doc.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 relative">
            <button
              onClick={() => {
                setSelectedDoc(null);
                setEmbeddedUrl('');
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronLeft size={24} />
                </button>

                {selectedDoc.fileType === 'image' ? (
                  <img
                    src={selectedDoc.fileUrl}
                    alt={selectedDoc.title}
                    className="max-h-[60vh] object-contain"
                  />
                ) : (
                  <div className="w-full h-[60vh] bg-gray-50 flex items-center justify-center">
                    {embeddedUrl ? (
                      <iframe
                        src={embeddedUrl}
                        className="w-full h-full"
                        title={selectedDoc.title}
                      />
                    ) : (
                      <div>Loading preview...</div>
                    )}
                  </div>
                )}

                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold">{selectedDoc.title}</h2>
                  {selectedDoc.status === 'private' ? (
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                      <Lock className="w-5 h-5 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">
                        Private Document
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                      <Globe className="w-5 h-5 text-green-700" />
                      <span className="text-sm font-medium text-green-700">
                        Public Document
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{selectedDoc.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDoc.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-sm px-3 py-1 rounded-full ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-sm text-gray-500">
                    Date: {selectedDoc.date}
                  </span>
                    <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(selectedDoc);
                    }}
                    disabled={downloadLoading}
                    className={`flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors ${
                      downloadLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {downloadLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm mt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">
            No documents found {sectionId !== 'all' && 'in this section'}.
          </p>
          <p className="text-gray-400">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}