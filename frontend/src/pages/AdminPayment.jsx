import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, CreditCard, User, ArrowLeft, RefreshCw, Search, Filter } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    avgAmount: 0,
    today: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
    calculateStats();
  }, [payments, searchTerm, filterType]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8085/api/payments/successful');
      const data = await response.json();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.stripePaymentIntentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ticketId?.toString().includes(searchTerm)
      );
    }

    if (filterType !== 'all') {
      const today = new Date().toDateString();
      const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const month = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.paymentDate);
        if (filterType === 'today') return paymentDate.toDateString() === today;
        if (filterType === 'week') return paymentDate >= week;
        if (filterType === 'month') return paymentDate >= month;
        return true;
      });
    }

    setFilteredPayments(filtered);
  };

  const calculateStats = () => {
    const total = filteredPayments.length;
    const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const avgAmount = total > 0 ? totalAmount / total : 0;
    const today = filteredPayments.filter(p => 
      new Date(p.paymentDate).toDateString() === new Date().toDateString()
    ).length;

    setStats({ total, totalAmount, avgAmount, today });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold text-white">Paiements Réussis</h1>
            </div>
            <button
              onClick={fetchPayments}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Paiements</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Montant Total</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Montant Moyen</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(stats.avgAmount)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.today}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Référence, ID Stripe, ID Ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <div className="relative">
                <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tous</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">7 derniers jours</option>
                  <option value="month">30 derniers jours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Référence</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID Ticket</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Méthode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID Stripe</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <RefreshCw className="animate-spin inline-block mr-2" size={20} />
                      Chargement...
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Aucun paiement trouvé
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-medium text-blue-600">{payment.reference}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {payment.ticketId || payment.subscriptionId || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {payment.paymentMethod || 'CARD'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm font-mono">
                        {payment.stripePaymentIntentId ? 
                          `${payment.stripePaymentIntentId.substring(0, 20)}...` : 
                          '-'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {payment.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        {filteredPayments.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Affichage de {filteredPayments.length} paiement(s)</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Total affiché</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}