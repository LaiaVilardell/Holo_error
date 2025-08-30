import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Heart, Eye, Palette, TrendingUp, Pencil, Plus } from 'lucide-react';

// Mock patient data
const initialPatients = [
	{
		id: '1',
		name: 'Ana Garcia',
		age: 28,
		email: 'ana@email.com',
		lastSession: '2024-06-05',
		progress: 'Positive',
		drawingsCount: 5,
		notes: 'Shows improvement in emotional expression through art.',
		status: 'active',
	},
	{
		id: '3',
		name: 'Carlos Ruiz',
		age: 34,
		email: 'carlos@email.com',
		lastSession: '2024-06-03',
		progress: 'Stable',
		drawingsCount: 3,
		notes: 'Consistent participation in therapeutic activities.',
		status: 'active',
	},
	{
		id: '4',
		name: 'Maria Lopez',
		age: 22,
		email: 'maria@email.com',
		lastSession: '2024-06-01',
		progress: 'Needs Attention',
		drawingsCount: 1,
		notes: 'Low participation lately. Check motivation.',
		status: 'inactive',
	},
];

const TherapistDashboard = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [patients, setPatients] = useState(initialPatients);
	const [selectedPatient, setSelectedPatient] = useState(initialPatients[0]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [newPatient, setNewPatient] = useState({
		name: '',
		age: '',
		email: '',
		progress: 'Stable',
		drawingsCount: 0,
		notes: '',
		status: 'active',
		lastSession: '',
		id: '',
	});
	const [editPatient, setEditPatient] = useState(selectedPatient);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const getProgressColor = (progress: string) => {
		switch (progress) {
			case 'Positive':
				return 'bg-green-100 text-green-800';
			case 'Stable':
				return 'bg-[#8ecae6] text-[#282c34]';
			case 'Needs Attention':
				return 'bg-[#f9a8d4] text-[#282c34]';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Add patient
	const handleAddPatient = () => {
		const patientToAdd = {
			...newPatient,
			id: String(Date.now()),
			age: Number(newPatient.age),
			drawingsCount: Number(newPatient.drawingsCount),
		};
		setPatients([...patients, patientToAdd]);
		setShowAddModal(false);
		setNewPatient({
			name: '',
			age: '',
			email: '',
			progress: 'Stable',
			drawingsCount: 0,
			notes: '',
			status: 'active',
			lastSession: '',
			id: '',
		});
		setSelectedPatient(patientToAdd);
	};

	// Edit patient
	const handleEditPatient = () => {
		setPatients(patients.map(p => p.id === editPatient.id ? editPatient : p));
		setSelectedPatient(editPatient);
		setShowEditModal(false);
	};

	// Edit notes in real time
	const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const updated = { ...selectedPatient, notes: e.target.value };
		setSelectedPatient(updated);
		setPatients(patients.map(p => p.id === updated.id ? updated : p));
	};

	return (
		<div className="min-h-screen bg-[#282c34]">
			{/* Header */}
			<header className="bg-[#20232a] border-b border-[#282c34] px-6 py-4">
				<div className="flex items-center justify-between max-w-7xl mx-auto">
					<div className="flex items-center space-x-4">
						<div className="w-10 h-10 bg-gradient-to-br from-[#8ecae6] to-[#c084fc] rounded-full flex items-center justify-center">
							<Heart className="w-5 h-5 text-white" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-white">Holo</h1>
							<p className="text-sm text-gray-400">Therapist Panel</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-3">
							<Avatar>
								<AvatarImage src={user?.avatar} />
								<AvatarFallback className="bg-[#c084fc] text-[#282c34]">
									{user?.name?.split(' ').map(n => n[0]).join('')}
								</AvatarFallback>
							</Avatar>
							<div className="hidden sm:block">
								<p className="text-sm font-medium text-white">{user?.name}</p>
								<p className="text-xs text-gray-400">Therapist</p>
							</div>
						</div>
						<Button
							variant="outline"
							onClick={handleLogout}
							className="text-[#8ecae6] border-[#8ecae6] hover:text-white hover:bg-[#8ecae6] transition-all duration-200"
						>
							<LogOut className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</header>

			{/* Add Patient Modal */}
			{showAddModal && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-[#20232a] p-6 rounded-lg w-full max-w-md">
						<h2 className="text-xl text-white mb-4">Add Patient</h2>
						<input className="w-full mb-2 p-2 rounded" placeholder="Name"
							value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} />
						<input className="w-full mb-2 p-2 rounded" placeholder="Age"
							value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} />
						<input className="w-full mb-2 p-2 rounded" placeholder="Email"
							value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} />
						<textarea className="w-full mb-2 p-2 rounded" placeholder="Notes"
							value={newPatient.notes} onChange={e => setNewPatient({ ...newPatient, notes: e.target.value })} />
						<div className="flex justify-end space-x-2">
							<Button onClick={() => setShowAddModal(false)} variant="outline">Cancel</Button>
							<Button className="bg-[#8ecae6] text-[#282c34]" onClick={handleAddPatient}>Save</Button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Patient Modal */}
			{showEditModal && (
				<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
					<div className="bg-[#20232a] p-6 rounded-lg w-full max-w-md">
						<h2 className="text-xl text-white mb-4">Edit Patient</h2>
						<input className="w-full mb-2 p-2 rounded" placeholder="Name"
							value={editPatient.name} onChange={e => setEditPatient({ ...editPatient, name: e.target.value })} />
						<input className="w-full mb-2 p-2 rounded" placeholder="Age"
							value={editPatient.age} onChange={e => setEditPatient({ ...editPatient, age: e.target.value })} />
						<input className="w-full mb-2 p-2 rounded" placeholder="Email"
							value={editPatient.email} onChange={e => setEditPatient({ ...editPatient, email: e.target.value })} />
						<textarea className="w-full mb-2 p-2 rounded" placeholder="Notes"
							value={editPatient.notes} onChange={e => setEditPatient({ ...editPatient, notes: e.target.value })} />
						<div className="flex justify-end space-x-2">
							<Button onClick={() => setShowEditModal(false)} variant="outline">Cancel</Button>
							<Button className="bg-[#8ecae6] text-[#282c34]" onClick={handleEditPatient}>Save</Button>
						</div>
					</div>
				</div>
			)}

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-8">
				{/* Welcome Section */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h2 className="text-3xl font-bold text-white mb-2">
							Welcome, {user?.name?.split(' ')[0]}
						</h2>
						<p className="text-lg text-gray-300">
							Manage your patients and monitor their therapeutic progress.
						</p>
					</div>
					<Button className="bg-[#8ecae6] text-[#282c34]" onClick={() => setShowAddModal(true)}>
						<Plus className="w-4 h-4 mr-2" /> Add Patient
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card className="gentle-shadow border-0 bg-[#20232a]">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-300">Total Patients</p>
									<p className="text-2xl font-bold text-white">{patients.length}</p>
								</div>
								<User className="w-8 h-8 text-[#8ecae6]" />
							</div>
						</CardContent>
					</Card>
					<Card className="gentle-shadow border-0 bg-[#20232a]">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-300">Sessions This Week</p>
									<p className="text-2xl font-bold text-white">8</p>
								</div>
								<Heart className="w-8 h-8 text-[#c084fc]" />
							</div>
						</CardContent>
					</Card>
					<Card className="gentle-shadow border-0 bg-[#20232a]">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-300">New Drawings</p>
									<p className="text-2xl font-bold text-white">5</p>
								</div>
								<Palette className="w-8 h-8 text-[#f9a8d4]" />
							</div>
						</CardContent>
					</Card>
					<Card className="gentle-shadow border-0 bg-[#20232a]">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-300">Positive Progress</p>
									<p className="text-2xl font-bold text-white">67%</p>
								</div>
								<TrendingUp className="w-8 h-8 text-[#8ecae6]" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Patients Management */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Patients List */}
					<Card className="lg:col-span-1 gentle-shadow border-0 bg-[#20232a]">
						<CardHeader>
							<CardTitle className="text-white">Patient List</CardTitle>
							<CardDescription className="text-gray-300">
								Select a patient to view details
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{patients.map((patient) => (
								<div
									key={patient.id}
									onClick={() => setSelectedPatient(patient)}
									className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
										selectedPatient.id === patient.id
											? 'border-[#8ecae6] bg-[#23263a]'
											: 'border-[#23263a] hover:border-[#8ecae6]/50 hover:bg-[#23263a]/50'
									}`}
								>
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-medium text-white">{patient.name}</h4>
										<Badge className={getProgressColor(patient.progress)}>
											{patient.progress}
										</Badge>
									</div>
									<p className="text-sm text-gray-300">
										Last session: {patient.lastSession}
									</p>
									<p className="text-sm text-gray-300">
										{patient.drawingsCount} drawings
									</p>
								</div>
							))}
						</CardContent>
					</Card>

					{/* Patient Details */}
					<Card className="lg:col-span-2 gentle-shadow border-0 bg-[#20232a]">
						<CardHeader>
							<CardTitle className="text-white flex items-center justify-between">
								Patient Details
								<Button
									size="sm"
									className="bg-[#c084fc] text-[#282c34] ml-2"
									onClick={() => {
										setEditPatient(selectedPatient);
										setShowEditModal(true);
									}}
								>
									<Pencil className="w-4 h-4 mr-1" /> Edit
								</Button>
							</CardTitle>
							<CardDescription className="text-gray-300">
								{selectedPatient.name}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="overview" className="w-full">
								<TabsList className="grid w-full grid-cols-3 bg-[#23263a]">
									<TabsTrigger value="overview" className="text-white">
										Overview
									</TabsTrigger>
									<TabsTrigger value="drawings" className="text-white">
										Drawings
									</TabsTrigger>
									<TabsTrigger value="notes" className="text-white">
										Notes
									</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label className="text-sm font-medium text-gray-300">Name</label>
											<p className="text-white">{selectedPatient.name}</p>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-gray-300">Age</label>
											<p className="text-white">{selectedPatient.age} years</p>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-gray-300">Email</label>
											<p className="text-white">{selectedPatient.email}</p>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-medium text-gray-300">Status</label>
											<Badge className={getProgressColor(selectedPatient.progress)}>
												{selectedPatient.progress}
											</Badge>
										</div>
									</div>

									<div className="pt-4">
										<h4 className="font-medium text-white mb-2">
											Recent Progress
										</h4>
										<div className="bg-[#23263a] p-4 rounded-lg">
											<p className="text-sm text-gray-300">
												{selectedPatient.notes}
											</p>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="drawings" className="space-y-4">
									<div className="text-center py-8">
										<Palette className="w-12 h-12 text-[#8ecae6] mx-auto mb-4" />
										<h3 className="font-medium text-white mb-2">
											Patient Drawings
										</h3>
										<p className="text-gray-300 mb-4">
											{selectedPatient.drawingsCount} drawings created so far
										</p>
										<Button className="bg-[#8ecae6] text-[#282c34] hover:bg-[#5390d9]">
											<Eye className="w-4 h-4 mr-2" />
											View Drawings
										</Button>
									</div>
								</TabsContent>

								<TabsContent value="notes" className="space-y-4">
									<div className="space-y-4">
										<label className="text-sm font-medium text-gray-300">Notes and Observations</label>
										<textarea
											className="w-full bg-[#23263a] text-white p-2 rounded"
											value={selectedPatient.notes}
											onChange={handleNotesChange}
											rows={5}
										/>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
};

export default TherapistDashboard;
