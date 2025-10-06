'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Trash2, ExternalLink, CreditCard as Edit } from 'lucide-react';

interface EcSite {
  id: string;
  user_id: string;
  name: string;
  url: string;
  platform: string;
  api_key: string | null;
  api_secret: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const platformOptions = [
  { value: 'shopify', label: 'Shopify' },
  { value: 'base', label: 'BASE' },
  { value: 'stores', label: 'STORES' },
  { value: 'makeshop', label: 'MakeShop' },
  { value: 'other', label: 'その他' },
];

const MOCK_SITES_KEY = 'mock_ec_sites';

export default function EcSitesPage() {
  const { user } = useAuth();
  const [sites, setSites] = useState<EcSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<EcSite | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    platform: '',
    api_key: '',
    api_secret: '',
  });

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const storedSites = localStorage.getItem(MOCK_SITES_KEY);
      if (storedSites) {
        setSites(JSON.parse(storedSites));
      }
    } catch (error) {
      console.error('Error loading EC sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url || !formData.platform) {
      toast.error('必須項目を入力してください');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let updatedSites: EcSite[];

      if (editingSite) {
        updatedSites = sites.map(site =>
          site.id === editingSite.id
            ? {
                ...site,
                name: formData.name,
                url: formData.url,
                platform: formData.platform,
                api_key: formData.api_key || null,
                api_secret: formData.api_secret || null,
                updated_at: new Date().toISOString(),
              }
            : site
        );
        toast.success('ECサイトを更新しました');
      } else {
        const newSite: EcSite = {
          id: `mock-${Date.now()}`,
          user_id: user?.id || 'mock-user-123',
          name: formData.name,
          url: formData.url,
          platform: formData.platform,
          api_key: formData.api_key || null,
          api_secret: formData.api_secret || null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        updatedSites = [newSite, ...sites];
        toast.success('ECサイトを追加しました');
      }

      localStorage.setItem(MOCK_SITES_KEY, JSON.stringify(updatedSites));
      setSites(updatedSites);
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving EC site:', error);
      toast.error('ECサイトの保存に失敗しました');
    }
  };

  const handleEdit = (site: EcSite) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      url: site.url,
      platform: site.platform,
      api_key: site.api_key || '',
      api_secret: site.api_secret || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このECサイトを削除してもよろしいですか？')) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const updatedSites = sites.filter(site => site.id !== id);
      localStorage.setItem(MOCK_SITES_KEY, JSON.stringify(updatedSites));
      setSites(updatedSites);
      toast.success('ECサイトを削除しました');
    } catch (error) {
      console.error('Error deleting EC site:', error);
      toast.error('ECサイトの削除に失敗しました');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const updatedSites = sites.map(site =>
        site.id === id ? { ...site, is_active: !currentStatus } : site
      );
      localStorage.setItem(MOCK_SITES_KEY, JSON.stringify(updatedSites));
      setSites(updatedSites);
      toast.success(
        !currentStatus
          ? 'ECサイトを有効にしました'
          : 'ECサイトを無効にしました'
      );
    } catch (error) {
      console.error('Error toggling EC site status:', error);
      toast.error('ステータスの変更に失敗しました');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      platform: '',
      api_key: '',
      api_secret: '',
    });
    setEditingSite(null);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const getPlatformLabel = (value: string) => {
    return platformOptions.find((p) => p.value === value)?.label || value;
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
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">ECサイト設定</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg font-medium">
              連携するECサイトを管理
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all h-12 px-8 text-base font-semibold transform hover:-translate-y-0.5">
                <Plus className="w-5 h-5 mr-2" />
                ECサイトを追加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[540px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {editingSite ? 'ECサイトを編集' : 'ECサイトを追加'}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    ECサイトの情報を入力してください
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold">サイト名 *</Label>
                    <Input
                      id="name"
                      placeholder="例: メインショップ"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-sm font-semibold">サイトURL *</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      required
                      className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform" className="text-sm font-semibold">プラットフォーム *</Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) =>
                        setFormData({ ...formData, platform: value })
                      }
                    >
                      <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {platformOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api_key" className="text-sm font-semibold">APIキー（オプション）</Label>
                    <Input
                      id="api_key"
                      type="password"
                      placeholder="APIキーを入力"
                      value={formData.api_key}
                      onChange={(e) =>
                        setFormData({ ...formData, api_key: e.target.value })
                      }
                      className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api_secret" className="text-sm font-semibold">APIシークレット（オプション）</Label>
                    <Input
                      id="api_secret"
                      type="password"
                      placeholder="APIシークレットを入力"
                      value={formData.api_secret}
                      onChange={(e) =>
                        setFormData({ ...formData, api_secret: e.target.value })
                      }
                      className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogClose(false)}
                    className="h-11 px-6 font-semibold border-2"
                  >
                    キャンセル
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 px-6 font-semibold shadow-lg"
                  >
                    {editingSite ? '更新' : '追加'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {sites.length === 0 ? (
          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
            <CardContent className="p-20 text-center">
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                ECサイトが登録されていません
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                最初のECサイトを追加してください
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 font-semibold shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                ECサイトを追加
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {sites.map((site) => (
              <Card
                key={site.id}
                className="border-0 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {site.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getPlatformLabel(site.platform)}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Switch
                        checked={site.is_active}
                        onCheckedChange={() => toggleActive(site.id, site.is_active)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline truncate"
                    >
                      {site.url}
                    </a>
                  </div>
                  {site.api_key && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      API連携設定済み
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(site)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      編集
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(site.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
