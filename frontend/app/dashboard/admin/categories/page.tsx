"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categoriesAPI, authAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

type Category = {
  id: number;
  title: string;
  description?: string;
  parent_id?: number | null;
  children?: Category[];
};

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    parent_id: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, userData] = await Promise.all([
          categoriesAPI.getAll(),
          authAPI.me().catch(() => null),
        ]);
        setCategories(categoriesData || []);
        setUser(userData);
        
        if (userData?.role !== 1) {
          router.push("/dashboard");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "خطا در دریافت دسته‌بندی‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, {
          title: formData.title,
          description: formData.description || undefined,
          parent_id: formData.parent_id ? parseInt(formData.parent_id) : undefined,
        });
      } else {
        await categoriesAPI.create({
          title: formData.title,
          description: formData.description || undefined,
          parent_id: formData.parent_id ? parseInt(formData.parent_id) : undefined,
        });
      }
      
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ title: "", description: "", parent_id: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ذخیره دسته‌بندی");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟")) return;

    try {
      await categoriesAPI.delete(id);
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در حذف دسته‌بندی");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      description: category.description || "",
      parent_id: category.parent_id?.toString() || "",
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 1) {
    return null;
  }

  const getAllCategoriesFlat = (cats: Category[]): Category[] => {
    const result: Category[] = [];
    const flatten = (items: Category[]) => {
      items.forEach(item => {
        result.push(item);
        if (item.children) flatten(item.children);
      });
    };
    flatten(cats);
    return result;
  };

  const allCategories = getAllCategoriesFlat(categories);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-blue-100 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800">مدیریت دسته‌بندی‌ها</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingCategory(null);
              setFormData({ title: "", description: "", parent_id: "" });
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            {showForm ? "انصراف" : "+ افزودن دسته‌بندی"}
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-500 transition"
          >
            بازگشت
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            {editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
          </h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              عنوان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              دسته‌بندی والد (اختیاری)
            </label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            >
              <option value="">بدون والد (دسته اصلی)</option>
              {allCategories
                .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              {editingCategory ? "ذخیره تغییرات" : "ایجاد"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">لیست دسته‌بندی‌ها</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
              level={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryItem({
  category,
  onEdit,
  onDelete,
  level,
}: {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
  level: number;
}) {
  return (
    <div className={`border rounded-xl p-4 ${level > 0 ? "mr-8 bg-gray-50" : ""}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{category.title}</h3>
          {category.description && (
            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(category)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            ویرایش
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            حذف
          </button>
        </div>
      </div>
      {category.children && category.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

