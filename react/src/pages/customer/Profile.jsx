import { useEffect, useMemo, useState } from "react";
import { LuMail, LuPhone, LuCalendar, LuUser, LuPencilLine, LuCamera, LuTrash2, LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/default/Navbar.jsx";
import Footer from "../../components/default/Footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getProfile, updatePassword, updateProfile } from "../../api/apiUser.jsx";
import { BASE_URL } from "../../api/index.jsx";
import defaultAvatar from "../../assets/user_default.png";

// Format tanggal ke bahasa Indonesia agar label lebih ramah.
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Backend biasanya mengirim path relatif (mis. storage/avatars/file.jpg).
// Fungsi ini memastikan path tersebut selalu jadi URL lengkap yang bisa diakses <img>.
const normalizeUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return url.startsWith("/")
    ? `${BASE_URL}${url}`
    : `${BASE_URL}/${url}`;
};

function Profile() {
  const { isAuthenticated, user: authUser, refreshAuth, logout } = useAuth();
  const navigate = useNavigate();

  // State utama data profil (field text yang dikirim ke backend).
  const [profile, setProfile] = useState({
    nama: "",
    email: "",
    no_telp: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
  });

  // Flag loading untuk fetch profil pertama kali.
  const [loadingProfile, setLoadingProfile] = useState(true);
  // Flag loading untuk simpan profil (nama/email/dll dan avatar).
  const [savingProfile, setSavingProfile] = useState(false);
  // Flag loading untuk simpan password.
  const [savingPassword, setSavingPassword] = useState(false);
  // Pesan sukses (ditampilkan di banner hijau).
  const [message, setMessage] = useState("");
  // Pesan error (ditampilkan di banner merah).
  const [error, setError] = useState("");
  // Apakah form profil sedang mode edit (input aktif) atau view-only.
  const [isEditing, setIsEditing] = useState(false);
  // Preview avatar yang ditampilkan pada <img>.
  const [avatarPreview, setAvatarPreview] = useState("");
  // File avatar yang dipilih user (untuk diupload).
  const [avatarFile, setAvatarFile] = useState(null);

  // State form password (harus sesuai nama field backend).
  const [pwdForm, setPwdForm] = useState({
    password_lama: "",
    password_baru: "",
    password_baru_confirmation: "",
  });
  // Pesan khusus blok password (biar jelas tanpa scroll ke atas).
  const [pwdMessage, setPwdMessage] = useState("");
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Ambil profil saat pertama buka halaman dan ketika data auth berubah.
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setError("");
      try {
        const res = await getProfile();
        setProfile({
          nama: res?.nama || "",
          email: res?.email || "",
          no_telp: res?.no_telp || "",
          tanggal_lahir: res?.tanggal_lahir || "",
          jenis_kelamin: res?.jenis_kelamin || "",
          avatar: res?.foto_user || "",
        });
        if (res?.foto_user) {
          setAvatarPreview(normalizeUrl(res.foto_user));
        } else if (authUser?.foto_user) {
          setAvatarPreview(normalizeUrl(authUser.foto_user));
        }

      } catch (err) {
        console.log(err);
        setError("Gagal memuat profil.");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, authUser]);

  // Update state profil ketika input teks berubah.
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Saat pilih file avatar baru, simpan file dan tampilkan preview lokal.
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setSavingProfile(true);
    setMessage("");
    setError("");

    try {
      // Jika ada file baru, kirim pakai FormData supaya backend menerima binary + field lainnya.
      let payload = profile;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("nama", profile.nama);
        formData.append("email", profile.email);
        formData.append("no_telp", profile.no_telp);
        formData.append("tanggal_lahir", profile.tanggal_lahir || "");
        formData.append("jenis_kelamin", profile.jenis_kelamin || "");
        formData.append("foto_user", avatarFile);
        payload = formData;
      }

      const res = await updateProfile(payload);
      const updatedAvatar = res?.user?.foto_user || res?.foto_user;
      if (updatedAvatar) {
        // Backend mengembalikan path relatif (tersimpan di app/public/storage).
        // Simpan di state dalam bentuk URL penuh supaya <img> langsung bisa load.
        const url = normalizeUrl(updatedAvatar);
        setAvatarPreview(url);
        setProfile((prev) => ({ ...prev, avatar: url }));
        await refreshAuth();
      }
      setMessage("Profil berhasil diperbarui.");
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      const apiMsg =
        err?.message ||
        err?.error ||
        err?.errors ||
        "Gagal memperbarui profil.";
      setError(apiMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  // Update state form password ketika input password berubah.
  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setMessage("");
    setError("");
    setPwdMessage("");
    setPwdError("");

    try {
      // Kirim ke backend; ambil pesan sukses dari respons jika ada.
      const res = await updatePassword(pwdForm);
      const successMsg = res?.message || "Password berhasil diubah.";
      setMessage(successMsg); // banner atas (umum)
      setError("");
      setPwdMessage(successMsg); // banner khusus password
      setPwdError("");
      console.log("Password updated", res);
      setPwdForm({
        password_lama: "",
        password_baru: "",
        password_baru_confirmation: "",
      });
    } catch (err) {
      console.log(err);
      const apiMsg =
        err?.message ||
        err?.error ||
        err?.errors ||
        "Gagal mengubah password.";
      setError(apiMsg); // banner atas (umum)
      setPwdError(apiMsg); // banner khusus password
    } finally {
      setSavingPassword(false);
    }
  };

  const profileDateLabel = useMemo(
    () => formatDate(profile.tanggal_lahir),
    [profile.tanggal_lahir]
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 text-sm">Memuat profil...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {message && (
            <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Kartu avatar + info singkat */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-200">
                  <img
                    src={avatarPreview || normalizeUrl(profile.avatar) || defaultAvatar}
                    alt={profile.nama || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer text-white gap-2 text-sm font-semibold">
                  <LuCamera />
                  <span>Ganti foto</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{profile.nama || "-"}</h1>
                <p className="text-sm text-slate-600">{profile.email || "-"}</p>
              </div>
              {avatarFile && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(profile.avatar ? normalizeUrl(profile.avatar) : "");
                    }}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <LuTrash2 className="h-4 w-4" />
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveProfile()}
                    disabled={savingProfile}
                    className="flex items-center gap-1 rounded-lg bg-[#2563eb] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-60"
                  >
                    <LuCamera className="h-4 w-4" />
                    {savingProfile ? "Menyimpan..." : "Simpan Foto"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Informasi akun */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Informasi Akun</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <LuPencilLine className="h-4 w-4" />
                  {isEditing ? "Batal" : "Edit"}
                </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <LuUser className="h-4 w-4 text-slate-500" /> Nama Lengkap
                  </label>
                  {isEditing ? (
                    <input
                      name="nama"
                      value={profile.nama}
                      onChange={handleProfileChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      placeholder="Nama lengkap"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{profile.nama || "-"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <LuMail className="h-4 w-4 text-slate-500" /> Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      placeholder="email@example.com"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{profile.email || "-"}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <LuPhone className="h-4 w-4 text-slate-500" /> No. Telepon
                  </label>
                  {isEditing ? (
                    <input
                      name="no_telp"
                      value={profile.no_telp}
                      onChange={handleProfileChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      placeholder="08xx-xxxx-xxxx"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{profile.no_telp || "-"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <LuCalendar className="h-4 w-4 text-slate-500" /> Tanggal Lahir
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="tanggal_lahir"
                      value={profile.tanggal_lahir || ""}
                      onChange={handleProfileChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{profileDateLabel}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Jenis Kelamin</label>
                {isEditing ? (
                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="jenis_kelamin"
                        value="Laki-laki"
                        checked={profile.jenis_kelamin === "Laki-laki"}
                        onChange={handleProfileChange}
                        className="h-4 w-4 text-[#f38f4a] focus:ring-[#f38f4a]"
                      />
                      <span>Laki-laki</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="jenis_kelamin"
                        value="Perempuan"
                        checked={profile.jenis_kelamin === "Perempuan"}
                        onChange={handleProfileChange}
                        className="h-4 w-4 text-[#f38f4a] focus:ring-[#f38f4a]"
                      />
                      <span>Perempuan</span>
                    </label>
                  </div>
                ) : (
                  <p className="text-sm text-slate-900">{profile.jenis_kelamin || "-"}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="rounded-full bg-[#f38f4a] px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-brand-600 hover:-translate-y-0.5 transition-all disabled:opacity-60"
                  >
                    {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Keamanan Akun */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Keamanan Akun</h3>
            </div>

            {/* Banner khusus hasil ubah password */}
            {(pwdMessage || pwdError) && (
              <div
                className={`rounded-xl px-4 py-3 text-sm mb-4 ${
                  pwdMessage
                    ? "border border-green-100 bg-green-50 text-green-700"
                    : "border border-red-100 bg-red-50 text-red-700"
                }`}
              >
                {pwdMessage || pwdError}
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password Lama</label>
                <input
                  type="password"
                  name="password_lama"
                  value={pwdForm.password_lama}
                  onChange={handlePwdChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Masukkan password lama"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Password Baru</label>
                <input
                  type="password"
                  name="password_baru"
                  value={pwdForm.password_baru}
                  onChange={handlePwdChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Masukkan password baru"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  name="password_baru_confirmation"
                  value={pwdForm.password_baru_confirmation}
                  onChange={handlePwdChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Konfirmasi password baru"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setPwdForm({
                      // gunakan nama field yang dipakai form ini
                      password_lama: "",
                      password_baru: "",
                      password_baru_confirmation: "",
                    })
                  }
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-full bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#1d4ed8] hover:-translate-y-0.5 transition-all disabled:opacity-60"
                >
                  {savingPassword ? "Memproses..." : "Ubah Password"}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h4 className="text-base font-semibold text-slate-900 mb-2">Keluar Akun</h4>
              <p className="text-sm text-slate-600 mb-4">
                Hentikan sesi dan kembali ke halaman masuk.
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                <LuLogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
