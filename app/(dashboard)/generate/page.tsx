'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Upload, Link as LinkIcon, Image as ImageIcon, Video, Wand as Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


const MOCK_CONTENT_KEY = 'mock_generated_content';

export default function GeneratePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputMethod, setInputMethod] = useState<'upload' | 'url'>('upload');
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    contentType: 'image',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName) {
      toast.error('商品名を入力してください');
      return;
    }

    if (inputMethod === 'upload' && !selectedFile) {
      toast.error('画像をアップロードしてください');
      return;
    }

    if (inputMethod === 'url' && !formData.imageUrl) {
      toast.error('画像URLを入力してください');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockGeneratedUrl = `https://placehold.co/1080x1080/4299e1/ffffff?text=${encodeURIComponent(
        formData.productName
      )}`;

      const newContent = {
        id: `mock-${Date.now()}`,
        user_id: user?.id || 'mock-user-123',
        product_name: formData.productName,
        product_description: formData.productDescription || null,
        product_image_url: inputMethod === 'url' ? formData.imageUrl : previewUrl,
        platform: 'instagram',
        content_type: formData.contentType,
        generated_url: mockGeneratedUrl,
        prompt_used: `Generate ${formData.contentType} for Instagram`,
        metadata: {
          input_method: inputMethod,
        },
        created_at: new Date().toISOString(),
      };

      const existingContent = localStorage.getItem(MOCK_CONTENT_KEY);
      const contentArray = existingContent ? JSON.parse(existingContent) : [];
      contentArray.unshift(newContent);
      localStorage.setItem(MOCK_CONTENT_KEY, JSON.stringify(contentArray));

      toast.success('コンテンツを生成しました！');

      setFormData({
        productName: '',
        productDescription: '',
        contentType: 'image',
        imageUrl: '',
      });
      setSelectedFile(null);
      setPreviewUrl('');

      setTimeout(() => {
        router.push('/home');
      }, 1000);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">コンテンツ生成</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg font-medium">
            AIでSNS投稿用の画像・動画を自動生成
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                <Upload className="w-6 h-6 text-blue-600" />
                入力方法
              </CardTitle>
              <CardDescription className="text-base">商品情報の入力方法を選択してください</CardDescription>
            </CardHeader>
          <CardContent>
            <RadioGroup
              value={inputMethod}
              onValueChange={(value: any) => setInputMethod(value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="upload" id="upload" className="peer sr-only" />
                <Label
                  htmlFor="upload"
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8 hover:bg-slate-50 dark:hover:bg-slate-800 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-blue-50 peer-data-[state=checked]:to-indigo-50 dark:peer-data-[state=checked]:from-blue-950 dark:peer-data-[state=checked]:to-indigo-950 cursor-pointer transition-all"
                >
                  <Upload className="w-10 h-10 mb-3 text-blue-600" />
                  <span className="font-bold text-lg">画像アップロード</span>
                  <span className="text-sm text-slate-500 text-center mt-2">
                    ファイルから選択
                  </span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="url" id="url" className="peer sr-only" />
                <Label
                  htmlFor="url"
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8 hover:bg-slate-50 dark:hover:bg-slate-800 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-blue-50 peer-data-[state=checked]:to-indigo-50 dark:peer-data-[state=checked]:from-blue-950 dark:peer-data-[state=checked]:to-indigo-950 cursor-pointer transition-all"
                >
                  <LinkIcon className="w-10 h-10 mb-3 text-blue-600" />
                  <span className="font-bold text-lg">URL指定</span>
                  <span className="text-sm text-slate-500 text-center mt-2">
                    画像URLを入力
                  </span>
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-6 space-y-4">
              {inputMethod === 'upload' && (
                <div className="space-y-3">
                  <Label htmlFor="file" className="text-sm font-semibold">商品画像</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                  {previewUrl && (
                    <div className="mt-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 p-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              {inputMethod === 'url' && (
                <div className="space-y-3">
                  <Label htmlFor="imageUrl" className="text-sm font-semibold">画像URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">商品情報</CardTitle>
              <CardDescription className="text-base">生成に使用する商品の詳細を入力してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="productName" className="text-sm font-semibold">商品名 *</Label>
                <Input
                  id="productName"
                  placeholder="例: オーガニックコットンTシャツ"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  required
                  className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="productDescription" className="text-sm font-semibold">商品説明（オプション）</Label>
                <Textarea
                  id="productDescription"
                  placeholder="商品の特徴やアピールポイントを入力してください..."
                  value={formData.productDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, productDescription: e.target.value })
                  }
                  rows={4}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Instagram投稿生成
              </CardTitle>
              <CardDescription className="text-base">
                Instagramに最適化された画像コンテンツを生成
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">コンテンツタイプ</Label>
                <RadioGroup
                  value={formData.contentType}
                  onValueChange={(value) => setFormData({ ...formData, contentType: value })}
                  className="flex gap-4"
                >
                  <div className="flex-1">
                    <RadioGroupItem value="image" id="image" className="peer sr-only" />
                    <Label
                      htmlFor="image"
                      className="flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:bg-slate-50 dark:hover:bg-slate-800 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-blue-50 peer-data-[state=checked]:to-indigo-50 dark:peer-data-[state=checked]:from-blue-950 dark:peer-data-[state=checked]:to-indigo-950 cursor-pointer transition-all"
                    >
                      <ImageIcon className="w-6 h-6 text-blue-600" />
                      <span className="font-bold text-lg">画像</span>
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem value="video" id="video" className="peer sr-only" />
                    <Label
                      htmlFor="video"
                      className="flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 hover:bg-slate-50 dark:hover:bg-slate-800 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-blue-50 peer-data-[state=checked]:to-indigo-50 dark:peer-data-[state=checked]:from-blue-950 dark:peer-data-[state=checked]:to-indigo-950 cursor-pointer transition-all opacity-60"
                    >
                      <Video className="w-6 h-6 text-blue-600" />
                      <span className="font-bold text-lg">動画</span>
                      <Badge variant="outline" className="text-xs ml-2">近日公開</Badge>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  productName: '',
                  productDescription: '',
                  contentType: 'image',
                  imageUrl: '',
                });
                setSelectedFile(null);
                setPreviewUrl('');
              }}
              className="h-12 px-6 font-semibold border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              リセット
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all h-12 px-8 font-semibold min-w-[180px] transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  生成する
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
