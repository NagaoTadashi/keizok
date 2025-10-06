'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wand as Wand2, Search, Filter, Play, Download, ExternalLink, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import type { GeneratedContent } from '@/lib/supabase';


const mockContents = [
  {
    id: '1',
    product_name: 'オーガニックコットンTシャツ',
    product_description: '環境に優しい100%オーガニックコットン',
    platform: 'instagram',
    content_type: 'image',
    generated_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    generated_caption: '地球にやさしい、肌にやさしい🌿\n\n100%オーガニックコットンで作られたこのTシャツは、着心地の良さと環境配慮を両立。毎日のワードローブに、サステナブルな選択を。',
    generated_hashtags: '#オーガニックコットン #サステナブルファッション #エコフレンドリー #ナチュラル素材 #地球にやさしい #オーガニック #エシカルファッション #環境配慮',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    product_name: 'ハンドメイドレザーバッグ',
    product_description: '職人が一つ一つ丁寧に作る本革バッグ',
    platform: 'instagram',
    content_type: 'image',
    generated_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
    generated_caption: '職人の技が光る、一生モノのレザーバッグ✨\n\n熟練の職人が一つひとつ丁寧に仕上げた本革バッグ。使うほどに味わいが増し、あなただけの色に育っていきます。長く愛用できる、本物の品質をお届けします。',
    generated_hashtags: '#ハンドメイドレザー #本革バッグ #職人技 #レザークラフト #一生モノ #革製品 #ハンドメイドバッグ #こだわりの逸品',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    product_name: 'アロマキャンドルセット',
    product_description: '天然素材100%のリラックスキャンドル',
    platform: 'instagram',
    content_type: 'image',
    generated_url: 'https://images.unsplash.com/photo-1602874801006-94d00c7d1f9d?w=800&h=800&fit=crop',
    generated_caption: '忙しい毎日に、癒しのひとときを🕯️\n\n天然素材100%のアロマキャンドルで、心からリラックス。やさしい香りに包まれて、自分だけの特別な時間を過ごしませんか？',
    generated_hashtags: '#アロマキャンドル #リラックスタイム #天然素材 #癒しの時間 #おうち時間 #アロマセラピー #自分時間 #キャンドルのある暮らし',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    product_name: 'スマートウォッチ',
    product_description: '健康管理とスタイルを両立する最新モデル',
    platform: 'instagram',
    content_type: 'image',
    generated_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
    generated_caption: '健康管理もスタイルも妥協しない⌚️\n\n最新のスマートウォッチで、毎日をもっとアクティブに。心拍数、睡眠、運動量を自動記録。スタイリッシュなデザインで、どんなシーンにもマッチします。',
    generated_hashtags: '#スマートウォッチ #健康管理 #フィットネス #ウェアラブル #ヘルスケア #アクティブライフ #テクノロジー #最新ガジェット',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    product_name: 'プレミアムコーヒー豆',
    product_description: '厳選された単一農園の最高級豆',
    platform: 'instagram',
    content_type: 'image',
    generated_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop',
    generated_caption: '一杯のコーヒーから始まる、特別な朝☕️\n\n単一農園で丁寧に育てられた最高級のコーヒー豆。豊かな香りと深い味わいで、いつもの朝をワンランク上の時間に。',
    generated_hashtags: '#プレミアムコーヒー #スペシャルティコーヒー #コーヒー好き #単一農園 #コーヒーのある暮らし #朝のコーヒー #珈琲時間 #コーヒー豆',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    product_name: 'ヨガマット',
    product_description: '滑り止め加工付きの高品質マット',
    platform: 'instagram',
    content_type: 'image',
    generated_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop',
    generated_caption: 'おうちヨガで、心も体もリフレッシュ��‍♀️\n\n滑り止め加工でしっかりグリップ、安定したポーズをサポート。厚さ6mmのクッションで膝や関節もやさしく守ります。あなたのヨガライフを快適に。',
    generated_hashtags: '#ヨガマット #おうちヨガ #ヨガのある暮らし #ヨガ好き #フィットネス #ヨガライフ #ホームヨガ #ヨガ女子',
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    product_name: 'ワイヤレスイヤホン',
    product_description: 'ノイズキャンセリング機能搭載',
    platform: 'instagram',
    content_type: 'video',
    generated_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
    generated_caption: '世界が静かになる、そんな瞬間を🎧\n\nノイズキャンセリング機能で周囲の雑音をカット。音楽も通話もクリアに。通勤時間が、あなただけの特別な時間に変わります。',
    generated_hashtags: '#ワイヤレスイヤホン #ノイズキャンセリング #音楽好き #オーディオ #ガジェット #通勤時間 #高音質 #Bluetooth',
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    product_name: 'スキンケアセット',
    product_description: '自然派スキンケアの決定版',
    platform: 'instagram',
    content_type: 'image',
    generated_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop',
    generated_caption: '自然の力で、本来の美しさを引き出す🌸\n\n植物由来成分たっぷりの自然派スキンケア。お肌にやさしく、しっかり潤う。毎日のケアが、楽しみな時間に変わります。',
    generated_hashtags: '#スキンケア #自然派コスメ #ナチュラルスキンケア #植物由来 #オーガニックコスメ #美容 #スキンケアルーティン #敏感肌',
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    product_name: 'デザイナーズチェア',
    product_description: '人間工学に基づいた快適設計',
    platform: 'instagram',
    content_type: 'image',
    generated_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop',
    generated_caption: '座り心地とデザイン、どちらも妥協しない🪑\n\n人間工学に基づいた設計で、長時間座っても疲れにくい。インテリアに溶け込む洗練されたデザインで、お部屋をワンランクアップ。',
    generated_hashtags: '#デザイナーズチェア #インテリア #人間工学 #家具 #おしゃれな部屋 #インテリアデザイン #北欧家具 #チェア',
    created_at: new Date().toISOString(),
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [contents, setContents] = useState<any[]>([]);
  const [filteredContents, setFilteredContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  useEffect(() => {
    loadContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [contents, searchQuery, contentTypeFilter]);

  const loadContents = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const storedContent = localStorage.getItem('mock_generated_content');
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent);
        if (parsedContent.length > 0) {
          setContents(parsedContent);
        } else {
          setContents(mockContents);
        }
      } else {
        setContents(mockContents);
      }
    } catch (error) {
      console.error('Error loading contents:', error);
      setContents(mockContents);
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = [...contents];

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.product_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (contentTypeFilter !== 'all') {
      filtered = filtered.filter((item) => item.content_type === contentTypeFilter);
    }

    setFilteredContents(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const copyToClipboard = async (text: string, type: 'caption' | 'hashtags') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'caption') {
        setCopiedCaption(true);
        setTimeout(() => setCopiedCaption(false), 2000);
      } else {
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3810d4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-black dark:via-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              投稿一覧
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg font-medium">
              生成されたInstagram投稿を確認・管理
            </p>
          </div>
          <Link href="/generate">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all h-12 px-8 text-base font-semibold transform hover:-translate-y-0.5">
              <Wand2 className="w-5 h-5 mr-2" />
              新規生成
            </Button>
          </Link>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="商品名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 rounded-xl"
              />
            </div>
            <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
              <SelectTrigger className="w-[160px] h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl font-semibold">
                <SelectValue placeholder="タイプ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="image">画像</SelectItem>
                <SelectItem value="video">動画</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-base">{filteredContents.length}件の投稿</span>
            {contents.length !== filteredContents.length && (
              <span className="text-slate-500">（全{contents.length}件中）</span>
            )}
          </div>
        </div>

        {filteredContents.length === 0 ? (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-20 text-center shadow-xl">
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
              {contents.length === 0
                ? '投稿がまだありません'
                : '該当する投稿が見つかりません'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
              {contents.length === 0
                ? '最初のInstagram投稿を生成してみましょう'
                : '検索条件を変更してみてください'}
            </p>
            {contents.length === 0 && (
              <Link href="/generate">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all">
                  <Wand2 className="w-5 h-5 mr-2" />
                  投稿を生成
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredContents.map((item) => (
              <div
                key={item.id}
                className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={item.generated_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.content_type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
                        <Play className="w-10 h-10 text-blue-600 ml-1" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg px-3 py-1.5 text-sm font-semibold">
                      Instagram
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => window.open(item.generated_url, '_blank')}
                      className="w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.generated_url;
                        link.download = `${item.product_name}.jpg`;
                        link.click();
                      }}
                      className="w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1 truncate">
                        {item.product_name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                        <span>{formatDate(item.created_at)}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {item.content_type === 'image' ? '画像' : '動画'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textToCopy = `${item.generated_caption}\n\n${item.generated_hashtags}`;
                        copyToClipboard(textToCopy, 'caption');
                      }}
                      className="shrink-0"
                    >
                      {copiedCaption ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                    {item.generated_caption}
                  </div>

                  <div className="text-sm text-[#3810d4] dark:text-[#5c3dd9] flex flex-wrap gap-1">
                    {item.generated_hashtags.split(' ').map((tag: string, index: number) => (
                      <span key={index} className="hover:underline cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
