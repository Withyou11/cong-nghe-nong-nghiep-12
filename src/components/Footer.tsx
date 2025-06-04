import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Về Chúng Tôi</h3>
            <p className="text-gray-600">
              Nền tảng học tập trực tuyến về công nghệ nông nghiệp, giúp người
              học tiếp cận kiến thức một cách hiệu quả.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-600 hover:text-gray-900">
                  Chat
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                  Quản Trị
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: support@example.com</li>
              <li>Điện thoại: (84) 123-456-789</li>
              <li>Địa chỉ: TP Huế, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Công Nghệ Nông Nghiệp. Tất cả
            quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};
