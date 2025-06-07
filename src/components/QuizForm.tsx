import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface QuizFormProps {
  onSubmit: (data: QuizData) => void;
  mode?: 'add' | 'edit';
  initialData?: QuizData;
  onCancel?: () => void;
}

export interface QuizData {
  question: string;
  options: string[];
  correctAnswer: number;
}

export function QuizForm({
  onSubmit,
  mode = 'add',
  initialData,
  onCancel,
}: QuizFormProps) {
  const [formData, setFormData] = useState<QuizData>(
    initialData || {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Câu hỏi</Label>
          <Textarea
            id="question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            placeholder="Nhập câu hỏi..."
          />
        </div>

        <div className="space-y-4">
          <Label>Các đáp án</Label>
          <RadioGroup
            value={formData.correctAnswer.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, correctAnswer: parseInt(value) })
            }
          >
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Đáp án ${index + 1}`}
                />
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
          )}
          <Button type="submit">{mode === 'add' ? 'Thêm' : 'Lưu'}</Button>
        </div>
      </form>
    </div>
  );
}
