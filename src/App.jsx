import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  CheckSquare, 
  ClipboardList, 
  User, 
  LogOut, 
  Plus, 
  ChevronRight, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  HardHat,
  MapPin,
  Key
} from 'lucide-react';

// Cores do Sistema
const COLORS = {
  primary: '#1E3A8A',    
  secondary: '#F59E0B',  
  success: '#10B981',    
  danger: '#EF4444',     
  background: '#F3F4F6', 
  textDark: '#1F2937',   
  textLight: '#4B5563',  
  white: '#FFFFFF'
};

const INITIAL_PROJECTS = {
  'NRE-01': {
    title: 'Colégio Estadual Santos Dumont',
    location: 'Curitiba - Centro',
    category: 'nre',
    responsavel: 'Eng. Carlos / Arq. Ana Paula', 
    diario: 'Fundações concluídas. Iniciando alvenaria do primeiro pavimento.',
    tasks: [
      { id: 1, text: 'Escavação das sapatas', status: 'done' },
      { id: 2, text: 'Concretagem dos blocos', status: 'done' },
      { id: 3, text: 'Levantamento de alvenaria', status: 'doing' },
      { id: 4, text: 'Instalações hidráulicas embutidas', status: 'todo' }
    ]
  },
  'PART-01': {
    title: 'Residência Unifamiliar - Jd. Social',
    location: 'Curitiba - Jardim Social',
    category: 'particular',
    responsavel: 'Eng. Roberto / Eng. Letícia', 
    diario: 'Reboco interno finalizado. Iniciando colocação de pisos cerâmicos.',
    tasks: [
      { id: 1, text: 'Instalação elétrica interna', status: 'done' },
      { id: 2, text: 'Reboco das paredes', status: 'done' },
      { id: 3, text: 'Colocação de porcelanato', status: 'doing' }
    ]
  }
};

