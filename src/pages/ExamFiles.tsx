import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  Calendar,
  File as FileIcon,
  X,
} from 'lucide-react';
import { useExamFiles } from '@/hooks/useExamFiles';
import type { ExamFileMeta } from '@/lib/api';

const ExamFiles = () => {
  const { files, isLoading } = useExamFiles();
  const [selectedFile, setSelectedFile] = useState<ExamFileMeta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleViewFile = (file: ExamFileMeta) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Trang chủ
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Đề thi THPTQG
              </h1>
              <p className="text-gray-600 mt-1">
                Danh sách đề thi do giáo viên tải lên
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>Đề thi THPTQG</CardTitle>
                <CardDescription>
                  Luyện tập với các đề thi mẫu để chuẩn bị cho kỳ thi quan trọng
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {files.length} đề thi
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Exam Files List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : files.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có đề thi nào
                </h3>
                <p className="text-gray-600">
                  Các đề thi sẽ được cập nhật sớm nhất
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <Card
                  key={file.id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">
                          {file.title}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-1">
                          {file.file_name}
                        </CardDescription>
                      </div>
                      <FileIcon className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(file.created_at).toLocaleDateString(
                              'vi-VN',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        <span className="font-medium">
                          {(file.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleViewFile(file)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                        <a
                          href={file.public_url}
                          download
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-1" />
                            Tải về
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedFile && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 flex flex-col">
            <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold pr-4">
                  {selectedFile.title}
                </DialogTitle>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={selectedFile.public_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Mở tab mới
                    </Button>
                  </a>
                  <a href={selectedFile.public_url} download>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Tải về
                    </Button>
                  </a>
                </div>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-hidden p-4">
              <iframe
                src={`${selectedFile.public_url}#toolbar=0`}
                className="w-full h-full border border-gray-200 rounded"
                title={selectedFile.title}
                style={{ minHeight: '70vh' }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExamFiles;
