
export interface Topic {
  id: number;
  title: string;
  description: string;
  lessons: number;
  quizzes: number;
  keywords: number;
  color: string;
}

export interface Lesson {
  id: number;
  topicId: number;
  title: string;
  content: string;
  duration: string;
}

export interface Quiz {
  id: number;
  topicId: number;
  lessonId?: number;
  title: string;
  questions: Question[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Keyword {
  id: number;
  topicId: number;
  term: string;
  definition: string;
}

export const topics: Topic[] = [
  {
    id: 1,
    title: "Giới thiệu chung về lâm nghiệp",
    description: "Tìm hiểu về ngành lâm nghiệp và vai trò của rừng",
    lessons: 8,
    quizzes: 5,
    keywords: 25,
    color: "bg-green-500"
  },
  {
    id: 2,
    title: "Trồng và chăm sóc rừng",
    description: "Kỹ thuật trồng rừng và quản lý rừng bền vững",
    lessons: 10,
    quizzes: 7,
    keywords: 30,
    color: "bg-emerald-500"
  },
  {
    id: 3,
    title: "Bảo vệ và khai thác tài nguyên rừng bền vững",
    description: "Phương pháp bảo vệ và khai thác rừng hợp lý",
    lessons: 9,
    quizzes: 6,
    keywords: 28,
    color: "bg-teal-500"
  },
  {
    id: 4,
    title: "Giới thiệu chung về thủy sản",
    description: "Khái niệm cơ bản về ngành thủy sản",
    lessons: 7,
    quizzes: 4,
    keywords: 22,
    color: "bg-blue-500"
  },
  {
    id: 5,
    title: "Môi trường nuôi thủy sản",
    description: "Yêu cầu môi trường và điều kiện nuôi thủy sản",
    lessons: 8,
    quizzes: 5,
    keywords: 26,
    color: "bg-cyan-500"
  },
  {
    id: 6,
    title: "Công nghệ giống thủy sản",
    description: "Kỹ thuật nhân giống và chọn tạo giống thủy sản",
    lessons: 9,
    quizzes: 6,
    keywords: 24,
    color: "bg-sky-500"
  },
  {
    id: 7,
    title: "Công nghệ thức ăn thủy sản",
    description: "Công nghệ sản xuất và bảo quản thức ăn thủy sản",
    lessons: 8,
    quizzes: 5,
    keywords: 23,
    color: "bg-indigo-500"
  },
  {
    id: 8,
    title: "Công nghệ nuôi thủy sản",
    description: "Các phương pháp nuôi thủy sản hiện đại",
    lessons: 11,
    quizzes: 8,
    keywords: 32,
    color: "bg-purple-500"
  },
  {
    id: 9,
    title: "Phòng, trị bệnh thủy sản",
    description: "Phương pháp phòng ngừa và điều trị bệnh cho thủy sản",
    lessons: 9,
    quizzes: 6,
    keywords: 27,
    color: "bg-pink-500"
  },
  {
    id: 10,
    title: "Bảo vệ và khai thác thủy sản",
    description: "Khai thác bền vững và bảo vệ nguồn lợi thủy sản",
    lessons: 8,
    quizzes: 5,
    keywords: 25,
    color: "bg-rose-500"
  }
];

export const lessons: Lesson[] = [
  {
    id: 1,
    topicId: 1,
    title: "Khái niệm về lâm nghiệp",
    content: `
# Khái niệm về lâm nghiệp

Lâm nghiệp là ngành khoa học và thực hành về quản lý rừng, bao gồm việc trồng, chăm sóc, bảo vệ và khai thác rừng một cách bền vững.

## Mục tiêu của lâm nghiệp:
- Bảo vệ và phát triển tài nguyên rừng
- Cung cấp sản phẩm gỗ và lâm sản ngoài gỗ
- Bảo vệ môi trường và đa dạng sinh học
- Điều hòa khí hậu và chống biến đổi khí hậu

## Vai trò của rừng:
1. **Về kinh tế**: Cung cấp gỗ, lâm sản, tạo việc làm
2. **Về môi trường**: Điều hòa khí hậu, bảo vệ đất, nước
3. **Về xã hội**: Nghỉ dưỡng, du lịch sinh thái
    `,
    duration: "45 phút"
  },
  {
    id: 2,
    topicId: 1,
    title: "Phân loại rừng",
    content: `
# Phân loại rừng

## Theo mục đích sử dụng:
### 1. Rừng phòng hộ
- Bảo vệ đầu nguồn
- Chống xói mòn
- Điều hòa khí hậu

### 2. Rừng đặc dụng
- Bảo tồn thiên nhiên
- Nghiên cứu khoa học
- Du lịch sinh thái

### 3. Rừng sản xuất
- Sản xuất gỗ
- Lâm sản ngoài gỗ
- Kết hợp nông lâm nghiệp
    `,
    duration: "40 phút"
  }
];

export const quizzes: Quiz[] = [
  {
    id: 1,
    topicId: 1,
    title: "Kiểm tra khái niệm lâm nghiệp",
    questions: [
      {
        id: 1,
        question: "Lâm nghiệp là gì?",
        options: [
          "Ngành trồng cây lấy gỗ",
          "Ngành khoa học và thực hành về quản lý rừng",
          "Ngành khai thác gỗ",
          "Ngành bảo vệ động vật rừng"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Rừng có những vai trò nào?",
        options: [
          "Chỉ cung cấp gỗ",
          "Chỉ bảo vệ môi trường",
          "Kinh tế, môi trường và xã hội",
          "Chỉ phục vụ du lịch"
        ],
        correctAnswer: 2
      }
    ]
  }
];

export const keywords: Keyword[] = [
  {
    id: 1,
    topicId: 1,
    term: "Lâm nghiệp",
    definition: "Ngành khoa học và thực hành về quản lý rừng một cách bền vững"
  },
  {
    id: 2,
    topicId: 1,
    term: "Rừng phòng hộ",
    definition: "Loại rừng có chức năng chính là bảo vệ đầu nguồn nước, chống xói mòn và điều hòa khí hậu"
  },
  {
    id: 3,
    topicId: 1,
    term: "Lâm sản ngoài gỗ",
    definition: "Các sản phẩm từ rừng không phải là gỗ như nhựa thông, mật ong, nấm, quả rừng"
  }
];
