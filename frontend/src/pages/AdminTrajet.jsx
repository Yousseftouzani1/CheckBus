import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Save, X, LogOut, CreditCard, Clock } from 'lucide-react';

export default function AdminTrajetPage() {
  const [trajets, setTrajets] = useState([]);
  const [filteredTrajets, setFilteredTrajets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchDepart, setSearchDepart] = useState('');
  const [searchArrivee, setSearchArrivee] = useState('');
  
  const [formData, setFormData] = useState({
    id: null,
    ligneCode: '',
    depart: '',
    arrivee: '',
    arrets: [],
    distanceKm: 0,
    active: true,
    horaires: []
  });

  const [arretInput, setArretInput] = useState('');
  const [horaireInput, setHoraireInput] = useState({
    heureDepart: '',
    heureArrivee: '',
    joursActifs: []
  });
  const [jourInput, setJourInput] = useState('');

  useEffect(() => {
    fetchTrajets();
  }, []);

  useEffect(() => {
    if (searchDepart || searchArrivee) {
      const filtered = trajets.filter(t => 
        t.depart.toLowerCase().includes(searchDepart.toLowerCase()) &&
        t.arrivee.toLowerCase().includes(searchArrivee.toLowerCase())
      );
      setFilteredTrajets(filtered);
    } else {
      setFilteredTrajets(trajets);
    }
  }, [searchDepart, searchArrivee, trajets]);

  const fetchTrajets = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8083/api/trajets');
      const data = await response.json();
      setTrajets(data);
      setFilteredTrajets(data);
    } catch (error) {
      console.error('Error fetching trajets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {

      const processedData = {
      ...formData,
      horaires: formData.horaires.map(h => ({
        heureDepart: h.heureDepart.length === 5 ? h.heureDepart + ":00" : h.heureDepart,
        heureArrivee: h.heureArrivee.length === 5 ? h.heureArrivee + ":00" : h.heureArrivee,
        
        // Backend expects: "jour": "Lundi"
        // Frontend has: "joursActifs": ["Lundi", "Mardi"]
        jour: h.joursActifs[0] || ""  
      }))
    };

      const url = editMode 
        ? `http://localhost:8083/api/trajets/${formData.id}`
        : 'http://localhost:8083/api/trajets';
      
      const response = await fetch(url, {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData)
      });
      
      if (response.ok) {
        await fetchTrajets();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving trajet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet?')) return;
    
    setLoading(true);
    try {
      await fetch(`http://localhost:8083/api/trajets/${id}`, {
        method: 'DELETE'
      });
      await fetchTrajets();
    } catch (error) {
      console.error('Error deleting trajet:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (trajet = null) => {
    if (trajet) {
      setFormData(trajet);
      setEditMode(true);
    } else {
      setFormData({
        id: null,
        ligneCode: '',
        depart: '',
        arrivee: '',
        arrets: [],
        distanceKm: 0,
        active: true,
        horaires: []
      });
      setEditMode(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setArretInput('');
    setHoraireInput({
      heureDepart: '',
      heureArrivee: '',
      joursActifs: []
    });
    setJourInput('');
  };

  const addArret = () => {
    if (arretInput.trim()) {
      setFormData({
        ...formData,
        arrets: [...formData.arrets, arretInput.trim()]
      });
      setArretInput('');
    }
  };

  const removeArret = (index) => {
    setFormData({
      ...formData,
      arrets: formData.arrets.filter((_, i) => i !== index)
    });
  };

  const addJourToHoraire = () => {
    if (jourInput.trim() && !horaireInput.joursActifs.includes(jourInput.trim())) {
      setHoraireInput({
        ...horaireInput,
        joursActifs: [...horaireInput.joursActifs, jourInput.trim()]
      });
      setJourInput('');
    }
  };

  const removeJourFromHoraire = (jour) => {
    setHoraireInput({
      ...horaireInput,
      joursActifs: horaireInput.joursActifs.filter(j => j !== jour)
    });
  };

  const addHoraire = () => {
    if (horaireInput.heureDepart && horaireInput.heureArrivee && horaireInput.joursActifs.length > 0) {
      setFormData({
        ...formData,
        horaires: [...formData.horaires, { ...horaireInput }]
      });
      setHoraireInput({
        heureDepart: '',
        heureArrivee: '',
        joursActifs: []
      });
    }
  };

  const removeHoraire = (index) => {
    setFormData({
      ...formData,
      horaires: formData.horaires.filter((_, i) => i !== index)
    });
  };

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    window.location.reload();
    
  };

  const goToPayments = () => {
    window.location.href = '/admin/payments';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Administration des Trajets</h1>
            <div className="flex gap-3">
              <button
                onClick={goToPayments}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                <CreditCard size={20} />
                Paiements
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Add Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Départ</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par départ..."
                  value={searchDepart}
                  onChange={(e) => setSearchDepart(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Arrivée</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par arrivée..."
                  value={searchArrivee}
                  onChange={(e) => setSearchArrivee(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium shadow-md"
              >
                <Plus size={20} />
                Nouveau Trajet
              </button>
            </div>
          </div>
        </div>

        {/* Trajets Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Code Ligne</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Départ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Arrivée</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Distance (km)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Arrêts</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Horaires</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Chargement...
                    </td>
                  </tr>
                ) : filteredTrajets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      Aucun trajet trouvé
                    </td>
                  </tr>
                ) : (
                  filteredTrajets.map((trajet) => (
                    <tr key={trajet.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4 font-medium text-blue-600">{trajet.ligneCode}</td>
                      <td className="px-6 py-4 text-gray-700">{trajet.depart}</td>
                      <td className="px-6 py-4 text-gray-700">{trajet.arrivee}</td>
                      <td className="px-6 py-4 text-gray-700">{trajet.distanceKm}</td>
                      <td className="px-6 py-4 text-gray-700">{trajet.arrets?.length || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-purple-600">
                          <Clock size={16} />
                          <span className="font-medium">{trajet.horaires?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          trajet.active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {trajet.active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(trajet)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(trajet.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editMode ? 'Modifier le Trajet' : 'Nouveau Trajet'}
              </h2>
              <button onClick={closeModal} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code Ligne</label>
                  <input
                    type="text"
                    required
                    value={formData.ligneCode}
                    onChange={(e) => setFormData({...formData, ligneCode: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({...formData, distanceKm: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Départ</label>
                <input
                  type="text"
                  required
                  value={formData.depart}
                  onChange={(e) => setFormData({...formData, depart: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrivée</label>
                <input
                  type="text"
                  required
                  value={formData.arrivee}
                  onChange={(e) => setFormData({...formData, arrivee: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrêts</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={arretInput}
                    onChange={(e) => setArretInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArret())}
                    placeholder="Ajouter un arrêt..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addArret}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.arrets.map((arret, index) => (
                    <span key={index} className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {arret}
                      <button
                        onClick={() => removeArret(index)}
                        className="hover:text-purple-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horaires</label>
                
                {/* Add Horaire Form */}
                <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Heure Départ</label>
                      <input
                        type="time"
                        value={horaireInput.heureDepart}
                        onChange={(e) => setHoraireInput({...horaireInput, heureDepart: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Heure Arrivée</label>
                      <input
                        type="time"
                        value={horaireInput.heureArrivee}
                        onChange={(e) => setHoraireInput({...horaireInput, heureArrivee: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Jours Actifs</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={jourInput}
                        onChange={(e) => setJourInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addJourToHoraire())}
                        placeholder="Ex: Lundi, Mardi..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        onClick={addJourToHoraire}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {horaireInput.joursActifs.map((jour, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {jour}
                          <button onClick={() => removeJourFromHoraire(jour)} className="hover:text-blue-900">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={addHoraire}
                    disabled={!horaireInput.heureDepart || !horaireInput.heureArrivee || horaireInput.joursActifs.length === 0}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ajouter Horaire
                  </button>
                </div>

                {/* Display Horaires */}
                <div className="space-y-2">
                  {formData.horaires.map((horaire, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-purple-900">
                            {horaire.heureDepart} → {horaire.heureArrivee}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {horaire.joursActifs.map((jour, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded text-xs">
                                {jour}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeHoraire(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {formData.horaires.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">Aucun horaire ajouté</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Trajet actif
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium disabled:opacity-50"
                >
                  <Save size={20} />
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}