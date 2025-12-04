import { useEffect, useMemo, useState } from "react";
import {
  LuMail,
  LuPhone,
  LuCalendar,
  LuUser,
  LuPencilLine,
  LuCamera,
  LuTrash2,
  LuArrowLeft,          
} from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../components/default/Navbar.jsx";
import Footer from "../../../components/default/Footer.jsx";
import BusLoader from "../../../components/default/BusLoader.jsx";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx"; 
import {
  getProfile,
  updatePassword,
  updateProfile,
  deleteAccount,
} from "../../../api/apiUser.jsx";
import defaultAvatar from "../../../assets/user_default.png";
import { toast } from "react-toastify";
import { alertConfirm } from "../../../lib/Alert.jsx";
import { formatDate, normalizeDateForInput } from "../../../lib/FormatWaktu.js";
import { normalizeUrl } from "../../../lib/UrlPath.js";

function Profile() {
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      return null;
    }
  });
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAdminView = searchParams.get("admin") === "1";

  const [profile, setProfile] = useState({
    nama: "",
    email: "",
    no_telp: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
  });

  const [formProfile, setFormProfile] = useState({
    nama: "",
    email: "",
    no_telp: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const [pwdForm, setPwdForm] = useState({
    password_lama: "",
    password_baru: "",
    password_baru_confirmation: "",
  });
  const [pwdMessage, setPwdMessage] = useState("");
  const [pwdError, setPwdError] = useState("");
  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      try {
        setAuthUser(JSON.parse(localStorage.getItem("user")));
      } catch (err) {
        setAuthUser(null);
      }
      if (!token) {
        navigate("/login");
      }
    };

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setError("");
      try {
        const res = await getProfile();
        const tanggalRaw = res?.tanggal_lahir || "";

        setProfile({
          nama: res?.nama || "",
          email: res?.email || "",
          no_telp: res?.no_telp || "",
          tanggal_lahir: res?.tanggal_lahir || "",
          jenis_kelamin: res?.jenis_kelamin || "",
          avatar: res?.foto_user || "",
        });

        setFormProfile({
          nama: res?.nama || "",
          email: res?.email || "",
          no_telp: res?.no_telp || "",
          tanggal_lahir: normalizeDateForInput(tanggalRaw),
          jenis_kelamin: res?.jenis_kelamin || "",
        });

        if (res?.foto_user) {
          setAvatarPreview(normalizeUrl(res.foto_user));
        } else if (authUser?.foto_user) {
          setAvatarPreview(normalizeUrl(authUser.foto_user));
        }

        localStorage.setItem("user", JSON.stringify(res));
        setAuthUser(res);
      } catch (err) {
        console.log(err);
        setError("Gagal memuat profil.");
      } finally {
        setLoadingProfile(false);
      }
    };

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return undefined;
    }

    syncAuth();
    fetchProfile();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [navigate]);

  const handleProfileChange = (e) => {
    setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;

    setMessage("");
    setError("");
    setSavingProfile(true);

    try {
      const formData = new FormData();
      formData.append("nama", profile.nama || "");
      formData.append("email", profile.email || "");
      formData.append("no_telp", profile.no_telp || "");
      formData.append("tanggal_lahir", normalizeDateForInput(profile.tanggal_lahir) || "");
      formData.append("jenis_kelamin", profile.jenis_kelamin || "");
      formData.append("foto_user", avatarFile);

      await updateProfile(formData);

      const latest = await getProfile();
      const avatarPath = latest?.foto_user || "";
      const avatarUrlLocal = avatarPath ? normalizeUrl(avatarPath) : "";

      setProfile((prev) => ({
        ...prev,
        nama: latest?.nama || prev.nama,
        email: latest?.email || prev.email,
        no_telp: latest?.no_telp || prev.no_telp,
        tanggal_lahir: latest?.tanggal_lahir || prev.tanggal_lahir,
        jenis_kelamin: latest?.jenis_kelamin || prev.jenis_kelamin,
        avatar: avatarPath,
      }));

      if (avatarUrlLocal) {
        setAvatarPreview(avatarUrlLocal);
      }

      localStorage.setItem("user", JSON.stringify(latest));
      setAuthUser(latest);
      setMessage("Foto profil berhasil diperbarui.");
      toast.success("Foto profil berhasil diperbarui.");
      setAvatarFile(null);
    } catch (err) {
      console.log(err);
      let apiMsg = "Gagal memperbarui foto profil.";
      const data = err.response?.data || err;

      if (data?.errors && typeof data.errors === "object") {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey && data.errors[firstKey]?.length) {
          apiMsg = data.errors[firstKey][0];
        }
      } else if (typeof data?.message === "string") {
        apiMsg = data.message;
      }

      setError(apiMsg);
      toast.error(apiMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const validateDataProfile = () => {
    if (
      !formProfile.nama ||
      !formProfile.email ||
      !formProfile.no_telp ||
      !formProfile.tanggal_lahir ||
      !formProfile.jenis_kelamin
    ) {
      setError("Data inputan tidak boleh kosong");
      toast.error("Data inputan tidak boleh kosong");
      return false;
    }

    if (!/^[0-9]{10,13}$/.test(formProfile.no_telp)) {
      setError("No telepon harus berupa 10-13 digit angka");
      toast.error("No telepon harus berupa 10-13 digit angka");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formProfile.email)) {
      setError("Format email tidak valid");
      toast.error("Format email tidak valid");
      return false;
    }

    setError("");
    return true;
  };

  const handleSaveProfile = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    setMessage("");
    setError("");

    const isValid = validateDataProfile();
    if (!isValid) return;

    setSavingProfile(true);

    try {
      let payload;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("nama", formProfile.nama);
        formData.append("email", formProfile.email);
        formData.append("no_telp", formProfile.no_telp);
        formData.append("tanggal_lahir", formProfile.tanggal_lahir || "");
        formData.append("jenis_kelamin", formProfile.jenis_kelamin || "");
        formData.append("foto_user", avatarFile);
        payload = formData;
      } else {
        payload = formProfile;
      }

      const res = await updateProfile(payload);
      const updatedAvatar = res?.user?.foto_user || res?.foto_user;

      let avatarUrlLocal = profile.avatar || "";
      if (updatedAvatar) {
        avatarUrlLocal = normalizeUrl(updatedAvatar);
        setAvatarPreview(avatarUrlLocal);
      }

      setProfile((prev) => ({
        ...prev,
        ...formProfile,
        avatar: avatarUrlLocal,
      }));

      const mergedUser = {
        ...(res?.user || authUser || {}),
        ...formProfile,
        avatar: avatarUrlLocal,
        foto_user: res?.user?.foto_user || res?.foto_user || avatarUrlLocal,
      };
      localStorage.setItem("user", JSON.stringify(mergedUser));
      setAuthUser(mergedUser);

      setMessage("Profil berhasil diperbarui.");
      toast.success("Profil berhasil diperbarui.");
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      let apiMsg = "Gagal memperbarui profil.";
      setError(apiMsg);
      toast.error(apiMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  };

  const validateDataPassword = () => {
    if (
      !pwdForm.password_lama ||
      !pwdForm.password_baru ||
      !pwdForm.password_baru_confirmation
    ) {
      setPwdError("Password tidak boleh kosong");
      toast.error("Password tidak boleh kosong");
      return false;
    }

    if (pwdForm.password_baru_confirmation !== pwdForm.password_baru) {
      setPwdError("Password baru tidak sama");
      toast.error("Password baru tidak sama");
      return false;
    }

    if (
      pwdForm.password_baru.length < 8 ||
      pwdForm.password_baru_confirmation.length < 8
    ) {
      setPwdError("Password minimal 8 karakter");
      toast.error("Password minimal 8 karakter");
      return false;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwdForm.password_baru)) {
      setPwdError(
        "Password baru harus mengandung minimal 1 karakter spesial (misalnya !,@,#, dll)"
      );
      toast.error(
        "Password baru harus mengandung minimal 1 karakter spesial (misalnya !,@,#, dll)"
      );
      return false;
    }

    setPwdError("");
    return true;
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setMessage("");
    setError("");
    setPwdMessage("");
    setPwdError("");

    const isValid = validateDataPassword();
    if (!isValid) {
      setSavingPassword(false);
      return;
    }

    try {
      const res = await updatePassword(pwdForm);
      const successMsg = res?.message || "Password berhasil diubah.";

      setMessage(successMsg);
      setPwdMessage(successMsg);
      toast.success(successMsg);

      setPwdForm({
        password_lama: "",
        password_baru: "",
        password_baru_confirmation: "",
      });
    } catch (err) {
      const data = err.response?.data;
      let apiMsg = "Gagal mengubah password.";

      if (data?.message) apiMsg = data.message;
      else if (data?.errors && typeof data.errors === "object") {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey && data.errors[firstKey]?.length) {
          apiMsg = data.errors[firstKey][0];
        }
      }

      setError(apiMsg);
      setPwdError(apiMsg);
      toast.error(apiMsg);
    } finally {
      setSavingPassword(false);
    }
  };

  const profileDateLabel = useMemo(
    () => formatDate(profile.tanggal_lahir),
    [profile.tanggal_lahir]
  );

  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleHapusAccount = async () => {
    const confirmed = await alertConfirm({
      title: "Hapus akun?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!confirmed) return;

    setLoadingDelete(true);
    try {
      await deleteAccount();
      clearSession();
      toast.success("Akun berhasil dihapus");
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menghapus akun.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoadingDelete(false);
    }
  };


  if (loadingProfile) {
    if (isAdminView) {
      return (
        <div className="min-h-screen flex bg-orange-50">
          <NavbarAdmin />
          <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <p className="text-slate-600 text-sm">Memuat profil...</p>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar/>
        <main className="flex-1 flex items-center justify-center pt-6 md:pt-24 px-4">
          <BusLoader message="Memuat profil..." />
        </main>
        <Footer />
      </div>
    );
  }

  const cards = (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-4 md:mt-0">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative group">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-slate-200">
              <img
                src={
                  avatarPreview || normalizeUrl(profile.avatar) || defaultAvatar
                }
                alt={profile.nama || "Avatar"}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute inset-0 rounded-full cursor-pointer">
              <div className="flex items-center justify-center h-full w-full rounded-full bg-black/45 opacity-0 group-hover:opacity-100 transition text-white gap-2 text-xs md:text-sm font-semibold">
                <LuPencilLine className="h-4 w-4" />
                <span>Edit foto</span>
              </div>
              <span className="absolute -right-2 -bottom-2 h-8 w-8 md:h-9 md:w-9 rounded-full bg-white shadow-md shadow-black/20 flex items-center justify-center text-slate-700 border border-slate-200">
                <LuPencilLine className="h-4 w-4" />
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-slate-900">
              {profile.nama || "-"}
            </h1>
            <p className="text-sm text-slate-600">{profile.email || "-"}</p>
          </div>
          {avatarFile && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAvatarFile(null);
                  setAvatarPreview(
                    profile.avatar ? normalizeUrl(profile.avatar) : ""
                  );
                }}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <LuTrash2 className="h-4 w-4" />
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-base md:text-lg font-semibold text-slate-900">
            Informasi Akun
          </h3>
          <button
            type="button"
            onClick={() => {
              setIsEditing((prev) => {
                const next = !prev;
                if (!prev) {
                  setFormProfile({
                    nama: profile.nama || "",
                    email: profile.email || "",
                    no_telp: profile.no_telp || "",
                    tanggal_lahir: normalizeDateForInput(
                      profile.tanggal_lahir
                    ),
                    jenis_kelamin: profile.jenis_kelamin || "",
                  });
                }
                return next;
              });
            }}
            className="self-start md:self-auto flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold"
          >
            <LuPencilLine className="h-4 w-4" />
            {isEditing ? "Batal" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <LuUser className="h-4 w-4 text-slate-500" /> Nama Lengkap
              </label>
              {isEditing ? (
                <input
                  name="nama"
                  value={formProfile.nama}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Nama lengkap"
                />
              ) : (
                <p className="text-sm text-slate-900">
                  {formProfile.nama || "-"}
                </p>
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
                  value={formProfile.email}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="email@example.com"
                />
              ) : (
                <p className="text-sm text-slate-900">
                  {formProfile.email || "-"}
                </p>
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
                  value={formProfile.no_telp}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="08xx-xxxx-xxxx"
                />
              ) : (
                <p className="text-sm text-slate-900">
                  {formProfile.no_telp || "-"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <LuCalendar className="h-4 w-4 text-slate-500" /> Tanggal
                Lahir
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formProfile.tanggal_lahir || ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-sm text-slate-900">{profileDateLabel}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Jenis Kelamin
            </label>
            {isEditing ? (
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="Laki-laki"
                    checked={formProfile.jenis_kelamin === "Laki-laki"}
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
                    checked={formProfile.jenis_kelamin === "Perempuan"}
                    onChange={handleProfileChange}
                    className="h-4 w-4 text-[#f38f4a] focus:ring-[#f38f4a]"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            ) : (
              <p className="text-sm text-slate-900">
                {formProfile.jenis_kelamin || "-"}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex flex-wrap justify-end gap-3 pt-2">
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
        <div className="mb-4">
          <h3 className="text-base md:text-lg font-semibold text-slate-900">
            Keamanan Akun
          </h3>
          {pwdError && (
            <p className="mt-1 text-xs text-red-600">{pwdError}</p>
          )}
          {pwdMessage && (
            <p className="mt-1 text-xs text-emerald-600">{pwdMessage}</p>
          )}
        </div>

        <form onSubmit={handleSavePassword} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Password Lama
            </label>
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
            <label className="text-sm font-semibold text-slate-700">
              Password Baru
            </label>
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
            <label className="text-sm font-semibold text-slate-700">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              name="password_baru_confirmation"
              value={pwdForm.password_baru_confirmation}
              onChange={handlePwdChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Konfirmasi password baru"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                setPwdForm({
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
          <h4 className="text-base font-semibold text-slate-900 mb-2">
            Hapus Akun
          </h4>
          <p className="text-sm text-slate-600 mb-4">
            Hapus akun secara permanen.
          </p>
          <button
            type="button"
            disabled={loadingDelete}
            onClick={handleHapusAccount}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
          >
            <MdDelete className="h-4 w-4" />
            {loadingDelete ? "Menghapus..." : "Hapus Akun"}
          </button>
        </div>
      </div>
    </>
  );

  //return khusus admin 
  if (isAdminView) {
    return (
      <div className="min-h-screen flex bg-orange-50">
        <NavbarAdmin />
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-orange-900">
                  Profil Admin
                </h1>
                <p className="text-xs sm:text-sm text-orange-700 mt-1">
                  Kelola profil akun admin
                </p>
              </div>
            </div>

            {cards}
          </div>
        </main>
      </div>
    );
  }

  //return untuk user
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pl-14 md:pl-0 pt-4 md:pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4 space-y-6">{cards}</div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
