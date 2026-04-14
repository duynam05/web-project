import React, { useEffect, useState } from 'react';
import { User, LogOut, Edit2, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl } from '../config/api';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(buildApiUrl('/users/my-info'), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();
        const userData = data.result || data;

        setProfile(userData);
        setForm({
          fullName: userData.fullName || '',
          phone: userData.phone || '',
          address: userData.address || ''
        });
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(buildApiUrl('/users/me'), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      const updatedProfile = data.result || { ...profile, ...form };

      setProfile(updatedProfile);
      setForm({
        fullName: updatedProfile.fullName || '',
        phone: updatedProfile.phone || '',
        address: updatedProfile.address || ''
      });
      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi!");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Đăng xuất?")) {
      logout();
      navigate('/');
    }
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-8">
        <User className="text-blue-600" size={28} />
        <h1 className="text-3xl font-bold">Tài Khoản</h1>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-center mb-6">
            <img
              src="https://via.placeholder.com/150"
              className="w-24 h-24 rounded-full mx-auto mb-3"
              alt=""
            />
            <h2 className="font-bold text-lg">{profile.fullName}</h2>
            <p className="text-gray-500">{profile.email}</p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Họ tên"
                className="w-full border p-2 rounded"
              />

              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Số điện thoại"
                className="w-full border p-2 rounded"
              />

              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Địa chỉ"
                className="w-full border p-2 rounded"
              />

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded">
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 py-2 rounded"
                >
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{profile.phone || "Chưa có"}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{profile.address || "Chưa có"}</span>
              </div>

              <hr />

              <button
                onClick={() => setIsEditing(true)}
                className="w-full border py-2 rounded flex items-center justify-center gap-2"
              >
                <Edit2 size={16} /> Chỉnh sửa
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-100 text-red-600 py-2 rounded flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
