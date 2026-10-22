import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { productService } from '../../services/productService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Accessories'];

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stock: '',
    imageUrl: '',
    featured: false,
    isTrending: false,
    isNewArrival: true
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        keyword: search || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        limit: 50
      };
      const res = await productService.getProducts(params);
      if (res.success) {
        setProducts(res.products);
        setTotal(res.total);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Electronics',
      price: '',
      originalPrice: '',
      stock: '10',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900',
      featured: false,
      isTrending: false,
      isNewArrival: true
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      imageUrl: product.images && product.images[0] ? product.images[0] : '',
      featured: Boolean(product.featured),
      isTrending: Boolean(product.isTrending),
      isNewArrival: Boolean(product.isNewArrival)
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900'],
        featured: formData.featured,
        isTrending: formData.isTrending,
        isNewArrival: formData.isNewArrival
      };

      const res = await productService.createProduct(payload);
      if (res.success) {
        toast.success('Product created successfully');
        setIsCreateModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;
    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        images: [formData.imageUrl],
        featured: formData.featured,
        isTrending: formData.isTrending,
        isNewArrival: formData.isNewArrival
      };

      const res = await productService.updateProduct(currentProduct._id, payload);
      if (res.success) {
        toast.success('Product updated successfully');
        setIsEditModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentProduct) return;
    try {
      setSubmitting(true);
      const res = await productService.deleteProduct(currentProduct._id);
      if (res.success) {
        toast.success('Product deleted successfully');
        setIsDeleteModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F4F4F6] border border-neutral-200 rounded-full focus:outline-none focus:border-[#0C0C0E]"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
          </form>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs bg-[#F4F4F6] border border-neutral-200 rounded-full text-[#0C0C0E] font-bold focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Create Button */}
        <Button onClick={openCreateModal} variant="primary" size="md" className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <h3 className="text-xl font-extrabold text-[#0C0C0E]">
            Product Catalog ({total})
          </h3>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-400">Loading catalog items...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Image</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F4F4F6] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="w-12 h-14 rounded-xl bg-[#F4F4F6] overflow-hidden border border-neutral-200">
                        <ImageWithFallback
                          src={p.images && p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[#0C0C0E]">{p.sku}</td>
                    <td className="py-3.5 px-3 font-bold text-[#0C0C0E] max-w-[220px] truncate">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant="neutral" size="xs">
                        {p.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-[#0C0C0E]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-bold ${
                          p.stock <= 0
                            ? 'text-red-600'
                            : p.stock <= 5
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 rounded-xl border border-neutral-200 hover:bg-white text-[#0C0C0E] transition-colors shadow-sm"
                        title="Edit product"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(p)}
                        className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 transition-colors shadow-sm"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 py-8 text-center">No products found matching filters.</p>
        )}
      </div>

      {/* CREATE PRODUCT MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Catalog Product"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            placeholder="e.g. Minimalist Wireless Headphones"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-medium text-[#0C0C0E] focus:outline-none focus:border-[#0C0C0E]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFormChange}
              placeholder="12999"
              required
            />

            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleFormChange}
              placeholder="15"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Original Price (₹ Optional)"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleFormChange}
              placeholder="15999"
            />
            <Input
              label="Primary Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleFormChange}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="flex items-center gap-3 p-3 bg-[#F4F4F6] rounded-2xl border border-neutral-200">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-12 h-14 object-cover rounded-xl"
              />
              <span className="text-xs text-neutral-500 font-medium">Image preview active</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Detailed description of craftsmanship, materials, and lifestyle context..."
              required
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-medium text-[#0C0C0E] focus:outline-none focus:border-[#0C0C0E]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#0C0C0E] cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleFormChange}
                className="rounded accent-[#0C0C0E]"
              />
              <span>Featured Story</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#0C0C0E] cursor-pointer">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleFormChange}
                className="rounded accent-[#0C0C0E]"
              />
              <span>Trending</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#0C0C0E] cursor-pointer">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleFormChange}
                className="rounded accent-[#0C0C0E]"
              />
              <span>New Arrival</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              variant="outline"
              size="md"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              Create Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT PRODUCT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Product: ${currentProduct?.sku}`}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-medium text-[#0C0C0E] focus:outline-none focus:border-[#0C0C0E]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFormChange}
              required
            />

            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Original Price (₹)"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleFormChange}
            />
            <Input
              label="Primary Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleFormChange}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-medium text-[#0C0C0E] focus:outline-none focus:border-[#0C0C0E]"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#0C0C0E] cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleFormChange}
                className="rounded accent-[#0C0C0E]"
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#0C0C0E] cursor-pointer">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleFormChange}
                className="rounded accent-[#0C0C0E]"
              />
              <span>Trending</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#0C0C0E] cursor-pointer">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleFormChange}
                className="rounded accent-[#0C0C0E]"
              />
              <span>New Arrival</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              variant="outline"
              size="md"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Product Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <p className="leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong>"{currentProduct?.name}"</strong>? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              variant="outline"
              size="md"
            >
              Cancel
            </Button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              {submitting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
