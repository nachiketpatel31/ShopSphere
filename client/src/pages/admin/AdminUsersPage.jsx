import React, { useState, useEffect } from 'react';
import { Users, Shield, Calendar, Phone, Mail } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import toast from 'react-hot-toast';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers({ page: currentPage, limit: 15 });
      if (res.success) {
        setUsers(res.users);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="text-xl font-extrabold text-[#0C0C0E]">
            Registered Users Directory ({total})
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Store accounts and authorization permission tiers
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-400">Loading user registry...</div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Primary City</th>
                  <th className="py-3 px-3 text-right">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#F4F4F6] transition-colors">
                    <td className="py-4 px-3">
                      <p className="font-bold text-[#0C0C0E]">{u.name}</p>
                      <p className="text-[11px] text-neutral-400">{u.email}</p>
                    </td>

                    <td className="py-4 px-3">
                      <Badge
                        variant={u.role === 'admin' ? 'dark' : 'neutral'}
                        size="xs"
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-4 px-3 text-neutral-500 font-mono">
                      {u.phone || '—'}
                    </td>

                    <td className="py-4 px-3 text-neutral-500">
                      {u.shippingAddress?.city
                        ? `${u.shippingAddress.city}, ${u.shippingAddress.state || ''}`
                        : '—'}
                    </td>

                    <td className="py-4 px-3 text-right text-neutral-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-neutral-400 py-8 text-center">No users registered yet.</p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
    </div>
  );
};
