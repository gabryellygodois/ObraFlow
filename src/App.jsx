import { useState, useEffect } from 'react';

const COLORS = {
  white: '#FFFFFF',
  bgLight: '#F5F6F5', 
  charcoal: '#1F2328', 
  slate: '#3A3F45', 
  olive: '#88AE9C', 
  oliveDark: '#6E9280', 
  ash: '#8B9199', 
  cardBg: '#F9FAFB',
};

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c7 0 10.5 7 10.5 7a13.4 13.4 0 0 1-3.1 3.9M6.6 6.6C3.5 8.6 1.5 12 1.5 12s3.5 7 10.5 7c1.4 0 2.7-.27 3.9-.75M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo({ size = 50, withLabel = true, center = true }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: center ? 'center' : 'flex-start', justifyContent: 'center' }}>
      <svg viewBox="0 0 100 100" fill="none" width={size} height={size} role="img" aria-label="ObraFlow Logo">
        <path d="M20 85 V 45 H 38 V 85" stroke={COLORS.charcoal} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M26 55 H 32" stroke={COLORS.charcoal} strokeWidth="1.5" />
        <path d="M26 67 H 32" stroke={COLORS.charcoal} strokeWidth="1.5" />

        <path d="M38 85 V 15 H 62 V 85" stroke={COLORS.charcoal} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M46 27 H 54" stroke={COLORS.charcoal} strokeWidth="1.5" />
        <path d="M46 39 H 54" stroke={COLORS.charcoal} strokeWidth="1.5" />
        <path d="M46 51 H 54" stroke={COLORS.charcoal} strokeWidth="1.5" />
        
        <path d="M62 85 V 35 H 80 V 85" stroke={COLORS.charcoal} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M68 47 H 74" stroke={COLORS.charcoal} strokeWidth="1.5" />
        <path d="M68 59 H 74" stroke={COLORS.charcoal} strokeWidth="1.5" />

        <path d="M12 85 H 88" stroke={COLORS.charcoal} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M72 70 L 78 76 L 90 60" stroke={COLORS.olive} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      
      {withLabel && (
        <div style={{ textAlign: center ? 'center' : 'left', marginTop: '8px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '20px', color: COLORS.charcoal, fontFamily: 'sans-serif' }}>
            Obra<span style={{ color: COLORS.olive }}>Flow</span>
          </div>
          <div style={{ fontSize: '8px', fontWeight: '600', marginTop: '4px', color: COLORS.ash, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Planeje. Organize. Construa.
          </div>
        </div>
      )}
    </div>
  );
}

const INITIAL_PROJECTS = {
  'NRE-01': {
    title: 'Colégio Estadual Dom Pedro II',
    location: 'Rua das Flores, 450 - Centro',
    category: 'nre',
    diario: '',
    tasks: [
      { id: 1, text: 'Vistoria técnica das instalações e infraestrutura da quadra', done: true },
      { id: 2, text: 'Avaliação da cobertura policarbonato avariada', done: false }
    ]
  },
  'NRE-02': {
    title: 'C. E. Alberto Santos Dumont',
    location: 'Av. Central, 102 - Bairro Alto',
    category: 'nre',
    diario: '',
    tasks: [
      { id: 1, text: 'Avaliação de acessibilidade (Rampas e sanitários PCD)', done: true },
      { id: 2, text: 'Checklist de prevenção de incêndio e pânico (Bombeiros)', done: false }
    ]
  },
  'PART-01': {
    title: 'Residência Jardim Buenos Aires',
    location: 'Av. das Palmeiras, 1050',
    category: 'particulares',
    diario: '',
    tasks: [
      { id: 1, text: 'Vistoria Estrutural de Sapatas e fundação', done: true },
      { id: 2, text: 'Conferência do recebimento de armaduras de aço', done: true }
    ]
  },
  'PART-02': {
    title: 'Edifício Terraço Verde',
    location: 'Rua Chile, 89',
    category: 'particulares',
    diario: '',
    tasks: [
      { id: 1, text: 'Medição fina de gesso e acabamentos internos', done: false },
      { id: 2, text: 'Revisão dos pontos de iluminação e elétrica em tetos', done: false }
    ]
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');
  
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('nre'); 

  // Estado unificado com persistência de dados isolados por obra
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('obraflow_projects_data');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProjectCode, setActiveProjectCode] = useState('');
  const [newTaskText, setNewTaskText] = useState('');

  // Estados para criação dinâmica de novas demandas
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjLocation, setNewProjLocation] = useState('');

  useEffect(() => {
    localStorage.setItem('obraflow_projects_data', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('obraflow_usuario_logado');
    if (usuarioSalvo) {
      formatarEDefinirNome(usuarioSalvo);
      setEmail(usuarioSalvo);
      setIsLoggedIn(true);
      setCurrentScreen('dashboard');
    }
  }, []);

  const formatarEDefinirNome = (emailInformado) => {
    const emailNamePart = emailInformado.split('@')[0];
    const firstWord = emailNamePart.split(/[\._-]/)[0];
    const formattedName = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    setUserName(formattedName);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    formatarEDefinirNome(email);
    localStorage.setItem('obraflow_usuario_logado', email);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('obraflow_usuario_logado');
    setIsLoggedIn(false);
    setPassword('');
    setEmail('');
    setCurrentScreen('login');
  };

  const openProjectDetails = (code) => {
    setActiveProjectCode(code);
    setCurrentScreen('detalhes');
  };

  const toggleTask = (taskid) => {
    setProjects(prev => ({
      ...prev,
      [activeProjectCode]: {
        ...prev[activeProjectCode],
        tasks: prev[activeProjectCode].tasks.map(t => t.id === taskid ? { ...t, done: !t.done } : t)
      }
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const currentTasks = projects[activeProjectCode].tasks;
    const newId = currentTasks.length > 0 ? Math.max(...currentTasks.map(t => t.id)) + 1 : 1;
    
    const createdTask = { id: newId, text: newTaskText.trim(), done: false };

    setProjects(prev => ({
      ...prev,
      [activeProjectCode]: {
        ...prev[activeProjectCode],
        tasks: [...prev[activeProjectCode].tasks, createdTask]
      }
    }));
    setNewTaskText('');
  };

  const handleUpdateDiario = (texto) => {
    setProjects(prev => ({
      ...prev,
      [activeProjectCode]: {
        ...prev[activeProjectCode],
        diario: texto
      }
    }));
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjLocation.trim()) return;

    const prefix = activeTab === 'nre' ? 'NRE' : 'PART';
    const existingKeys = Object.keys(projects).filter(k => k.startsWith(prefix));
    const nextIndex = existingKeys.length + 1;
    const generatedCode = `${prefix}-${String(nextIndex).padStart(2, '0')}`;

    const newProjectStructure = {
      title: newProjTitle.trim(),
      location: newProjLocation.trim(),
      category: activeTab,
      diario: '',
      tasks: [] 
    };

    setProjects(prev => ({
      ...prev,
      [generatedCode]: newProjectStructure
    }));

    setNewProjTitle('');
    setNewProjLocation('');
    setShowNewProjectForm(false);
  };

  const currentProject = projects[activeProjectCode];

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: COLORS.white, fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '16px', backgroundColor: COLORS.white, border: '1px solid #E5E7EB', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <Logo size={75} center={true} />
          <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: COLORS.charcoal }}>Bem-vindo de volta</h2>
            <p style={{ fontSize: '14px', color: COLORS.ash, margin: '0' }}>Gerencie suas obras e vistorias num só lugar</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', color: COLORS.slate, textAlign: 'center' }}>Login Profissional</label>
              <input type="email" required style={{ width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', border: '1px solid #D1D5DB', backgroundColor: COLORS.bgLight, color: COLORS.charcoal, outline: 'none' }} placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', color: COLORS.slate, textAlign: 'center' }}>Senha</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input type={showPassword ? 'text' : 'password'} required style={{ width: '100%', boxSizing: 'border-box', padding: '12px 48px 12px 16px', borderRadius: '12px', fontSize: '14px', border: '1px solid #D1D5DB', backgroundColor: COLORS.bgLight, color: COLORS.charcoal, outline: 'none' }} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: COLORS.ash, display: 'flex', alignItems: 'center' }} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
              </div>
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', backgroundColor: COLORS.olive, color: COLORS.white, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>Acessar Painel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif', color: COLORS.charcoal }}>
      <header style={{ backgroundColor: COLORS.white, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB' }}>
        <Logo size={40} withLabel={true} center={false} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: COLORS.slate }}>Olá, {userName}! 👋</span>
          <button onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: COLORS.white, cursor: 'pointer', color: COLORS.slate }}>Sair</button>
        </div>
      </header>

      {/* DASHBOARD PRINCIPAL */}
      {currentScreen === 'dashboard' && (
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Visão Geral</h1>
              <p style={{ color: COLORS.ash, margin: 0, fontSize: '14px' }}>Gerencie checklists e diários técnicos individualizados por obra.</p>
            </div>
            <button 
              onClick={() => setShowNewProjectForm(!showNewProjectForm)}
              style={{ padding: '10px 18px', backgroundColor: activeTab === 'nre' ? COLORS.oliveDark : COLORS.charcoal, color: COLORS.white, border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            >
              {showNewProjectForm ? '✕ Cancelar Cadastro' : `+ Nova Obra ${activeTab === 'nre' ? 'NRE' : 'Particular'}`}
            </button>
          </div>

          {/* FORMULÁRIO PARA CADASTRAR NOVA OBRA */}
          {showNewProjectForm && (
            <div style={{ backgroundColor: COLORS.white, padding: '24px', borderRadius: '16px', border: `2px dashed ${COLORS.olive}`, marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Nova Demanda ({activeTab === 'nre' ? '🏫 Setor Público NRE' : '💼 Setor Privado'})</h3>
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    required 
                    placeholder="Nome da Obra / Colégio" 
                    value={newProjTitle} 
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    style={{ flex: 1, minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                  />
                  <input 
                    type="text" 
                    required 
                    placeholder="Endereço / Localização" 
                    value={newProjLocation} 
                    onChange={(e) => setNewProjLocation(e.target.value)}
                    style={{ flex: 1, minWidth: '200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                  />
                </div>
                <button type="submit" style={{ alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: COLORS.olive, color: COLORS.white, border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                  Confirmar e Registrar Obra
                </button>
              </form>
            </div>
          )}

          <div style={{ backgroundColor: COLORS.white, padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            
            {/* SELETOR DE ABAS */}
            <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '24px', gap: '8px' }}>
              <button
                onClick={() => { setActiveTab('nre'); setShowNewProjectForm(false); }}
                style={{ padding: '12px 16px', fontSize: '15px', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'nre' ? `3px solid ${COLORS.olive}` : '3px solid transparent', color: activeTab === 'nre' ? COLORS.oliveDark : COLORS.ash, transition: '0.2s' }}
              >
                🏫 Demandas NRE
              </button>
              <button
                onClick={() => { setActiveTab('particulares'); setShowNewProjectForm(false); }}
                style={{ padding: '12px 16px', fontSize: '15px', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'particulares' ? `3px solid ${COLORS.charcoal}` : '3px solid transparent', color: activeTab === 'particulares' ? COLORS.charcoal : COLORS.ash, transition: '0.2s' }}
              >
                💼 Projetos Particulares
              </button>
            </div>

            {/* LISTAGEM DINÂMICA DAS OBRAS POR CATEGORIA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.keys(projects)
                .filter(code => projects[code].category === activeTab)
                .map(code => {
                  const proj = projects[code];
                  const tasksDone = proj.tasks.filter(t => t.done).length;
                  const totalTasks = proj.tasks.length;
                  const pct = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;

                  return (
                    <div 
                      key={code}
                      onClick={() => openProjectDetails(code)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', backgroundColor: activeTab === 'nre' ? '#F0F7F4' : COLORS.bgLight, cursor: 'pointer', border: '1px solid transparent', transition: '0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = activeTab === 'nre' ? COLORS.olive : COLORS.charcoal}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', color: activeTab === 'nre' ? COLORS.oliveDark : COLORS.charcoal }}>{proj.title} ➔</div>
                        <div style={{ fontSize: '12px', color: COLORS.ash, marginTop: '2px' }}>Local: {proj.location}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: COLORS.slate }}>{pct}% Concluído</span>
                        <div style={{ fontSize: '11px', color: COLORS.ash }}>({tasksDone}/{totalTasks} itens verificados)</div>
                      </div>
                    </div>
                  );
                })
              }
            </div>

          </div>
        </main>
      )}

      {/* DETALHES COMPLETAMENTE ISOLADOS E EDITÁVEIS */}
      {currentScreen === 'detalhes' && currentProject && (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
          
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: COLORS.oliveDark, fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
          >
            ← Voltar para o Painel Geral
          </button>

          <div style={{ backgroundColor: COLORS.white, padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            
            <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '20px', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: currentProject.category === 'nre' ? COLORS.oliveDark : COLORS.charcoal, backgroundColor: currentProject.category === 'nre' ? '#EBF5F0' : '#F3F4F6', padding: '4px 8px', borderRadius: '6px' }}>
                Ref: {activeProjectCode}
              </span>
              <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '12px 0 6px 0' }}>{currentProject.title}</h1>
              <p style={{ color: COLORS.ash, margin: 0, fontSize: '14px' }}>📍 {currentProject.location}</p>
            </div>

            {/* Checklist Dinâmico e Customizável */}
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '16px' }}>📋 Checklist de Vistorias Técnicas</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {currentProject.tasks.map((task) => (
                  <label 
                    key={task.id} 
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '10px', backgroundColor: task.done ? '#F9FAFB' : COLORS.white, border: task.done ? '1px solid #E5E7EB' : '1px solid #D1D5DB', cursor: 'pointer' }}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.done} 
                      onChange={() => toggleTask(task.id)}
                      style={{ width: '18px', height: '18px', accentColor: COLORS.olive }}
                    />
                    <span style={{ fontSize: '14px', color: task.done ? COLORS.ash : COLORS.charcoal, textDecoration: task.done ? 'line-through' : 'none' }}>
                      {task.text}
                    </span>
                  </label>
                ))}
                {currentProject.tasks.length === 0 && (
                  <div style={{ fontSize: '13px', color: COLORS.ash, fontStyle: 'italic', padding: '10px 0' }}>Nenhum item adicionado à inspeção técnica desta obra. Comece adicionando abaixo!</div>
                )}
              </div>

              {/* Form para adicionar novos itens ao Checklist daquela obra específica */}
              <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={newTaskText} 
                  onChange={(e) => setNewTaskText(e.target.value)} 
                  placeholder="Ex: Verificar fissuras na viga superior esquerda..."
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '14px' }}
                />
                <button 
                  type="submit" 
                  style={{ padding: '10px 16px', backgroundColor: COLORS.olive, color: COLORS.white, border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                >
                  + Adicionar Item
                </button>
              </form>
            </div>

            {/* Diário de Obra Isolado */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>✍️ Parecer do Especialista / Diário Técnico</h3>
              <textarea 
                value={currentProject.diario}
                onChange={(e) => handleUpdateDiario(e.target.value)}
                placeholder={currentProject.category === 'nre' ? "Insira os apontamentos sobre a infraestrutura da escola estadual para compor o relatório do NRE..." : "Insira as anotações sobre a evolução e materiais da obra particular..."} 
                style={{ width: '100%', boxSizing: 'border-box', height: '120px', padding: '12px', borderRadius: '10px', border: '1px solid #D1D5DB', backgroundColor: COLORS.bgLight, fontSize: '14px', outline: 'none', resize: 'vertical' }}
              />
              <div style={{ fontSize: '11px', color: COLORS.ash, marginTop: '6px', textAlign: 'right' }}>
                💾 Salvo automaticamente no dispositivo.
              </div>
            </div>

          </div>
        </main>
      )}

    </div>
  );
}