export default function App() {
  // Estados de Autenticação e Senhas (salvas no localStorage)
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [passwords, setPasswords] = useState(() => {
    const saved = localStorage.getItem('obraflow_creds');
    return saved ? JSON.parse(saved) : { fiscal: '1234', particular: '1234' };
  });

  // Estados do App
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('obraflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [activeTab, setActiveTab] = useState('nre'); 
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login'); 

  // Estados de Formulários e Modal de Senha
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjLocation, setNewProjLocation] = useState('');
  const [newProjResponsavel, setNewProjResponsavel] = useState(''); 
  const [newTaskText, setNewTaskText] = useState('');
  const [diarioText, setDiarioText] = useState('');

  // Campos para troca de senha
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Persistência
  useEffect(() => {
    localStorage.setItem('obraflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('obraflow_creds', JSON.stringify(passwords));
  }, [passwords]);

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('Preencha todos os campos.');
      return;
    }

    const userLower = username.toLowerCase();
    if (userLower === 'fiscal' && password === passwords.fiscal) {
      setUser({ name: 'Fiscal do Estado', role: 'fiscal' });
      setCurrentScreen('dashboard');
      setLoginError('');
    } else if (userLower === 'particular' && password === passwords.particular) {
      setUser({ name: 'Engenheiro Residente', role: 'particular' });
      setCurrentScreen('dashboard');
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsername('');
    setPassword('');
    setCurrentScreen('login');
    setShowPasswordModal(false);
  };

  // Troca de Senha
  const handleChangePassword = (e) => {
    e.preventDefault();
    const currentRole = user?.role; // 'fiscal' ou 'particular'
    
    if (currentPassInput !== passwords[currentRole]) {
      setPasswordError('Senha atual incorreta.');
      return;
    }
    if (newPassInput.length < 4) {
      setPasswordError('A nova senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    setPasswords(prev => ({
      ...prev,
      [currentRole]: newPassInput
    }));

    alert('Senha alterada com sucesso!');
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setPasswordError('');
    setShowPasswordModal(false);
  };

  // Criação de Projetos
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjLocation.trim() || !newProjResponsavel.trim()) return;

    const prefix = activeTab === 'nre' ? 'NRE' : 'PART';
    const existingKeys = Object.keys(projects).filter(k => k.startsWith(prefix));
    const generatedCode = `${prefix}-${String(existingKeys.length + 1).padStart(2, '0')}`;

    const newProjectStructure = {
      title: newProjTitle.trim(),
      location: newProjLocation.trim(),
      category: activeTab,
      responsavel: newProjResponsavel.trim(), 
      diario: '',
      tasks: [] 
    };

    setProjects(prev => ({
      ...prev,
      [generatedCode]: newProjectStructure
    }));

    setNewProjTitle('');
    setNewProjLocation('');
    setNewProjResponsavel('');
    setShowNewProjectForm(false);
  };

  // Adicionar Tarefa
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !selectedProjectId) return;

    setProjects(prev => {
      const proj = prev[selectedProjectId];
      const newId = proj.tasks.length > 0 ? Math.max(...proj.tasks.map(t => t.id)) + 1 : 1;
      const newTask = { id: newId, text: newTaskText.trim(), status: 'todo' };
      return {
        ...prev,
        [selectedProjectId]: {
          ...proj,
          tasks: [...proj.tasks, newTask]
        }
      };
    });
    setNewTaskText('');
  };

  // Alterar Status da Tarefa
  const handleToggleTaskStatus = (taskId, currentStatus) => {
    let nextStatus = 'todo';
    if (currentStatus === 'todo') nextStatus = 'doing';
    if (currentStatus === 'doing') nextStatus = 'done';

    setProjects(prev => {
      const proj = prev[selectedProjectId];
      const updatedTasks = proj.tasks.map(t => t.id === taskId ? { ...t, status: nextStatus } : t);
      return {
        ...prev,
        [selectedProjectId]: { ...proj, tasks: updatedTasks }
      };
    });
  };

  // Atualizar Diário de Obra
  const handleSaveDiario = () => {
    if (!selectedProjectId) return;
    setProjects(prev => ({
      ...prev,
      [selectedProjectId]: {
        ...prev[selectedProjectId],
        diario: diarioText
      }
    }));
    alert('Diário de obra updated!');
  };

  // Abrir Detalhes da Obra
  const openProjectDetails = (id) => {
    setSelectedProjectId(id);
    setDiarioText(projects[id].diario || '');
    setCurrentScreen('details');
  };

  if (currentScreen === 'login') {
    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: COLORS.white, padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', justifyContent: 'center' }}>
            <Building2 size={36} color={COLORS.primary} />
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.primary, letterSpacing: '-1px' }}>ObraFlow</span>
          </div>
          
          <h2 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center', color: COLORS.textDark }}>Acesso ao Sistema</h2>
          
          {loginError && (
            <div style={{ backgroundColor: '#FEE2E2', color: COLORS.danger, padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} /> {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: COLORS.textLight, marginBottom: '6px' }}>Usuário</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Ex: fiscal ou particular" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: COLORS.textLight, marginBottom: '6px' }}>Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ backgroundColor: COLORS.primary, color: COLORS.white, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '10px' }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (currentScreen === 'dashboard') {
    const filteredCodes = Object.keys(projects).filter(code => projects[code].category === activeTab);

    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.background, fontFamily: 'sans-serif' }}>
        {/* Header */}
        <header style={{ backgroundColor: COLORS.primary, color: COLORS.white, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={24} />
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>ObraFlow</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '14px' }}>
              <User size={16} />
              <span>{user?.name}</span>
            </div>
            
            {/* Botão de Trocar Senha */}
            <button onClick={() => { setPasswordError(''); setShowPasswordModal(true); }} style={{ background: 'none', border: 'none', color: COLORS.white, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', opacity: 0.9 }}>
              <Key size={16} /> Alterar Senha
            </button>

            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: COLORS.white, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        </header>

        {/* Modal de Alteração de Senha */}
        {showPasswordModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: COLORS.white, padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '360px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: COLORS.textDark, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} color={COLORS.primary} /> Alterar Senha
              </h3>
              
              {passwordError && (
                <div style={{ backgroundColor: '#FEE2E2', color: COLORS.danger, padding: '8px', borderRadius: '6px', marginBottom: '12px', fontSize: '13px' }}>
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: COLORS.textLight }}>Senha Atual</label>
                  <input type="password" required value={currentPassInput} onChange={e => setCurrentPassInput(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: COLORS.textLight }}>Nova Senha</label>
                  <input type="password" required value={newPassInput} onChange={e => setNewPassInput(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: COLORS.textLight }}>Confirmar Nova Senha</label>
                  <input type="password" required value={confirmPassInput} onChange={e => confirmPassInput(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowPasswordModal(false)} style={{ backgroundColor: '#E5E7EB', color: COLORS.textDark, border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Cancelar</button>
                  <button type="submit" style={{ backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #E5E7EB', paddingBottom: '1px' }}>
            <button onClick={() => { setActiveTab('nre'); setShowNewProjectForm(false); }} style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '600', border: 'none', background: 'none', borderBottom: activeTab === 'nre' ? `4px solid ${COLORS.secondary}` : '4px solid transparent', color: activeTab === 'nre' ? COLORS.primary : COLORS.textLight, cursor: 'pointer' }}>
              Obras Públicas (NRE)
            </button>
            <button onClick={() => { setActiveTab('particular'); setShowNewProjectForm(false); }} style={{ padding: '12px 24px', fontSize: '16px', fontWeight: '600', border: 'none', background: 'none', borderBottom: activeTab === 'particular' ? `4px solid ${COLORS.secondary}` : '4px solid transparent', color: activeTab === 'particular' ? COLORS.primary : COLORS.textLight, cursor: 'pointer' }}>
              Contratos Particulares
            </button>
          </div>

          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: COLORS.textDark }}>
              {activeTab === 'nre' ? 'Demandas de Núcleos Regionais de Educação' : 'Projetos e Reformas Privadas'}
            </h2>
            <button onClick={() => setShowNewProjectForm(!showNewProjectForm)} style={{ backgroundColor: COLORS.secondary, color: COLORS.white, border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Plus size={18} /> Nova Demanda
            </button>
          </div>

          {showNewProjectForm && (
            <div style={{ backgroundColor: COLORS.white, padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px', color: COLORS.textDark }}>Cadastrar Nova Obra/Demanda</h3>
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <input type="text" required placeholder="Nome do Projeto / Escola" value={newProjTitle} onChange={e => setNewProjTitle(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <input type="text" required placeholder="Localização / Município" value={newProjLocation} onChange={e => setNewProjLocation(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <input type="text" required placeholder="Profissionais (Ex: Eng. Carlos / Arq. Marina)" value={newProjResponsavel} onChange={e => setNewProjResponsavel(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" style={{ backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Salvar</button>
                  <button type="button" onClick={() => setShowNewProjectForm(false)} style={{ backgroundColor: '#E5E7EB', color: COLORS.textDark, border: 'none', padding: '11px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {filteredCodes.length === 0 ? (
            <div style={{ backgroundColor: COLORS.white, textAlign: 'center', padding: '40px', borderRadius: '12px', color: COLORS.textLight, border: '1px dashed #CDD5DF' }}>
              Nenhuma obra cadastrada nesta categoria.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {filteredCodes.map(code => {
                const proj = projects[code];
                const doneTasks = proj.tasks.filter(t => t.status === 'done').length;
                const totalTasks = proj.tasks.length;
                const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

                return (
                  <div key={code} onClick={() => openProjectDetails(code)} style={{ backgroundColor: COLORS.white, borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <span style={{ backgroundColor: '#E0E7FF', color: COLORS.primary, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{code}</span>
                        <ChevronRight size={18} color="#9CA3AF" />
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: COLORS.textDark, marginBottom: '6px' }}>{proj.title}</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.textLight, fontSize: '13px', marginBottom: '6px' }}>
                        <MapPin size={14} />
                        <span>{proj.location}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.textLight, fontSize: '13px', marginBottom: '14px' }}>
                        <HardHat size={14} />
                        <span>{proj.responsavel || 'Não atribuído'}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: COLORS.textDark }}>
                        <span>Progresso Geral</span>
                        <span>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', backgroundColor: '#E5E7EB', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, backgroundColor: pct === 100 ? COLORS.success : COLORS.primary, height: '100%', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  if (currentScreen === 'details') {
    const project = projects[selectedProjectId];
    if (!project) return null;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: COLORS.background, fontFamily: 'sans-serif' }}>
        <header style={{ backgroundColor: COLORS.primary, color: COLORS.white, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setCurrentScreen('dashboard')} style={{ background: 'none', border: 'none', color: COLORS.white, cursor: 'pointer' }}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>{selectedProjectId}</span>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', display: 'inline-block' }}>{project.title}</h1>
          </div>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: COLORS.white, padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: COLORS.textDark, borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>Dados da Obra</h2>
              <p style={{ fontSize: '14px', marginBottom: '8px', color: COLORS.textLight }}><strong>Localização:</strong> {project.location}</p>
              <p style={{ fontSize: '14px', color: COLORS.textLight }}><strong>Responsáveis:</strong> {project.responsavel || 'Não atribuído'}</p>
            </div>

            <div style={{ backgroundColor: COLORS.white, padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
                <FileText size={18} color={COLORS.primary} />
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: COLORS.textDark }}>Diário de Obra / Relatório Técnico</h2>
              </div>
              <textarea value={diarioText} onChange={e => setDiarioText(e.target.value)} style={{ width: '100%', flex: 1, minHeight: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={handleSaveDiario} style={{ marginTop: '12px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-end' }}>Salvar Relatório</button>
            </div>
          </div>

          <div style={{ backgroundColor: COLORS.white, padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
              <CheckSquare size={18} color={COLORS.primary} />
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: COLORS.textDark }}>Checklist de Itens e Vistorias</h2>
            </div>

            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input type="text" required placeholder="Nova verificação" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
              <button type="submit" style={{ backgroundColor: '#E5E7EB', color: COLORS.textDark, border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Inserir</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {project.tasks.map(task => {
                let badgeIcon = <Clock size={14} color="#9CA3AF" />;
                let bgTaskColor = '#F9FAFB';
                if (task.status === 'doing') { badgeIcon = <Clock size={14} color={COLORS.secondary} />; bgTaskColor = '#FEF3C7'; }
                if (task.status === 'done') { badgeIcon = <CheckCircle2 size={14} color={COLORS.success} />; bgTaskColor = '#D1FAE5'; }

                return (
                  <div key={task.id} onClick={() => handleToggleTaskStatus(task.id, task.status)} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderRadius: '8px', backgroundColor: bgTaskColor, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      {badgeIcon}
                      <span style={{ fontSize: '14px', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
