import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Plus, Users, Palette, TrendingUp, Search, Pencil, Calendar } from 'lucide-react';
import api from '@/lib/api';
import { User as Patient } from '@/contexts/AuthContext';

// Interfaces
interface PatientProfile {
  birthdate?: string | null;
  gender?: string | null;
  treatment?: string | null;
  notes?: string | null;
}
interface PatientData extends Patient {
  patient_profile?: PatientProfile | null;
  surname?: string | null;
  phone?: string | null;
  center?: string | null;
}
interface Drawing {
  id: number;
  title: string;
  image_data: string;
  created_at: string;
}

const TherapistDashboard = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [patients, setPatients] = useState<PatientData[]>([]);
	const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [patientDrawings, setPatientDrawings] = useState<Drawing[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [editingProfile, setEditingProfile] = useState<any>({});

  const fetchPatients = async () => {
    if (user && user.role === 'psychologist') {
      try {
        const response = await api.get(`/users/therapists/${user.id}/patients`);
        if (response.data && response.data.patients) {
          setPatients(response.data.patients);
          if (response.data.patients.length > 0 && !selectedPatient) {
            setSelectedPatient(response.data.patients[0]);
          }
        }
      } catch (error) { console.error("Error fetching patients:", error); }
    }
  };

  useEffect(() => { fetchPatients(); }, [user]);

  useEffect(() => {
    const fetchDrawings = async () => {
      if (selectedPatient && user) {
        try {
          const response = await api.get(`/drawings/therapists/${user.id}/patients/${selectedPatient.id}/drawings`);
          setPatientDrawings(response.data);
        } catch (error) { setPatientDrawings([]); }
      } else { setPatientDrawings([]); }
    };
    fetchDrawings();
  }, [selectedPatient, user]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchTimeout) clearTimeout(searchTimeout);
    if (query.length > 1) {
      const timeout = setTimeout(async () => {
        try {
          const response = await api.get(`/users/search/`, { params: { name: query } });
          setSearchResults(response.data);
        } catch (error) { console.error("Failed to search patients", error); }
      }, 500);
      setSearchTimeout(timeout);
    } else { setSearchResults([]); }
  };

	const handleLogout = () => { logout(); navigate('/login'); };

  const handleAssignPatient = async (patientId: string) => {
    if (!user) return;
    try {
      await api.post(`/users/therapists/${user.id}/patients?patient_id=${patientId}`);
      toast({ title: "Success", description: "Patient assigned successfully." });
      setIsAssignModalOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      fetchPatients();
    } catch (error) { toast({ title: "Error", description: "Could not assign patient.", variant: "destructive" }); }
  };

  const openEditModal = () => {
    if (!selectedPatient) return;
    setEditingProfile({
      name: selectedPatient.name || '',
      surname: selectedPatient.surname || '',
      phone: selectedPatient.phone || '',
      center: selectedPatient.center || '',
      birthdate: selectedPatient.patient_profile?.birthdate || '',
      gender: selectedPatient.patient_profile?.gender || '',
      treatment: selectedPatient.patient_profile?.treatment || '',
      notes: selectedPatient.patient_profile?.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleProfileUpdate = async () => {
    if (!selectedPatient) return;
    const payload = { ...editingProfile };
    if (payload.birthdate === '') payload.birthdate = null;
    try {
      const res = await api.put(`/users/patients/${selectedPatient.id}/profile`, payload);
      toast({ title: "Profile Updated", description: "Patient details have been saved." });
      const updatedPatientResponse = await api.get(`/users/therapists/${user.id}/patients`);
      if (updatedPatientResponse.data && updatedPatientResponse.data.patients) {
        setPatients(updatedPatientResponse.data.patients);
        const newlyUpdatedPatient = updatedPatientResponse.data.patients.find(p => p.id === selectedPatient.id);
        if(newlyUpdatedPatient) setSelectedPatient(newlyUpdatedPatient);
      }
      setIsEditModalOpen(false);
    } catch (error) { toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" }); }
  };

	return (
		<div className="min-h-screen bg-[#282c34]">
			<header className="bg-[#20232a] border-b border-[#282c34] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src="/logo_2.png" alt="Holo Logo" className="w-12 h-12" />
            <div><h1 className="text-xl font-bold text-white">Holo</h1><p className="text-sm text-gray-400">Therapist Panel</p></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Avatar><AvatarImage src={user?.avatar} /><AvatarFallback className="bg-[#c084fc] text-[#282c34]">{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
              <div className="hidden sm:block"><p className="text-sm font-medium text-white">{user?.name}</p><p className="text-xs text-gray-400">Therapist</p></div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-[#f9a8d4] border-[#f9a8d4] hover:text-white hover:bg-[#f9a8d4]/20"><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
			</header>

      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#20232a] p-6 rounded-lg w-full max-w-md space-y-4 border border-gray-700">
            <h2 className="text-xl text-white">Assign Patient</h2>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input type="text" placeholder="Search patient by name..." value={searchQuery} onChange={handleSearchChange} className="bg-[#282c34] text-white border-gray-600 pl-10" /></div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map(p => (<div key={p.id} className="flex items-center justify-between p-2 rounded-md hover:bg-[#282c34]"><div><p className="text-white font-medium">{p.name}</p><p className="text-sm text-gray-400">{p.email}</p></div><Button size="sm" onClick={() => handleAssignPatient(p.id)} className="bg-[#8ecae6] text-[#282c34]">Assign</Button></div>))}
              {searchResults.length === 0 && searchQuery.length > 1 && <p className="text-gray-400 text-center py-4">No patients found.</p>}
            </div>
            <div className="flex justify-end"><Button onClick={() => setIsAssignModalOpen(false)} variant="outline">Close</Button></div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#20232a] p-6 rounded-lg w-full max-w-lg space-y-4 border border-gray-700">
            <h2 className="text-xl text-white">Edit Profile for {selectedPatient.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm text-gray-400">Name</label><Input value={editingProfile.name} onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})} className="bg-[#282c34] text-white mt-1" /></div>
              <div><label className="text-sm text-gray-400">Surname</label><Input value={editingProfile.surname} onChange={(e) => setEditingProfile({...editingProfile, surname: e.target.value})} className="bg-[#282c34] text-white mt-1" /></div>
              <div><label className="text-sm text-gray-400">Phone</label><Input value={editingProfile.phone} onChange={(e) => setEditingProfile({...editingProfile, phone: e.target.value})} className="bg-[#282c34] text-white mt-1" /></div>
              <div><label className="text-sm text-gray-400">Center</label><Input value={editingProfile.center} onChange={(e) => setEditingProfile({...editingProfile, center: e.target.value})} className="bg-[#282c34] text-white mt-1" /></div>
              <div><label className="text-sm text-gray-400">Birthdate</label><Input type="date" value={editingProfile.birthdate} onChange={(e) => setEditingProfile({...editingProfile, birthdate: e.target.value})} className="bg-[#282c34] text-white mt-1" /></div>
              <div><label className="text-sm text-gray-400">Gender</label><Input value={editingProfile.gender} onChange={(e) => setEditingProfile({...editingProfile, gender: e.target.value})} className="bg-[#282c34] text-white mt-1" /></div>
            </div>
            <div><label className="text-sm text-gray-400">Type of Eating Disorder</label><Textarea value={editingProfile.treatment} onChange={(e) => setEditingProfile({...editingProfile, treatment: e.target.value})} placeholder="e.g., Anorexia Nervosa" className="bg-[#282c34] text-white mt-1" /></div>
            <div><label className="text-sm text-gray-400">Therapeutic Notes</label><Textarea value={editingProfile.notes} onChange={(e) => setEditingProfile({...editingProfile, notes: e.target.value})} placeholder="Add observations..." rows={4} className="bg-[#282c34] text-white mt-1" /></div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => setIsEditModalOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleProfileUpdate} className="bg-[#8ecae6] text-[#282c34]">Save Changes</Button>
            </div>
          </div>
        </div>
      )}

			<main className="max-w-7xl mx-auto px-6 py-8">
				<div className="mb-8 flex justify-between items-center">
					<div><h2 className="text-3xl font-bold text-white">Your Patients</h2><p className="text-lg text-gray-300">Manage your patients and monitor their progress.</p></div>
          <Button onClick={() => setIsAssignModalOpen(true)} className="bg-[#8ecae6] text-[#282c34]"><Plus className="w-4 h-4 mr-2"/>Assign Patient</Button>
				</div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gentle-shadow border-0 bg-[#20232a]"><CardContent className="p-6 flex items-center justify-between"><div><p className="text-sm font-medium text-gray-300">Total Patients</p><p className="text-2xl font-bold text-white">{patients.length}</p></div><Users className="w-8 h-8 text-[#8ecae6]" /></CardContent></Card>
          <Card className="gentle-shadow border-0 bg-[#20232a]"><CardContent className="p-6 flex items-center justify-between"><div><p className="text-sm font-medium text-gray-300">Sessions This Week</p><p className="text-2xl font-bold text-white">N/A</p></div><Calendar className="w-8 h-8 text-[#c084fc]" /></CardContent></Card>
          <Card className="gentle-shadow border-0 bg-[#20232a]"><CardContent className="p-6 flex items-center justify-between"><div><p className="text-sm font-medium text-gray-300">New Drawings</p><p className="text-2xl font-bold text-white">N/A</p></div><Palette className="w-8 h-8 text-[#f9a8d4]" /></CardContent></Card>
          <Card className="gentle-shadow border-0 bg-[#20232a]"><CardContent className="p-6 flex items-center justify-between"><div><p className="text-sm font-medium text-gray-300">Positive Progress</p><p className="text-2xl font-bold text-white">N/A</p></div><TrendingUp className="w-8 h-8 text-[#8ecae6]" /></CardContent></Card>
        </div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<Card className="lg:col-span-1 gentle-shadow border-0 bg-[#20232a]">
            <CardHeader><CardTitle className="text-white">Patient List ({patients.length})</CardTitle><CardDescription className="text-gray-300">Select a patient to view details</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {patients.length > 0 ? (patients.map((patient) => (<div key={patient.id} onClick={() => setSelectedPatient(patient)} className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedPatient?.id === patient.id ? 'border-[#8ecae6] bg-[#23263a]' : 'border-[#23263a] hover:border-[#8ecae6]/50 hover:bg-[#23263a]/50'}`}><h4 className="font-medium text-white">{patient.name}</h4><p className="text-sm text-gray-400">{patient.email}</p></div>))) : (<div className="text-center py-8"><Users className="w-12 h-12 text-gray-500 mx-auto mb-4"/><h3 className="font-medium text-white">No Patients Assigned</h3><p className="text-sm text-gray-400">Click "Assign Patient" to add one.</p></div>)}
						</CardContent>
					</Card>

          {selectedPatient ? (
            <Card className="lg:col-span-2 gentle-shadow border-0 bg-[#20232a]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Patient Details</CardTitle>
                  <Button size="sm" onClick={openEditModal} className="bg-[#8ecae6] text-[#282c34] hover:bg-[#5390d9]"><Pencil className="w-4 h-4 mr-2"/>Edit Profile</Button>
                </div>
                <CardDescription className="text-gray-300">{selectedPatient.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-[#23263a]"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="drawings">Drawings ({patientDrawings.length})</TabsTrigger><TabsTrigger value="notes">Notes</TabsTrigger></TabsList>
                  <TabsContent value="overview" className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-sm text-gray-400">Full Name</label><p className="text-white">{selectedPatient.name} {selectedPatient.surname || ''}</p></div>
                      <div><label className="text-sm text-gray-400">Email</label><p className="text-white">{selectedPatient.email}</p></div>
                      <div><label className="text-sm text-gray-400">Phone</label><p className="text-white">{selectedPatient.phone || 'N/A'}</p></div>
                      <div><label className="text-sm text-gray-400">Center</label><p className="text-white">{selectedPatient.center || 'N/A'}</p></div>
                      <div><label className="text-sm text-gray-400">Birthdate</label><p className="text-white">{selectedPatient.patient_profile?.birthdate || 'N/A'}</p></div>
                      <div><label className="text-sm text-gray-400">Gender</label><p className="text-white">{selectedPatient.patient_profile?.gender || 'N/A'}</p></div>
                    </div>
                    <div><label className="text-sm text-gray-400">Type of Eating Disorder</label><p className="text-white">{selectedPatient.patient_profile?.treatment || 'N/A'}</p></div>
                  </TabsContent>
                  <TabsContent value="drawings" className="mt-4">
                    {patientDrawings.length > 0 ? (<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{patientDrawings.map(drawing => (<div key={drawing.id} className="border border-gray-700 rounded-lg p-2"><img src={drawing.image_data} alt={drawing.title || 'Patient drawing'} className="rounded-md w-full h-auto" /><p className="text-xs text-gray-400 mt-2">{new Date(drawing.created_at).toLocaleString()}</p></div>))}</div>) : (<div className="text-center py-8"><Palette className="w-12 h-12 text-gray-500 mx-auto mb-4"/><h3 className="font-medium text-white">No Drawings Found</h3><p className="text-sm text-gray-400">This patient has not created any drawings yet.</p></div>)}
                  </TabsContent>
                  <TabsContent value="notes" className="mt-4">
                    <h4 className="font-medium text-white mb-2">Therapeutic Notes</h4>
                    <p className="text-gray-300 whitespace-pre-wrap bg-[#23263a] p-4 rounded-md">{selectedPatient.patient_profile?.notes || 'No notes added yet. Click Edit Profile to add notes.'}</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-2 gentle-shadow border-0 bg-[#20232a] flex items-center justify-center"><div className="text-center"><Users className="w-12 h-12 text-gray-500 mx-auto mb-4"/><h3 className="font-medium text-white">Select a Patient</h3><p className="text-sm text-gray-400">Choose a patient from the list to see their details.</p></div></Card>
          )}
				</div>
			</main>
		</div>
	);
};

export default TherapistDashboard;