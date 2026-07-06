'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  kategori: string
  kode: string
  nama: string
  harga_beli: number
  harga_satuan: number
  harga_grosir: number
  stok: number
}

interface CartItem extends Product {
  quantity: number
}

interface Transaction {
  id: string
  timestamp: string
  items: CartItem[]
  total: number
  diskon: number
  cash: number
  kembalian: number
  metodeBayar: string
  keuntungan: number
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('kasir')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Form inputs
  const [formData, setFormData] = useState({
    kategori: '',
    kode: '',
    nama: '',
    harga_beli: '',
    harga_satuan: '',
    harga_grosir: '',
    stok: ''
  })
  const [diskon, setDiskon] = useState(0)
  const [cash, setCash] = useState(0)
  const [metodeBayar, setMetodeBayar] = useState('TUNAI')

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pasar-pintar-data')
    if (saved) {
      const data = JSON.parse(saved)
      setProducts(data.products || [])
      setTransactions(data.transactions || [])
      setCategories(data.categories || [])
    }
  }, [])

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem('pasar-pintar-data', JSON.stringify({
      products,
      transactions,
      categories
    }))
  }

  // Add new category
  const addCategory = (categoryName: string) => {
    if (categoryName && !categories.includes(categoryName)) {
      const newCategories = [...categories, categoryName]
      setCategories(newCategories)
      localStorage.setItem('pasar-pintar-data', JSON.stringify({
        products,
        transactions,
        categories: newCategories
      }))
    }
  }

  // Add product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.kategori || !formData.nama || !formData.kode) {
      alert('Lengkapi semua field!')
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      kategori: formData.kategori,
      kode: formData.kode,
      nama: formData.nama,
      harga_beli: parseInt(formData.harga_beli),
      harga_satuan: parseInt(formData.harga_satuan),
      harga_grosir: parseInt(formData.harga_grosir),
      stok: parseInt(formData.stok)
    }

    const newProducts = [...products, newProduct]
    setProducts(newProducts)
    setFormData({
      kategori: '',
      kode: '',
      nama: '',
      harga_beli: '',
      harga_satuan: '',
      harga_grosir: '',
      stok: ''
    })
    localStorage.setItem('pasar-pintar-data', JSON.stringify({
      products: newProducts,
      transactions,
      categories
    }))
    alert('Produk berhasil ditambahkan!')
  }

  // Add to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  // Calculate total
  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.harga_satuan * item.quantity)
  }, 0)

  const totalSetelahDiskon = cartTotal - diskon
  const kembalian = cash - totalSetelahDiskon

  // Save transaction
  const saveTransaction = () => {
    if (cart.length === 0) {
      alert('Keranjang kosong!')
      return
    }

    if (metodeBayar === 'TUNAI' && cash < totalSetelahDiskon) {
      alert('Uang pembayaran kurang!')
      return
    }

    // Calculate profit
    const totalBeli = cart.reduce((sum, item) => {
      return sum + (item.harga_beli * item.quantity)
    }, 0)
    const keuntungan = totalSetelahDiskon - totalBeli

    const transaction: Transaction = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('id-ID'),
      items: cart,
      total: cartTotal,
      diskon: diskon,
      cash: metodeBayar === 'TUNAI' ? cash : 0,
      kembalian: metodeBayar === 'TUNAI' ? kembalian : 0,
      metodeBayar: metodeBayar,
      keuntungan: keuntungan
    }

    // Update stock
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id)
      if (cartItem) {
        return { ...product, stok: product.stok - cartItem.quantity }
      }
      return product
    })

    const newTransactions = [...transactions, transaction]
    setTransactions(newTransactions)
    setProducts(updatedProducts)
    
    // Clear cart
    setCart([])
    setDiskon(0)
    setCash(0)
    setMetodeBayar('TUNAI')
    
    localStorage.setItem('pasar-pintar-data', JSON.stringify({
      products: updatedProducts,
      transactions: newTransactions,
      categories
    }))
    alert('Transaksi berhasil disimpan!')
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.kode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.kategori === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate report
  const totalOmzet = transactions.reduce((sum, t) => sum + t.total, 0)
  const totalUntung = transactions.reduce((sum, t) => sum + t.keuntungan, 0)

  return (
    <div className="min-h-screen" style={{ background: '#f8f9fa' }}>
      {/* Header */}
      <header className="text-white p-6 text-center rounded-b-3xl shadow-lg" style={{ background: 'linear-gradient(135deg, #0a3d62 0%, #1e3799 100%)' }}>
        <h1 className="text-3xl font-bold m-0">🛒 Toko Ayi Toys & ATK</h1>
        <p className="text-sm opacity-90 mt-2">Aplikasi Kasir Pintar - Tampilan Etalase Belanja Online</p>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'kasir', label: '🛍️ ETALASE KASIR' },
            { id: 'input', label: '➕ DAFTAR BARANG BARU' },
            { id: 'stok', label: '📦 STOK GUDANG TOKO' },
            { id: 'laporan', label: '📈 LAPORAN UNTUNG' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'shadow-lg'
                  : 'shadow'
              }`}
              style={{
                background: activeTab === tab.id ? '#1e3799' : '#fff',
                color: activeTab === tab.id ? '#fff' : '#747d8c',
                transform: activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: KASIR */}
        {activeTab === 'kasir' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side - Catalog */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-bold mb-4">🔍 Scanner & Pencarian Cepat</h3>
                <input
                  type="text"
                  placeholder="Ketik nama produk atau scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  style={{ borderColor: '#e1e8ed' }}
                />
              </div>

              {/* Category Filter */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-bold mb-4">🏪 Filter Kategori</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="px-4 py-2 rounded-full font-bold text-sm transition"
                    style={{
                      background: selectedCategory === null ? '#05c46b' : '#e1e8ed',
                      color: selectedCategory === null ? '#fff' : '#2f3542'
                    }}
                  >
                    Semua
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-4 py-2 rounded-full font-bold text-sm transition"
                      style={{
                        background: selectedCategory === cat ? '#05c46b' : '#e1e8ed',
                        color: selectedCategory === cat ? '#fff' : '#2f3542'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-bold mb-4">📦 Etalase Produk Toko</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <div
                        key={product.id}
                        className="border-2 p-4 rounded-xl hover:shadow-lg hover:scale-105 transition cursor-pointer relative"
                        style={{ borderColor: '#f1f2f6' }}
                        onClick={() => addToCart(product)}
                      >
                        <div className="text-xs font-bold px-2 py-1 rounded w-fit mb-2" style={{ background: '#e8f0fe', color: '#1e3799' }}>
                          {product.kategori}
                        </div>
                        <h4 className="font-bold text-sm mb-2 line-clamp-2">{product.nama}</h4>
                        <p className="font-bold text-lg mb-2" style={{ color: '#ff4757' }}>
                          Rp {product.harga_satuan.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs mb-3" style={{ color: '#a4b0be' }}>
                          Stok: <span className="font-bold">{product.stok}</span>
                        </p>
                        <div className="w-6 h-6 rounded-full font-bold flex items-center justify-center mx-auto text-white absolute bottom-3 right-3" style={{ background: '#1e3799' }}>
                          +
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500 py-8">Produk tidak ditemukan</p>
                  )}
                </div>
              </div>

              {/* Cart Table */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-bold mb-4">🛒 Keranjang Belanja Konsumen</h3>
                {cart.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead style={{ background: '#f1f2f6' }}>
                        <tr>
                          <th className="text-left p-3 font-bold" style={{ color: '#57606f' }}>Produk</th>
                          <th className="text-center p-3 font-bold" style={{ color: '#57606f' }}>Qty</th>
                          <th className="text-right p-3 font-bold" style={{ color: '#57606f' }}>Subtotal</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item.id} style={{ borderBottom: '1px solid #f1f2f6' }}>
                            <td className="p-3">{item.nama}</td>
                            <td className="text-center p-3">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                className="w-12 text-center border rounded"
                              />
                            </td>
                            <td className="text-right p-3 font-bold">
                              Rp {(item.harga_satuan * item.quantity).toLocaleString('id-ID')}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="font-bold"
                                style={{ color: '#ff4757' }}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Keranjang kosong</p>
                )}
              </div>
            </div>

            {/* Right side - Receipt & Payment */}
            <div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-bold mb-4">📄 Lembar Struk Pembayaran</h3>
                <div className="border-2 border-dashed p-4 font-mono text-sm bg-gray-50 rounded-lg mb-4" style={{ borderColor: '#2f3542' }}>
                  <div style={{ textAlign: 'center', borderBottom: '1px dashed #333', paddingBottom: '8px', marginBottom: '8px' }}>
                    <p className="font-bold m-0" style={{ fontSize: '14px' }}>TOKO AYI TOYS & ATK</p>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}>Kelontongan, Mainan & Alat Kantor</p>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}>Cicalengka, Jawa Barat</p>
                    <p style={{ fontSize: '10px', marginTop: '10px' }}>{new Date().toLocaleString('id-ID')}</p>
                  </div>

                  <div style={{ maxHeight: '120px', overflowY: 'auto', marginBottom: '8px' }}>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-xs mb-1">
                        <span>{item.nama} x{item.quantity}</span>
                        <span>Rp {(item.harga_satuan * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px dashed #333', marginTop: '8px', paddingTop: '6px' }}>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Subtotal:</span>
                      <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Diskon:</span>
                      <span>-Rp {diskon.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base" style={{ borderTop: '1px dashed #333', paddingTop: '6px' }}>
                      <span>TOTAL:</span>
                      <span>Rp {totalSetelahDiskon.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {metodeBayar === 'TUNAI' && (
                    <div style={{ marginTop: '8px', borderTop: '1px dashed #333', paddingTop: '6px' }}>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Bayar:</span>
                        <span>Rp {cash.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold" style={{ color: '#10ac84' }}>
                        <span>Kembalian:</span>
                        <span>Rp {Math.max(0, kembalian).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-center text-xs mt-3">Terima Kasih Atas Kunjungan Anda!</p>
                </div>

                <div className="space-y-2">
                  <select
                    value={metodeBayar}
                    onChange={(e) => setMetodeBayar(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="TUNAI">TUNAI</option>
                    <option value="QRIS">QRIS</option>
                    <option value="TRANSFER">TRANSFER</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Potongan/Diskon (Rp)"
                    value={diskon}
                    onChange={(e) => setDiskon(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  {metodeBayar === 'TUNAI' && (
                    <input
                      type="number"
                      placeholder="Uang Tunai (Rp)"
                      value={cash}
                      onChange={(e) => setCash(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  )}

                  <button
                    onClick={() => window.print()}
                    className="w-full text-white font-bold py-2 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #2980b9 0%, #1e3799 100%)' }}
                  >
                    🖨️ Cetak Kertas Nota Struk
                  </button>
                  <button
                    onClick={saveTransaction}
                    className="w-full text-white font-bold py-2 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #10ac84 0%, #05c46b 100%)' }}
                  >
                    💾 Selesai & Simpan Buku Untung
                  </button>
                  <button
                    onClick={() => {
                      setCart([])
                      setDiskon(0)
                      setCash(0)
                    }}
                    className="w-full text-white font-bold py-2 rounded-lg text-sm"
                    style={{ background: '#747d8c' }}
                  >
                    Kosongkan Keranjang
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INPUT PRODUK */}
        {activeTab === 'input' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 rounded-xl" style={{ background: '#ebf8ff', borderColor: '#1e3799' }} className="p-6 rounded-xl border-2 border-dashed">
              <h4 className="font-bold mb-4" style={{ color: '#1e3799' }}>➕ Buat Kategori/Grup Jualan Baru</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="newCategory"
                  placeholder="Contoh: ATK, Mainan Cowok, Sembako"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newCategory') as HTMLInputElement
                    addCategory(input.value)
                    input.value = ''
                  }}
                  className="text-white font-bold px-6 py-2 rounded-lg"
                  style={{ background: '#1e3799' }}
                >
                  Simpan Kategori
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-lg font-bold mb-6">Formulir Pendaftaran Barang</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block font-bold mb-2">Kategori Barang</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-2">Kode Barcode Unik</label>
                  <input
                    type="text"
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                    placeholder="Hasil scan barcode otomatis masuk ke sini..."
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2">Nama Lengkap Produk</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: Chiki Ball Keju"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2">Harga Modal Beli (Rp)</label>
                    <input
                      type="number"
                      value={formData.harga_beli}
                      onChange={(e) => setFormData({ ...formData, harga_beli: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2">Harga Jual Satuan (Rp)</label>
                    <input
                      type="number"
                      value={formData.harga_satuan}
                      onChange={(e) => setFormData({ ...formData, harga_satuan: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2">Harga Grosir (Rp)</label>
                    <input
                      type="number"
                      value={formData.harga_grosir}
                      onChange={(e) => setFormData({ ...formData, harga_grosir: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-2">Jumlah Stok Awal</label>
                    <input
                      type="number"
                      value={formData.stok}
                      onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-bold py-3 rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #10ac84 0%, #05c46b 100%)' }}
                >
                  Simpan Masuk Etalase Toko
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: STOK GUDANG */}
        {activeTab === 'stok' && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-bold mb-6">📋 Pengaturan & Cek Stok Gudang Toko</h3>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: '#edf2f7' }}>
                    <tr>
                      <th className="text-left p-3 font-bold">Kategori</th>
                      <th className="text-left p-3 font-bold">Kode Barcode</th>
                      <th className="text-left p-3 font-bold">Nama Produk</th>
                      <th className="text-center p-3 font-bold">Sisa Stok</th>
                      <th className="text-center p-3 font-bold">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} style={{ borderBottom: '1px solid #f1f2f6' }}>
                        <td className="p-3">{product.kategori}</td>
                        <td className="p-3 font-mono text-xs">{product.kode}</td>
                        <td className="p-3">{product.nama}</td>
                        <td className="text-center p-3 font-bold">{product.stok}</td>
                        <td className="text-center p-3">
                          <button
                            onClick={() => {
                              setProducts(products.filter(p => p.id !== product.id))
                              localStorage.setItem('pasar-pintar-data', JSON.stringify({
                                products: products.filter(p => p.id !== product.id),
                                transactions,
                                categories
                              }))
                            }}
                            className="font-bold"
                            style={{ color: '#ff4757' }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Belum ada produk</p>
            )}
          </div>
        )}

        {/* TAB 4: LAPORAN */}
        {activeTab === 'laporan' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl" style={{ background: '#f1f2f6', borderLeft: '5px solid #1e3799' }}>
                <p className="text-gray-700 mb-2">Total Omzet Pendapatan</p>
                <p className="text-3xl font-bold" style={{ color: '#1e3799' }}>
                  Rp {totalOmzet.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: '#f1f2f6', borderLeft: '5px solid #05c46b', color: '#05c46b' }}>
                <p className="text-gray-700 mb-2">Total Untung Bersih</p>
                <p className="text-3xl font-bold" style={{ color: '#05c46b' }}>
                  Rp {totalUntung.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-lg font-bold mb-6">📊 Pembukuan Omzet & Keuntungan Bersih Toko</h3>
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ background: '#f1f2f6' }}>
                      <tr>
                        <th className="text-left p-3 font-bold">Jam Trx</th>
                        <th className="text-left p-3 font-bold">Daftar Belanjaan</th>
                        <th className="text-center p-3 font-bold">Metode</th>
                        <th className="text-right p-3 font-bold">Diskon</th>
                        <th className="text-right p-3 font-bold">Total Bayar</th>
                        <th className="text-right p-3 font-bold">Keuntungan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(tx => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid #f1f2f6' }}>
                          <td className="p-3 text-xs">{tx.timestamp}</td>
                          <td className="p-3 text-xs max-w-xs">
                            {tx.items.map(item => `${item.nama}(${item.quantity})`).join(', ')}
                          </td>
                          <td className="text-center p-3">{tx.metodeBayar}</td>
                          <td className="text-right p-3">
                            Rp {tx.diskon.toLocaleString('id-ID')}
                          </td>
                          <td className="text-right p-3 font-bold">
                            Rp {(tx.total - tx.diskon).toLocaleString('id-ID')}
                          </td>
                          <td className="text-right p-3 font-bold" style={{ color: '#10ac84' }}>
                            Rp {tx.keuntungan.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Belum ada transaksi</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
