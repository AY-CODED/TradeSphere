// src/pages/VendorWorkspace.jsx (With 85%/15% Commission Split, Auto-Resolve NUBAN, Product Video & Order Packing Video Upload)
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  Check,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  Film,
  History,
  ImagePlus,
  Landmark,
  LayoutDashboard,
  Package,
  Pencil,
  Plus,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  UsersRound,
  Video,
  Wallet,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/Logo.png';
import LogoutButton from '../components/auth/LogoutButton';
import { useAuth } from '../hooks/useAuth';
import {
  createProduct,
  deleteProduct as deleteProductApi,
  getNotifications,
  getVendorOrders,
  getVendorPayments,
  getVendorProducts,
  markAllNotificationsRead,
  markNotificationRead,
  resolveAccountNumber,
  updateProduct as updateProductApi,
  withdrawVendorFunds,
} from '../api/auth';
import { uploadImageToCloudinary, uploadVideoToCloudinary } from '../utils/cloudinary';
import { formatPrice } from '../utils/formatPrice';

const NIGERIAN_BANKS = [
  { name: 'Access Bank', code: '044' },
  { name: 'Citibank Nigeria', code: '023' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'First City Monument Bank (FCMB)', code: '214' },
  { name: 'Globus Bank', code: '00103' },
  { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Kuda Bank', code: '50211' },
  { name: 'Moniepoint MFB', code: '50515' },
  { name: 'OPay Digital Services (Paycom)', code: '999992' },
  { name: 'PalmPay', code: '999991' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'Unity Bank', code: '215' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Zenith Bank', code: '057' },
];

const navigation = [
  { label: 'Overview', icon: LayoutDashboard, description: 'Your business at a glance' },
  { label: 'Orders', icon: ShoppingBag, description: 'Manage incoming orders and upload packing video proofs' },
  { label: 'Products', icon: Package, description: 'Manage your product catalogue' },
  { label: 'Inventory', icon: Boxes, description: 'Keep stock up to date' },
  { label: 'Analytics', icon: BarChart3, description: 'Understand your performance' },
  { label: 'Customers', icon: UsersRound, description: 'Build buyer relationships' },
  { label: 'Payouts', icon: Wallet, description: 'Review your payment and escrow activity' },
  { label: 'Activity', icon: History, description: 'Review actions recorded in this workspace session' },
  { label: 'Settings', icon: Settings2, description: 'Manage business preferences' },
];

const sectionEmptyStates = {
  Orders: {
    icon: ShoppingBag,
    title: 'Your orders will show up here',
    description: 'When buyers place orders with your business, you can review details and manage fulfilment here.',
  },
  Products: {
    icon: Package,
    title: 'Start building your catalogue',
    description: 'Add your first product to prepare your TradeSphere storefront for buyers.',
  },
  Inventory: {
    icon: Boxes,
    title: 'No inventory to track yet',
    description: 'Your stock levels will appear here after products are added to your vendor catalogue.',
  },
  Analytics: {
    icon: BarChart3,
    title: 'Your performance insights are on the way',
    description: 'Once your store records orders, this space will show your sales and marketplace trends.',
  },
  Customers: {
    icon: UsersRound,
    title: 'Your customer list is ready to grow',
    description: 'Buyers who place orders with your business will appear here.',
  },
  Payouts: {
    icon: Wallet,
    title: 'Payout activity will appear here',
    description: 'Escrow holds and released payouts appear here as buyers purchase your products.',
  },
  Activity: {
    icon: History,
    title: 'No activity yet',
    description: 'Workspace activity will appear here as you move between sections and manage your catalogue.',
  },
  Settings: {
    icon: Settings2,
    title: 'Business settings',
    description: 'Your vendor profile and workspace preferences are managed through your TradeSphere account.',
  },
};

const initialProductForm = {
  productName: '',
  category: '',
  sku: '',
  price: '',
  quantity: '',
  description: '',
  imageUrl: '',
  videoUrl: '',
};

const initialWithdrawForm = {
  bankCode: '058',
  bankName: 'Guaranty Trust Bank (GTBank)',
  accountNumber: '',
  accountName: '',
};

const VendorWorkspace = () => {
  const [activeSection, setActiveSection] = useState('Overview');
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const [vendorActivity, setVendorActivity] = useState([]);
  const [formValues, setFormValues] = useState(initialProductForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [dataError, setDataError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Order Packing Video Proof Modal State
  const [packingModalOrder, setPackingModalOrder] = useState(null);
  const [packingVideoFile, setPackingVideoFile] = useState(null);
  const [packingVideoPreview, setPackingVideoPreview] = useState('');
  const [packingVideoUrl, setPackingVideoUrl] = useState('');
  const [isUploadingPackingProof, setIsUploadingPackingProof] = useState(false);
  const [packingProofError, setPackingProofError] = useState('');

  // Withdrawal Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState(initialWithdrawForm);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isResolvingAccount, setIsResolvingAccount] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  const { user } = useAuth();
  const vendorId = user?.id;
  const workspaceLoading = Boolean(vendorId) && isLoading;
  const vendorName = user?.businessName || user?.fullName || user?.name || user?.email || 'Your business';
  const initials = vendorName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!vendorId) return undefined;
    let active = true;
    Promise.all([
      getVendorProducts(vendorId),
      getVendorOrders(vendorId),
      getVendorPayments(vendorId).catch(() => []),
      getNotifications().catch(() => []),
    ])
      .then(([fetchedProducts, fetchedOrders, fetchedPayments, fetchedNotifications]) => {
        if (!active) return;
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
        setPayments(Array.isArray(fetchedPayments) ? fetchedPayments : []);
        setNotifications(Array.isArray(fetchedNotifications) ? fetchedNotifications : []);
        setDataError('');
      })
      .catch((error) => {
        if (active) {
          setDataError(error instanceof Error ? error.message : 'Unable to load vendor workspace data.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [vendorId, refreshKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  useEffect(() => {
    return () => {
      if (packingVideoPreview && packingVideoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(packingVideoPreview);
      }
    };
  }, [packingVideoPreview]);

  const grossSales = useMemo(() => {
    return orders.reduce((sum, order) => {
      const vendorItems = (order.items || []).filter((item) => !vendorId || item.vendorId === vendorId);
      const orderSubtotal = vendorItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );
      return sum + (orderSubtotal || Number(order.totalAmount || 0));
    }, 0);
  }, [orders, vendorId]);

  const escrowBalance = useMemo(
    () =>
      payments
        .filter((p) => p.status === 'ESCROW_HELD')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  const releasedBalance = useMemo(
    () =>
      payments
        .filter((p) => p.status === 'RELEASED')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  const withdrawnGrossBalance = useMemo(
    () =>
      payments
        .filter((p) => p.status === 'WITHDRAWN')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  // 85% / 15% split calculations for vendor transparency
  const vendorNetAvailable = useMemo(() => Math.round(releasedBalance * 0.85 * 100) / 100, [releasedBalance]);
  const platformFeeOnAvailable = useMemo(() => Math.round(releasedBalance * 0.15 * 100) / 100, [releasedBalance]);
  const withdrawnNetBalance = useMemo(() => Math.round(withdrawnGrossBalance * 0.85 * 100) / 100, [withdrawnGrossBalance]);

  const totalUnitsInStock = useMemo(
    () => products.reduce((sum, p) => sum + Number(p.stock || 0), 0),
    [products]
  );

  const dashboardMetrics = [
    {
      label: 'Gross sales',
      icon: Wallet,
      value: formatPrice ? formatPrice(grossSales) : `₦${grossSales.toFixed(2)}`,
      subtext: `${orders.length} total order(s)`,
    },
    {
      label: 'Orders to fulfil',
      icon: ShoppingBag,
      value: String(orders.filter((o) => o.status === 'PENDING' || o.status === 'PAID').length),
      subtext: 'Awaiting shipment',
    },
    {
      label: 'Active products',
      icon: Package,
      value: String(products.length),
      subtext: `${totalUnitsInStock} total unit(s) in stock`,
    },
    {
      label: 'Escrow balance',
      icon: ShieldCheck,
      value: formatPrice ? formatPrice(escrowBalance) : `₦${escrowBalance.toFixed(2)}`,
      subtext: `Net Available (85%): ${formatPrice ? formatPrice(vendorNetAvailable) : `₦${vendorNetAvailable.toFixed(2)}`}`,
    },
  ];

  const handleMarkNotificationRead = async (notif) => {
    if (!notif.read) {
      try {
        await markNotificationRead(notif.id);
        setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
      } catch {
        // ignore
      }
    }
    setNotifOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const openProductForm = () => {
    setEditingProductId(null);
    setProductError('');
    setFormValues(initialProductForm);
    setImageFile(null);
    setImagePreview('');
    setVideoFile(null);
    setVideoPreview('');
    setProductFormOpen(true);
  };

  const openEditProductForm = (product) => {
    setEditingProductId(product.id);
    setProductError('');
    setFormValues({
      productName: product.name || product.productName || '',
      category: product.category || '',
      sku: product.sku || '',
      price: product.price !== undefined && product.price !== null ? String(product.price) : '',
      quantity: product.stock !== undefined && product.stock !== null ? String(product.stock) : '0',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      videoUrl: product.videoUrl || '',
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || '');
    setVideoFile(null);
    setVideoPreview(product.videoUrl || '');
    setProductFormOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    const productTitle = product.name || product.productName || 'this product';
    if (!window.confirm(`Delete "${productTitle}" from your catalogue?`)) return;

    setDeletingProductId(product.id);
    setDataError('');
    setProductSuccess('');
    try {
      await deleteProductApi(product.id);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      setProductSuccess(`"${productTitle}" was deleted from your catalogue.`);
      setVendorActivity((current) => [
        {
          id: `DELETE-${Date.now()}`,
          action: 'Deleted a product',
          detail: `Removed ${productTitle} from the catalogue.`,
          time: new Date().toLocaleString(),
        },
        ...current,
      ]);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Unable to delete product.');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleFieldChange = (field) => (event) => {
    setFormValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleImageSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProductError('Choose a valid image file.');
      event.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setProductError('The image must be 10MB or smaller.');
      event.target.value = '';
      return;
    }
    setProductError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormValues((current) => ({ ...current, imageUrl: '' }));
  };

  const handleVideoSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setProductError('Choose a valid video file (MP4, MOV, WebM).');
      event.target.value = '';
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setProductError('The video must be 50MB or smaller.');
      event.target.value = '';
      return;
    }
    setProductError('');
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearSelectedVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    setFormValues((current) => ({ ...current, videoUrl: '' }));
  };

  const submitProductForm = async (event) => {
    event.preventDefault();
    if (!vendorId) {
      setProductError('Your vendor account could not be identified. Please sign in again.');
      return;
    }

    const price = Number(formValues.price);
    const stock = Number(formValues.quantity);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      setProductError('Enter a valid non-negative price and whole-number quantity.');
      return;
    }

    setIsSubmitting(true);
    setProductError('');
    try {
      const imageUrl = imageFile
        ? await uploadImageToCloudinary(imageFile)
        : formValues.imageUrl.trim();

      const videoUrl = videoFile
        ? await uploadVideoToCloudinary(videoFile)
        : formValues.videoUrl.trim();

      if (editingProductId) {
        const updated = await updateProductApi(editingProductId, {
          name: formValues.productName.trim(),
          category: formValues.category.trim(),
          sku: formValues.sku.trim(),
          price,
          stock,
          description: formValues.description.trim(),
          imageUrl,
          videoUrl,
        });
        setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setProductSuccess(`"${updated.name}" has been updated.`);
      } else {
        await createProduct({
          name: formValues.productName.trim(),
          category: formValues.category.trim(),
          sku: formValues.sku.trim(),
          price,
          stock,
          description: formValues.description.trim(),
          imageUrl,
          videoUrl,
          vendorId,
          vendorName,
        });
        setProductSuccess('Product added to your catalogue.');
        setIsLoading(true);
        setRefreshKey((current) => current + 1);
      }

      setEditingProductId(null);
      setProductFormOpen(false);
    } catch (error) {
      setProductError(error instanceof Error ? error.message : 'Unable to save this product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Order Packing Video Proof Handlers ---
  const openPackingModal = (order) => {
    setPackingProofError('');
    setPackingVideoFile(null);
    setPackingVideoPreview(order.packingVideoUrl || '');
    setPackingVideoUrl(order.packingVideoUrl || '');
    setPackingModalOrder(order);
  };

  const handlePackingVideoSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setPackingProofError('Please select a valid video file (MP4, MOV, WebM).');
      event.target.value = '';
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setPackingProofError('Video must be 50MB or smaller.');
      event.target.value = '';
      return;
    }
    setPackingProofError('');
    setPackingVideoFile(file);
    setPackingVideoPreview(URL.createObjectURL(file));
  };

  const handlePackingProofSubmit = async (event) => {
    event.preventDefault();
    if (!packingModalOrder) return;

    if (!packingVideoFile && !packingVideoUrl.trim()) {
      setPackingProofError('Please select a video file or paste a video URL.');
      return;
    }

    setIsUploadingPackingProof(true);
    setPackingProofError('');
    try {
      const uploadedUrl = packingVideoFile
        ? await uploadVideoToCloudinary(packingVideoFile)
        : packingVideoUrl.trim();

      try {
        localStorage.setItem(`ts_packing_video_${packingModalOrder.id}`, uploadedUrl);
      } catch {
        // ignore storage quota errors
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === packingModalOrder.id
            ? { ...o, packingVideoUrl: uploadedUrl, status: o.status === 'PENDING' ? 'PACKED' : o.status }
            : o
        )
      );

      setProductSuccess(`Packing video proof uploaded for Order #${String(packingModalOrder.id).slice(-6).toUpperCase()}.`);
      setVendorActivity((current) => [
        {
          id: `PACKING-VIDEO-${Date.now()}`,
          action: 'Uploaded order packing video proof',
          detail: `Attached live Cloudinary video verification for Order #${packingModalOrder.id}.`,
          time: new Date().toLocaleString(),
        },
        ...current,
      ]);
      setPackingModalOrder(null);
    } catch (error) {
      setPackingProofError(error instanceof Error ? error.message : 'Unable to upload packing video.');
    } finally {
      setIsUploadingPackingProof(false);
    }
  };

  const openWithdrawModal = () => {
    setWithdrawError('');
    setWithdrawForm({
      bankCode: NIGERIAN_BANKS[7].code, // Default GTBank (058)
      bankName: NIGERIAN_BANKS[7].name,
      accountNumber: '',
      accountName: '',
    });
    setWithdrawModalOpen(true);
  };

  const handleBankChange = async (event) => {
    const selectedCode = event.target.value;
    const bankObj = NIGERIAN_BANKS.find((b) => b.code === selectedCode);
    const currentAccNum = withdrawForm.accountNumber;

    setWithdrawForm((prev) => ({
      ...prev,
      bankCode: selectedCode,
      bankName: bankObj ? bankObj.name : '',
      accountName: '',
    }));

    if (currentAccNum.length === 10 && selectedCode) {
      setIsResolvingAccount(true);
      setWithdrawError('');
      try {
        const res = await resolveAccountNumber(currentAccNum, selectedCode);
        const resolvedName = res?.data?.account_name;
        if (resolvedName) {
          setWithdrawForm((prev) => ({ ...prev, accountName: resolvedName }));
        } else {
          setWithdrawError('Could not verify account number for this bank.');
        }
      } catch {
        setWithdrawError('Account resolution failed. Please check the account number and bank.');
      } finally {
        setIsResolvingAccount(false);
      }
    }
  };

  const handleAccountNumberChange = async (event) => {
    const accNum = event.target.value.replace(/\D/g, '').slice(0, 10);
    setWithdrawForm((prev) => ({ ...prev, accountNumber: accNum, accountName: accNum.length < 10 ? '' : prev.accountName }));

    if (accNum.length === 10 && withdrawForm.bankCode) {
      setIsResolvingAccount(true);
      setWithdrawError('');
      try {
        const res = await resolveAccountNumber(accNum, withdrawForm.bankCode);
        const resolvedName = res?.data?.account_name;
        if (resolvedName) {
          setWithdrawForm((prev) => ({ ...prev, accountName: resolvedName }));
        } else {
          setWithdrawError('Could not verify account number automatically.');
        }
      } catch {
        setWithdrawError('Account resolution failed. Please check the account number and bank.');
      } finally {
        setIsResolvingAccount(false);
      }
    }
  };

  const handleWithdrawSubmit = async (event) => {
    event.preventDefault();
    if (!vendorId) return;

    if (withdrawForm.accountNumber.trim().length !== 10) {
      setWithdrawError('Please enter a valid 10-digit NUBAN bank account number.');
      return;
    }

    setIsWithdrawing(true);
    setWithdrawError('');
    try {
      const result = await withdrawVendorFunds({
        vendorId,
        bankCode: withdrawForm.bankCode,
        bankName: withdrawForm.bankName.trim(),
        accountNumber: withdrawForm.accountNumber.trim(),
        accountName: withdrawForm.accountName.trim(),
      });

      setPayments((prev) =>
        prev.map((p) => (p.status === 'RELEASED' ? { ...p, status: 'WITHDRAWN' } : p))
      );
      setProductSuccess(
        result?.message ||
          `85% net payout (${formatPrice ? formatPrice(vendorNetAvailable) : `₦${vendorNetAvailable.toFixed(2)}`}) processed to ${withdrawForm.bankName}.`
      );
      setVendorActivity((current) => [
        {
          id: `WITHDRAW-${Date.now()}`,
          action: 'Withdrew released payouts (85% Net)',
          detail: `Transferred ${formatPrice ? formatPrice(vendorNetAvailable) : `₦${vendorNetAvailable.toFixed(2)}`} to ${withdrawForm.bankName} (${withdrawForm.accountNumber}). 15% platform fee retained.`,
          time: new Date().toLocaleString(),
        },
        ...current,
      ]);
      setWithdrawModalOpen(false);
    } catch (error) {
      setWithdrawError(error instanceof Error ? error.message : 'Unable to process withdrawal.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const selectSection = (section) => {
    if (section !== activeSection) {
      setVendorActivity((current) => [
        {
          id: `VIEW-${Date.now()}`,
          action: `Viewed ${section}`,
          detail: `Opened the ${section.toLowerCase()} section.`,
          time: new Date().toLocaleString(),
        },
        ...current,
      ]);
    }
    setActiveSection(section);
    setProductError('');
  };

  const activeDescription = navigation.find((item) => item.label === activeSection)?.description;
  const emptyState = sectionEmptyStates[activeSection];
  const EmptyIcon = emptyState?.icon || Package;

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-slate-900 lg:flex">
      <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[258px] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:px-6 lg:py-6">
          <Link to="/" aria-label="TradeSphere home" className="inline-flex items-center">
            <img src={Logo} alt="TradeSphere" className="h-9 w-auto object-contain" />
          </Link>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 lg:hidden">
            Vendor
          </span>
        </div>

        <nav aria-label="Vendor workspace sections" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-1.5 lg:overflow-y-auto lg:px-4 lg:pb-4">
          <p className="hidden px-3 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 lg:block">Workspace</p>
          {navigation.map(({ label, icon: Icon }) => {
            const active = activeSection === label;
            return (
              <button
                key={label}
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => selectSection(label)}
                className={`inline-flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition lg:w-full ${
                  active ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="hidden border-t border-slate-200 p-4 lg:block">
          <a
            href="mailto:support@tradesphere.africa"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <CircleHelp aria-hidden="true" className="h-4 w-4" />
            Vendor support
            <ArrowRight aria-hidden="true" className="ml-auto h-3.5 w-3.5" />
          </a>
          <LogoutButton className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60" />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-9">
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <span>Vendor workspace</span>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-800">{activeSection}</span>
          </div>
          <span className="text-xs font-semibold text-slate-600 sm:hidden">{activeSection}</span>
          <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 md:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Vendor service connected
            </span>

            <div ref={notifRef} className="relative">
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              >
                <Bell aria-hidden="true" className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                      >
                        <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-xs text-slate-500">No notifications yet.</p>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          type="button"
                          onClick={() => handleMarkNotificationRead(notif)}
                          className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                            notif.read ? 'bg-white' : 'bg-emerald-50/40'
                          }`}
                        >
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notif.read ? 'bg-slate-300' : 'bg-emerald-600'}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                            <p className="mt-0.5 text-xs text-slate-600">{notif.message}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex min-w-0 items-center gap-2.5 border-l border-slate-200 pl-3 sm:pl-4">
              <div aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">
                {initials || 'V'}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-40 truncate text-xs font-semibold text-slate-900">{vendorName}</p>
                <p className="text-[10px] text-slate-500">Vendor account</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-9">
          {productSuccess && (
            <div role="status" className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
              <span>{productSuccess}</span>
              <button type="button" onClick={() => setProductSuccess('')} className="text-xs font-bold text-emerald-800 hover:underline">
                Dismiss
              </button>
            </div>
          )}
          {dataError && (
            <p role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {dataError}
            </p>
          )}
          {workspaceLoading && (
            <p role="status" className="mb-6 text-sm text-slate-500">Loading your vendor workspace…</p>
          )}

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                <Building2 aria-hidden="true" className="h-4 w-4" />
                {activeSection === 'Overview' ? 'Business overview' : 'Vendor workspace'}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-[34px]">{activeSection}</h1>
              <p className="mt-2 text-sm text-slate-600">{activeDescription}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {(activeSection === 'Overview' || activeSection === 'Products' || activeSection === 'Inventory') && (
                <button
                  type="button"
                  onClick={openProductForm}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Add product
                </button>
              )}
              {activeSection === 'Payouts' && (
                <button
                  type="button"
                  disabled={releasedBalance <= 0}
                  onClick={openWithdrawModal}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Landmark aria-hidden="true" className="h-4 w-4" />
                  Withdraw available funds
                </button>
              )}
            </div>
          </div>

          {activeSection === 'Overview' ? (
            <>
              <section aria-label="Business metrics" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardMetrics.map(({ label, icon: Icon, value, subtext }) => (
                  <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-600">{label}</p>
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{subtext}</p>
                  </article>
                ))}
              </section>

              <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.9fr)]">
                <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Your listed products</h2>
                      <p className="mt-1 text-sm text-slate-500">Products active in your TradeSphere storefront.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectSection('Products')}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-slate-50"
                    >
                      Manage all ({products.length})
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="mt-5 grid min-h-56 place-items-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
                      <div>
                        <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white text-slate-400 shadow-sm">
                          <Package aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-slate-700">No products published yet</p>
                        <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">Click "Add product" to publish your first item to the marketplace.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 divide-y divide-slate-100">
                      {products.slice(0, 4).map((product) => (
                        <div key={product.id} className="flex items-center justify-between gap-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name || product.productName || 'Product'} className="h-12 w-12 rounded-lg border border-slate-200 object-cover" />
                            ) : (
                              <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
                                <Package className="h-5 w-5" />
                              </span>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900">{product.name || product.productName}</p>
                                {product.videoUrl && (
                                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                    <Video className="h-3 w-3" /> Video
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {product.category || 'General'} {product.sku ? `· SKU: ${product.sku}` : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-bold text-emerald-800">
                                {formatPrice ? formatPrice(Number(product.price || 0)) : `₦${Number(product.price || 0).toFixed(2)}`}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">{product.stock ?? 0} in stock</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => openEditProductForm(product)}
                              aria-label={`Edit ${product.name || product.productName}`}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={deletingProductId === product.id}
                              onClick={() => handleDeleteProduct(product)}
                              aria-label={`Delete ${product.name || product.productName}`}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Get your store ready</h2>
                      <p className="mt-1 text-sm text-slate-500">A few steps to get started.</p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700">
                      <Sparkles aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    <Link to="/account" className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
                        <Building2 aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-800">Complete business profile</span>
                        <span className="mt-0.5 block text-xs text-slate-500">Update your account details</span>
                      </span>
                      <ChevronRight aria-hidden="true" className="h-4 w-4 text-slate-400" />
                    </Link>
                    <button type="button" onClick={openProductForm} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
                        <Package aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-800">Add a product</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{products.length > 0 ? `${products.length} product(s) published` : 'Set up your catalogue'}</span>
                      </span>
                      <ChevronRight aria-hidden="true" className="h-4 w-4 text-slate-400" />
                    </button>
                    <div className="flex items-center gap-3 rounded-lg bg-emerald-50/70 p-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-700 text-white">
                        <Check aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-emerald-950">Escrow & Cloudinary active</span>
                      <span className="ml-auto rounded-full bg-white px-2 py-1 text-[10px] font-bold text-emerald-800">Active</span>
                    </div>
                  </div>
                </article>
              </section>
            </>
          ) : (activeSection === 'Products' || activeSection === 'Inventory') && products.length > 0 ? (
            <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="pb-3 pr-4">Product</th>
                      <th className="pb-3 px-4">Category</th>
                      <th className="pb-3 px-4">SKU</th>
                      <th className="pb-3 px-4">Price</th>
                      <th className="pb-3 px-4">Stock</th>
                      <th className="pb-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name || product.productName || 'Product'} className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 object-cover" />
                            ) : (
                              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-800">
                                <Package className="h-5 w-5" />
                              </span>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900">{product.name || product.productName}</p>
                                {product.videoUrl && (
                                  <a
                                    href={product.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100"
                                  >
                                    <Video className="h-3 w-3" /> Watch video
                                  </a>
                                )}
                              </div>
                              {product.description && <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{product.description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{product.category || '—'}</td>
                        <td className="py-4 px-4 text-slate-500">{product.sku || '—'}</td>
                        <td className="py-4 px-4 font-semibold text-slate-900">
                          {formatPrice ? formatPrice(Number(product.price || 0)) : `₦${Number(product.price || 0).toFixed(2)}`}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                            Number(product.stock) > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                          }`}>
                            {product.stock ?? 0} in stock
                          </span>
                        </td>
                        <td className="py-4 pl-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditProductForm(product)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-800"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingProductId === product.id}
                              onClick={() => handleDeleteProduct(product)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/60 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {deletingProductId === product.id ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : activeSection === 'Payouts' && payments.length > 0 ? (
            <section className="mt-7 space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Available to Withdraw (85% Net)</p>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-emerald-700">
                    {formatPrice ? formatPrice(vendorNetAvailable) : `₦${vendorNetAvailable.toFixed(2)}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Gross Released: {formatPrice ? formatPrice(releasedBalance) : `₦${releasedBalance.toFixed(2)}`} (15% platform fee applied)
                  </p>
                  <button
                    type="button"
                    disabled={releasedBalance <= 0}
                    onClick={openWithdrawModal}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Landmark className="h-3.5 w-3.5" />
                    Withdraw 85% to bank
                  </button>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending in Escrow</p>
                  <p className="mt-2 text-3xl font-bold text-amber-600">
                    {formatPrice ? formatPrice(escrowBalance) : `₦${escrowBalance.toFixed(2)}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Protected until buyer approves packing proof</p>
                </article>
                <article className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Withdrawn (85% Net)</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {formatPrice ? formatPrice(withdrawnNetBalance) : `₦${withdrawnNetBalance.toFixed(2)}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Successfully paid out to your bank account</p>
                </article>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="text-base font-bold text-slate-900">Escrow & Payment Ledger</h2>
                <div className="mt-4 divide-y divide-slate-100">
                  {payments.map((payment) => {
                    const gross = Number(payment.amount || 0);
                    const netVendor = Math.round(gross * 0.85 * 100) / 100;
                    return (
                      <div key={payment.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                        <div>
                          <p className="font-bold text-slate-900">{payment.transactionReference || `PAY-${payment.id.slice(-6)}`}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Order #{String(payment.orderId).slice(-6).toUpperCase()} · Buyer: {payment.buyerName || 'Verified Buyer'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                            payment.status === 'WITHDRAWN'
                              ? 'bg-slate-100 text-slate-700'
                              : payment.status === 'RELEASED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {payment.status}
                          </span>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">
                              {formatPrice ? formatPrice(gross) : `₦${gross.toFixed(2)}`}
                            </p>
                            <p className="text-[11px] font-medium text-emerald-700">
                              Net (85%): {formatPrice ? formatPrice(netVendor) : `₦${netVendor.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : activeSection === 'Orders' && orders.length > 0 ? (
            <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const savedPackingVideo =
                    order.packingVideoUrl ||
                    (typeof window !== 'undefined' ? localStorage.getItem(`ts_packing_video_${order.id}`) : null);

                  return (
                    <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                      <div>
                        <p className="font-bold text-slate-900">Order #{order.id}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {(order.items || []).map((i) => `${i.productName || i.name} (x${i.quantity})`).join(', ')}
                        </p>
                        {savedPackingVideo && (
                          <a
                            href={savedPackingVideo}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                          >
                            <Video className="h-3.5 w-3.5" />
                            View uploaded packing video proof
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openPackingModal({ ...order, packingVideoUrl: savedPackingVideo || '' })}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100"
                        >
                          <Film className="h-3.5 w-3.5" />
                          {savedPackingVideo ? 'Update Packing Video' : 'Upload Packing Video'}
                        </button>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                          {order.status || 'PAID'}
                        </span>
                        <p className="font-bold text-slate-900">
                          {formatPrice ? formatPrice(Number(order.totalAmount || 0)) : `₦${Number(order.totalAmount || 0).toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : activeSection === 'Activity' && vendorActivity.length > 0 ? (
            <section aria-label="Workspace activity" className="mt-7 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-5 sm:px-6">
              {vendorActivity.map((activity) => (
                <article key={activity.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{activity.action}</p>
                    <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
                  </div>
                  <time className="text-xs text-slate-500">{activity.time}</time>
                </article>
              ))}
            </section>
          ) : (
            <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5 sm:p-8">
              <div className="mx-auto flex min-h-[340px] max-w-lg flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <EmptyIcon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-slate-900">{emptyState?.title}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{emptyState?.description}</p>
                {activeSection === 'Products' && (
                  <button
                    type="button"
                    onClick={openProductForm}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                  >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Add a product
                  </button>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {productFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setProductFormOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="add-product-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Product catalogue</p>
                <h2 id="add-product-title" className="mt-1 text-xl font-bold text-slate-900">
                  {editingProductId ? 'Edit product' : 'Add a product'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingProductId
                    ? 'Update the product details, image, and video showcase in your TradeSphere catalogue.'
                    : 'Upload a product image and optional product video to Cloudinary and publish to TradeSphere.'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close product form"
                onClick={() => setProductFormOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submitProductForm} className="mt-6 space-y-4">
              <div>
                <span className="block text-sm font-semibold text-slate-700">Product image</span>
                {imagePreview || formValues.imageUrl ? (
                  <div className="relative mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={imagePreview || formValues.imageUrl}
                      alt="Product preview"
                      className="h-48 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="absolute right-3 top-3 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center transition hover:border-emerald-700 hover:bg-emerald-50/30">
                    <ImagePlus className="h-7 w-7 text-emerald-800" />
                    <span className="mt-2 text-xs font-bold text-slate-700">Click to select an image for Cloudinary upload</span>
                    <span className="mt-0.5 text-[11px] text-slate-500">PNG, JPG, WEBP up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageSelection} className="hidden" />
                  </label>
                )}

                <input
                  type="url"
                  value={formValues.imageUrl}
                  onChange={handleFieldChange('imageUrl')}
                  placeholder="Or paste a direct image URL (optional)"
                  className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <span className="block text-sm font-semibold text-slate-700">
                  Product video / Live verification clip <span className="font-normal text-slate-400">(optional)</span>
                </span>
                {videoPreview || formValues.videoUrl ? (
                  <div className="relative mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                    <video
                      src={videoPreview || formValues.videoUrl}
                      controls
                      className="h-48 w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={clearSelectedVideo}
                      className="absolute right-3 top-3 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
                    >
                      Remove video
                    </button>
                  </div>
                ) : (
                  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-5 text-center transition hover:border-emerald-700 hover:bg-emerald-50/30">
                    <Film className="h-6 w-6 text-emerald-800" />
                    <span className="mt-2 text-xs font-bold text-slate-700">Click to upload a product video to Cloudinary</span>
                    <span className="mt-0.5 text-[11px] text-slate-500">MP4, MOV, WEBM up to 50MB</span>
                    <input type="file" accept="video/*" onChange={handleVideoSelection} className="hidden" />
                  </label>
                )}

                <input
                  type="url"
                  value={formValues.videoUrl}
                  onChange={handleFieldChange('videoUrl')}
                  placeholder="Or paste a direct Cloudinary video URL (optional)"
                  className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-emerald-700"
                />
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Product name
                <input
                  required
                  name="productName"
                  value={formValues.productName}
                  onChange={handleFieldChange('productName')}
                  placeholder="e.g. Lacoste Daily Classic Piqué PVC Backpack"
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Category
                  <input
                    required
                    name="category"
                    value={formValues.category}
                    onChange={handleFieldChange('category')}
                    placeholder="e.g. Fashion & Accessories"
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  SKU <span className="font-normal text-slate-400">(optional)</span>
                  <input
                    name="sku"
                    value={formValues.sku}
                    onChange={handleFieldChange('sku')}
                    placeholder="e.g. LAC-BP-001"
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Unit price
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    name="price"
                    value={formValues.price}
                    onChange={handleFieldChange('price')}
                    placeholder="0.00"
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Available quantity
                  <input
                    required
                    min="0"
                    step="1"
                    type="number"
                    name="quantity"
                    value={formValues.quantity}
                    onChange={handleFieldChange('quantity')}
                    placeholder="0"
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700"
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Description
                <textarea
                  name="description"
                  rows="3"
                  value={formValues.description}
                  onChange={handleFieldChange('description')}
                  placeholder="Describe the product for buyers"
                  className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700"
                />
              </label>
              {productError && <p role="alert" aria-live="polite" className="text-sm font-medium text-rose-700">{productError}</p>}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setProductFormOpen(false)}
                  className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Uploading & Saving…'
                    : editingProductId
                    ? 'Save changes'
                    : 'Publish product'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {packingModalOrder && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPackingModalOrder(null);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="packing-modal-title" className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Escrow Packing Proof</p>
                <h2 id="packing-modal-title" className="mt-1 text-xl font-bold text-slate-900">
                  Upload Order Packing Video
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Record and upload a video showing the item condition and packaging for Order #{String(packingModalOrder.id).slice(-6).toUpperCase()}.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close packing video modal"
                onClick={() => setPackingModalOrder(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePackingProofSubmit} className="mt-5 space-y-4">
              {packingVideoPreview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                  <video src={packingVideoPreview} controls className="h-52 w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => {
                      setPackingVideoFile(null);
                      setPackingVideoPreview('');
                      setPackingVideoUrl('');
                    }}
                    className="absolute right-3 top-3 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
                  >
                    Replace video
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-7 text-center transition hover:border-emerald-700 hover:bg-emerald-50/30">
                  <Video className="h-8 w-8 text-emerald-800" />
                  <span className="mt-2 text-xs font-bold text-slate-700">Click to record or select packing video</span>
                  <span className="mt-0.5 text-[11px] text-slate-500">MP4, MOV, WEBM up to 50MB</span>
                  <input type="file" accept="video/*" capture="environment" onChange={handlePackingVideoSelection} className="hidden" />
                </label>
              )}

              <label className="block text-xs font-semibold text-slate-700">
                Or paste a direct video URL
                <input
                  type="url"
                  value={packingVideoUrl}
                  onChange={(e) => {
                    setPackingVideoUrl(e.target.value);
                    setPackingVideoPreview(e.target.value);
                  }}
                  placeholder="https://res.cloudinary.com/..."
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-xs outline-none focus:border-emerald-700"
                />
              </label>

              {packingProofError && (
                <p role="alert" className="text-sm font-medium text-rose-700">
                  {packingProofError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPackingModalOrder(null)}
                  className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingPackingProof}
                  className="h-10 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
                >
                  {isUploadingPackingProof ? 'Uploading video…' : 'Save packing video'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {withdrawModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setWithdrawModalOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="withdraw-modal-title" className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">Vendor Payout (85% / 15% Split)</p>
                <h2 id="withdraw-modal-title" className="mt-1 text-xl font-bold text-slate-900">
                  Withdraw Released Funds
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Transfer your 85% net share directly to your Nigerian bank account via Paystack.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close withdrawal modal"
                onClick={() => setWithdrawModalOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Gross Released Balance (100%):</span>
                <span className="font-semibold text-slate-800">
                  {formatPrice ? formatPrice(releasedBalance) : `₦${releasedBalance.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TradeSphere Platform Fee (15%):</span>
                <span className="font-semibold text-rose-600">
                  -{formatPrice ? formatPrice(platformFeeOnAvailable) : `₦${platformFeeOnAvailable.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-emerald-200 pt-1.5 text-sm font-bold text-emerald-900">
                <span>Net Payout to Bank (85%):</span>
                <span>{formatPrice ? formatPrice(vendorNetAvailable) : `₦${vendorNetAvailable.toFixed(2)}`}</span>
              </div>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Select Nigerian Bank
                <select
                  required
                  value={withdrawForm.bankCode}
                  onChange={handleBankChange}
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-700"
                >
                  {NIGERIAN_BANKS.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Account number (10 digits)
                <input
                  required
                  maxLength={10}
                  value={withdrawForm.accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="0123456789"
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Account holder name {isResolvingAccount && <span className="text-xs font-normal text-emerald-700">(Resolving...)</span>}
                <input
                  required
                  readOnly
                  value={withdrawForm.accountName}
                  placeholder="Auto-filled via Paystack NUBAN lookup"
                  className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none"
                />
              </label>

              {withdrawError && (
                <p role="alert" className="text-sm font-medium text-rose-700">
                  {withdrawError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isWithdrawing || !withdrawForm.accountName}
                  className="h-10 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:opacity-60"
                >
                  {isWithdrawing
                    ? 'Processing payout…'
                    : `Withdraw ${formatPrice ? formatPrice(vendorNetAvailable) : `₦${vendorNetAvailable.toFixed(2)}`}`}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default VendorWorkspace;