import React, { useState, useEffect, useContext, createContext, useMemo, useCallback } from 'react';
import {
  initializeApp
} from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  query,
  onSnapshot,
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
  where,
  limit,
  setLogLevel
} from 'firebase/firestore';

// --- ICONS (Using Lucide) ---
const X = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const Sun = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const Moon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
const Plus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
const User = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Search = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const Activity = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const Users = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Tag = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.71 8.71a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-8.71-8.71z"/><line x1="7" x2="7.01" y1="7" y2="7"/></svg>;
const LayoutDashboard = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const ListTodo = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="6" height="6" rx="1"/><path d="m13 7h8"/><path d="m13 17h8"/><rect x="3" y="15" width="6" height="6" rx="1"/></svg>;
const SettingsIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.46a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.73v.53a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.78 1.46a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 1-1.74v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.46a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.73v-.53a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.78-1.46a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;

// --- CONFIGURATION & UTILITIES ---

const TASKS_COLLECTION = 'tasks';
const SETTINGS_COLLECTION = 'settings';

// Simulated team data
const TEAMS = [{
  id: 'T1',
  name: 'Marketing',
  members: [{
    id: 'M1',
    name: 'Alice Smith'
  }, {
    id: 'M2',
    name: 'Sarah Chen'
  }, ],
}, {
  id: 'T2',
  name: 'Engineering',
  members: [{
    id: 'M3',
    name: 'Bob Johnson'
  }, {
    id: 'M4',
    name: 'David Green'
  }, {
    id: 'M5',
    name: 'Emily Davis'
  }, ],
}, ];
const ALL_MEMBERS = TEAMS.flatMap(t => t.members);
const STATUSES = ['To Do', 'In Progress', 'Done', 'Blocked']; // Added Blocked based on Task List UI
const TAGS = ['Feature', 'Bug', 'Design', 'Content', 'Urgent', 'UI/UX', 'Backend', 'Frontend', 'Reporting', 'Finance', 'DevOps', 'Infrastructure', 'UX', 'Research', 'Strategy', 'Meeting'];

// Helper to format date
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  // Firestore Timestamps need to be converted to JS Date
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// --- FIREBASE CONTEXT & HOOKS ---

const FirestoreContext = createContext({
  db: null,
  auth: null,
  appId: 'default-app-id',
  userId: null,
  isAuthReady: false,
  handleSignOut: () => {},
  handleLocalSignInBypass: () => {}, // ADDED MOCK FUNCTION
  handleSignIn: () => {},
  handleSignUp: () => {},
  handleSignInAnonymously: () => {},
});

/**
 * Custom Hook to listen to a Firestore collection in real-time.
 */
const useFirestoreCollection = (collectionName, isPublic = true, constraints = []) => {
  const {
    db,
    appId,
    userId,
    isAuthReady
  } = useContext(FirestoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthReady || !db || !userId || !appId) {
      // If db/auth is null (mock mode), skip the subscription
      if (isAuthReady && !db) {
          console.warn("Firestore is running in simulated/mock mode. No live data connection.");
          setLoading(false);
          // Return mock data for a development environment
          if (collectionName === TASKS_COLLECTION) {
              setData(createMockTasks());
          } else {
              setData([]);
          }
      }
      return;
    }

    let collectionPath;
    if (isPublic) {
      collectionPath = `artifacts/${appId}/public/data/${collectionName}`;
    } else {
      collectionPath = `artifacts/${appId}/users/${userId}/${collectionName}`;
    }

    const colRef = collection(db, collectionPath);
    const q = query(colRef, ...constraints);

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(docs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Firestore listen failed:", err);
      setError("Failed to fetch data.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isAuthReady, db, appId, userId, collectionName, JSON.stringify(constraints)]);

  return {
    data,
    loading,
    error,
    db
  };
};

// --- MOCK TASK CREATION FOR BYPASS MODE ---
const createMockTasks = () => {
    const mockTasks = [];
    const titles = ["Design Homepage", "Implement Authentication", "Fix CSS Bug on Mobile", "Write Q3 Report", "Configure CI/CD Pipeline", "Review Pull Request #101"];
    const descriptions = ["Create a modern and responsive design for the main landing page.", "Set up Firebase email/password and social login.", "The main navigation bar is broken on screens below 768px.", "Summarize sales performance and future strategy.", "Automate testing and deployment process.", "Check new features for bugs and code quality."];
    const assignees = ['M1', 'M2', 'M3', 'M4', 'M5'];
    
    for (let i = 1; i <= 10; i++) {
        const statusIndex = i % STATUSES.length;
        const assigneeIndex = i % assignees.length;
        const tagIndex = i % TAGS.length;
        
        mockTasks.push({
            id: `T${i}`,
            title: titles[i % titles.length],
            description: descriptions[i % descriptions.length],
            status: STATUSES[statusIndex],
            priority: statusIndex === 0 ? 'High' : (statusIndex === 1 ? 'Medium' : 'Low'),
            dueDate: `2025-12-1${i}`,
            assignedTo: assignees[assigneeIndex],
            tags: [TAGS[tagIndex], TAGS[(tagIndex + 1) % TAGS.length]],
            createdAt: { seconds: Date.now() / 1000 - (i * 86400) },
            activityLog: [
                { user: assignees[assigneeIndex], action: 'Task created', timestamp: new Date(Date.now() - (i * 86400000)).toISOString() },
                { user: 'M1', action: `Changed status to '${STATUSES[statusIndex]}'`, timestamp: new Date(Date.now() - (i * 3600000)).toISOString() }
            ]
        });
    }
    return mockTasks;
};


/**
 * Provides Firebase initialization and Auth state management.
 * 🚨 MODIFIED FOR LOCAL BYPASS 🚨
 */
const FirebaseProvider = ({
  children
}) => {
  // Set all Firebase-related objects to null in mock mode
  const [db, setDb] = useState(null); 
  const [auth, setAuth] = useState(null); 
  
  // Local state for authentication
  const [userId, setUserId] = useState(null); 
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // Keep the original way of getting config for environment check
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  // const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  // const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

  // 🚨 MOCK AUTH IMPLEMENTATION 🚨
  useEffect(() => {
    // Immediately set Auth Ready after a small delay to simulate quick check
    const timer = setTimeout(() => {
        setIsAuthReady(true); 
    }, 50); 
    return () => clearTimeout(timer);
  }, []); 
  
  // MOCK LOGIN FUNCTION: Bypasses Firebase and sets a local mock UID
  const handleLocalSignInBypass = useCallback((userIdentifier) => {
    // Use the input as a base for a mock UID
    const mockUid = `MOCK_UID_${userIdentifier.substring(0, 5).toUpperCase()}`;
    setUserId(mockUid);
    console.log(`Local Sign In Bypass successful. Logged in as: ${mockUid}`);
  }, []);

  // MOCK LOGOUT
  const handleSignOut = useCallback(async () => {
    setUserId(null); 
    console.log("Session signed out/reset.");
  }, []);
    
  // MOCK AUTH FUNCTIONS (Throw error/call bypass)
  const handleSignIn = useCallback(async (email, password) => {
      throw new Error("Local Bypass is active. Firebase Sign In is disabled.");
  }, []);

  const handleSignUp = useCallback(async (email, password) => {
      throw new Error("Local Bypass is active. Firebase Sign Up is disabled.");
  }, []);
  
  const handleSignInAnonymously = useCallback(async () => {
      // Simulate anonymous login using the bypass
      handleLocalSignInBypass('ANONYMOUS');
  }, [handleLocalSignInBypass]);


  const value = useMemo(() => ({
    db, // null in mock mode
    auth, // null in mock mode
    appId,
    userId,
    isAuthReady,
    handleSignOut,
    handleSignIn,
    handleSignUp,
    handleSignInAnonymously,
    handleLocalSignInBypass // ADDED
  }), [db, auth, appId, userId, isAuthReady, handleSignOut, handleSignIn, handleSignUp, handleSignInAnonymously, handleLocalSignInBypass]);

  return <FirestoreContext.Provider value={value}>{children}</FirestoreContext.Provider>;
};


// --- CONTEXT API (Theme and Tasks) ---

const ThemeContext = createContext();

const ThemeProvider = ({
  children
}) => {
  const {
    db,
    appId,
    userId,
    isAuthReady
  } = useContext(FirestoreContext);
  // Custom hook to fetch user settings (non-public data)
  // This will use the mock data or skip fetching if db is null
  const {
    data: settingsData,
    loading: settingsLoading
  } = useFirestoreCollection(SETTINGS_COLLECTION, false, [where('key', '==', 'theme'), limit(1)]);

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Apply theme from Firestore if available
    if (settingsData && settingsData.length > 0) {
      setTheme(settingsData[0].value);
    }
  }, [settingsData]);

  // Function to toggle and persist theme
  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    if (db && userId && appId && isAuthReady) {
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/${SETTINGS_COLLECTION}`, 'theme');
      await setDoc(docRef, {
        key: 'theme',
        value: newTheme
      }, {
        merge: true
      }).catch(e => console.error("Failed to save theme setting:", e));
    }
    // No action in mock mode (db is null)
  }, [theme, db, userId, appId, isAuthReady]);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
const useTheme = () => useContext(ThemeContext);


const TaskContext = createContext();

const TaskProvider = ({
  children
}) => {
  const {
    db,
    appId,
    userId,
    isAuthReady
  } = useContext(FirestoreContext);

  // Custom hook to fetch the public tasks collection
  const {
    data: tasks,
    loading: tasksLoading,
    error: tasksError
  } = useFirestoreCollection(TASKS_COLLECTION, true, [ /* No specific constraints for all tasks */ ]);

  // Task CRUD operations
  const addTask = useCallback(async (taskData) => {
    if (!db || !appId || !userId) return console.error("Database not ready for add task. (Mock mode active)");

    const task = {
      ...taskData,
      status: taskData.status || 'To Do',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || null,
      assignedTo: taskData.assignedTo || '',
      tags: taskData.tags || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
      activityLog: [{
        user: userId,
        action: 'Task created',
        timestamp: new Date().toISOString()
      }]
    };

    const colRef = collection(db, `artifacts/${appId}/public/data/${TASKS_COLLECTION}`);
    await addDoc(colRef, task).catch(e => console.error("Error adding task:", e));
  }, [db, appId, userId]);

  const updateTask = useCallback(async (taskId, updateData) => {
    if (!db || !appId || !userId || !taskId) return console.error("Database not ready for update task. (Mock mode active)");
    const docRef = doc(db, `artifacts/${appId}/public/data/${TASKS_COLLECTION}`, taskId);

    // Get current tasks state to determine changes for activity log
    const currentTask = tasks.find(t => t.id === taskId);
    let action = 'Task updated';
    if (updateData.status && currentTask && currentTask.status !== updateData.status) {
      action = `Changed status from '${currentTask.status}' to '${updateData.status}'`;
    } else if (updateData.assignedTo && currentTask && currentTask.assignedTo !== updateData.assignedTo) {
      action = `Assigned task to ${ALL_MEMBERS.find(m => m.id === updateData.assignedTo)?.name || 'Unassigned'}`;
    } else {
       action = `Task updated: ${Object.keys(updateData).join(', ')}`;
    }

    const newLogEntry = {
      user: userId,
      action: action,
      timestamp: new Date().toISOString()
    };
    const updatedActivityLog = [...(currentTask.activityLog || []), newLogEntry];

    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
      activityLog: updatedActivityLog
    }).catch(e => console.error("Error updating task:", e));
  }, [db, appId, userId, tasks]);

  const deleteTask = useCallback(async (taskId) => {
    if (!db || !appId || !taskId) return console.error("Database not ready for delete task. (Mock mode active)");
    console.log(`Confirmation required for deleting task ID: ${taskId}`); // Use console log instead of alert

    const docRef = doc(db, `artifacts/${appId}/public/data/${TASKS_COLLECTION}`, taskId);
    await deleteDoc(docRef).catch(e => console.error("Error deleting task:", e));
    
  }, [db, appId]);

  const value = useMemo(() => ({
    tasks,
    tasksLoading,
    tasksError,
    addTask,
    updateTask,
    deleteTask,
    TEAMS,
    ALL_MEMBERS,
    STATUSES,
    TAGS
  }), [tasks, tasksLoading, tasksError, addTask, updateTask, deleteTask]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
const useTasks = () => useContext(TaskContext);


// --- PRESENTATIONAL COMPONENTS ---

/**
 * Sidebar Component for navigation.
 */
const Sidebar = ({ activePage, setActivePage }) => {
  const { theme, toggleTheme } = useTheme();
  const { userId, handleSignOut } = useContext(FirestoreContext);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
    { name: 'Tasks', icon: ListTodo, page: 'tasks' },
    { name: 'Settings', icon: SettingsIcon, page: 'settings' },
  ];

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center h-16">
        <ListTodo className="w-6 h-6 text-indigo-600 mr-2"/>
        <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">TeamTasker</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 py-4">
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          const activeClasses = isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold shadow-inner'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700';

          return (
            <button
              key={item.page}
              onClick={() => setActivePage(item.page)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors duration-150 ${activeClasses}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer/User Info Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs">
        <p className="mb-2 text-gray-500 dark:text-gray-400">
          <User className="inline h-3 w-3 mr-1"/>
          User ID: {userId ? userId.substring(0, 8) + '...' : 'Guest'}
        </p>
        <button
          onClick={handleSignOut}
          className="w-full text-left text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
        >
          Sign Out
        </button>
        <div className="flex justify-center mt-2">
            <button
                onClick={toggleTheme}
                aria-label={`Toggle to ${theme === 'light' ? 'dark' : 'light'} theme`}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
            >
                {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700"/> : <Sun className="w-5 h-5 text-yellow-400"/>}
            </button>
        </div>
      </div>
    </div>
  );
};


// --- TaskList Component (Based on Task List.png) ---
const TaskList = ({ onOpenTask }) => {
  const { tasks, tasksLoading, tasksError, STATUSES, ALL_MEMBERS, TAGS, TEAMS } = useTasks();
  const [filters, setFilters] = useState({ search: '', team: '', assignee: '', status: '', tag: '' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredTasks = useMemo(() => {
    let list = tasks;
    const lowerSearch = filters.search.toLowerCase();

    list = list.filter(task => {
        // Search filter
        const assigneeName = ALL_MEMBERS.find(m => m.id === task.assignedTo)?.name.toLowerCase() || '';
        const matchesSearch = !lowerSearch ||
            task.title?.toLowerCase().includes(lowerSearch) ||
            task.description?.toLowerCase().includes(lowerSearch) ||
            assigneeName.includes(lowerSearch);

        // Status filter
        const matchesStatus = !filters.status || task.status === filters.status;

        // Assignee filter
        const matchesAssignee = !filters.assignee || task.assignedTo === filters.assignee;

        // Tag filter
        const matchesTag = !filters.tag || (task.tags && task.tags.includes(filters.tag));

        // Team filter (Simplified: filters by members of the selected team)
        const matchesTeam = !filters.team || TEAMS.find(t => t.id === filters.team)?.members.some(m => m.id === task.assignedTo);


        return matchesSearch && matchesStatus && matchesAssignee && matchesTag && matchesTeam;
    });

    // Sort by creation time descending
    return list.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
    });
  }, [tasks, filters, ALL_MEMBERS, TEAMS]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const currentTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  const TaskRow = ({ task }) => {
    const assignee = ALL_MEMBERS.find(m => m.id === task.assignedTo)?.name || 'Unassigned';

    const statusClasses = {
        'To Do': 'bg-red-100 text-red-800 dark:bg-red-800/50 dark:text-red-300',
        'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-300',
        'Done': 'bg-green-100 text-green-800 dark:bg-green-800/50 dark:text-green-300',
        'Blocked': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    }[task.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

    // Mock Priority and Due Date
    const mockPriority = task.priority || (task.id?.charCodeAt(0) % 3 === 0 ? 'High' : (task.id?.charCodeAt(0) % 3 === 1 ? 'Medium' : 'Low'));
    const mockPriorityClasses = {
        'High': 'bg-red-500/10 text-red-700 dark:text-red-400',
        'Medium': 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
        'Low': 'bg-green-500/10 text-green-700 dark:text-green-400',
    }[mockPriority];
    
    // Mock user image/initials
    const ProfilePicture = ({ userId, size = 'h-6 w-6' }) => {
        const charCode = userId ? userId.charCodeAt(0) + userId.charCodeAt(userId.length - 1) : 0;
        const colorIndex = charCode % 5;
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500'];
        const nameInitial = assignee[0] || '?';
        return (
            <div className={`rounded-full ${size} flex items-center justify-center font-bold text-white text-xs ${colors[colorIndex]}`}>
                {nameInitial}
            </div>
        );
    };


    return (
        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
            <td className="p-4 font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer" onClick={() => onOpenTask(task)}>
                {task.title}
            </td>
            <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                 <div className="flex items-center space-x-2">
                    <ProfilePicture userId={task.assignedTo || 'Unassigned'}/>
                    <span>{assignee}</span>
                 </div>
            </td>
            <td className="p-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusClasses}`}>
                    {task.status}
                </span>
            </td>
            <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{task.dueDate || 'N/A'}</td>
            <td className="p-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${mockPriorityClasses}`}>
                    {mockPriority}
                </span>
            </td>
            <td className="p-4">
                <div className="flex flex-wrap gap-1">
                    {(task.tags || []).map(tag => (
                        <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                            {tag}
                        </span>
                    ))}
                </div>
            </td>
            <td className="p-4 text-right">
                <button onClick={() => onOpenTask(task)} className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
            </td>
        </tr>
    );
  };

  if (tasksLoading) return <div className="text-center p-10 dark:text-gray-300">Loading tasks...</div>;
  if (tasksError) return <div className="text-center p-10 text-red-500">Error: {tasksError}</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Task List</h2>
        <button
            onClick={() => onOpenTask({})}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <Plus className="w-5 h-5"/>
            <span>Add New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md border dark:border-gray-700">
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
            <input
                type="text"
                placeholder="Search tasks by title, description, or assignee..."
                value={filters.search}
                name="search"
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
            {/* Team Filter */}
            <select
              name="team"
              value={filters.team}
              onChange={handleFilterChange}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Team: All</option>
              {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            {/* Assignee Filter */}
            <select
              name="assignee"
              value={filters.assignee}
              onChange={handleFilterChange}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Assignee: All</option>
              {ALL_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>

            {/* Status Filter */}
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Status: All</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Tag Filter */}
            <select
              name="tag"
              value={filters.tag}
              onChange={handleFilterChange}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tags: All</option>
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
        <div className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            Tasks ({filteredTasks.length} results)
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Task Title', 'Assignee', 'Status', 'Due Date', 'Priority', 'Tags', 'Actions'].map(header => (
                <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentTasks.length > 0 ? (
                currentTasks.map(task => <TaskRow key={task.id} task={task} />)
            ) : (
                <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No tasks found matching your criteria.
                    </td>
                </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
            Showing {startIndex + 1} to {Math.min(startIndex + tasksPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
          </div>
          <div className="flex space-x-1">
            <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
                Previous
            </button>
            {/* Simplified Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded-lg ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
                Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/**
 * Dashboard Component (Based on Dashboard.png)
 */
const Dashboard = ({ onOpenTask }) => {
    const { tasks, tasksLoading, ALL_MEMBERS } = useTasks();
    const { userId } = useContext(FirestoreContext);

    // Mock Data for Dashboard Summary
    const totalTeams = TEAMS.length;
    const activeMembers = ALL_MEMBERS.length;
    const outstandingTasks = tasks.filter(t => t.status !== 'Done').length;

    // Task Distribution Data (Status)
    const statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {});
    const totalTasks = tasks.length || 1; // Avoid division by zero
    const distributionData = [
        { label: 'To Do', value: statusCounts['To Do'] || 0, color: '#EF4444' }, // Red-500
        { label: 'In Progress', value: statusCounts['In Progress'] || 0, color: '#F59E0B' }, // Amber-500
        { label: 'Done', value: statusCounts['Done'] || 0, color: '#10B981' }, // Green-500
        { label: 'Blocked', value: statusCounts['Blocked'] || 0, color: '#6B7280' }, // Gray-500
    ].filter(d => d.value > 0);

    // Simple Pie Chart Simulation (using SVG)
    const PieChart = () => {
        let cumulativePercent = 0;
        const radius = 50;
        const circumference = 2 * Math.PI * radius;

        return (
            <svg width="100%" height="100%" viewBox="0 0 120 120" className="max-w-[200px] max-h-[200px]">
                {distributionData.map((data, index) => {
                    const percent = data.value / totalTasks;
                    const strokeDasharray = `${percent * circumference}, ${circumference}`;
                    const offset = -cumulativePercent * circumference;
                    cumulativePercent += percent;

                    return (
                        <circle
                            key={index}
                            r={radius}
                            cx="60"
                            cy="60"
                            fill="transparent"
                            stroke={data.color}
                            strokeWidth="20"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={offset}
                            transform="rotate(-90 60 60)"
                        />
                    );
                })}
            </svg>
        );
    };

    // Mock Recent Activity (using the activity log from the latest 5 tasks)
    const recentActivity = tasks
        .flatMap(task => (task.activityLog || []).map(log => ({ ...log, taskId: task.id, taskTitle: task.title })))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .map(activity => {
            const member = ALL_MEMBERS.find(m => m.id === activity.user);
            const userDisplayName = member ? member.name : `User ${activity.user.substring(0, 4)}...`;
            const timeDiffMs = new Date() - new Date(activity.timestamp);
            const timeAgo = timeDiffMs < 3600000 ? `${Math.round(timeDiffMs / 60000)} minutes ago` :
                            timeDiffMs < 86400000 ? `${Math.round(timeDiffMs / 3600000)} hours ago` :
                            formatDate(activity.timestamp);

            let actionText = activity.action;

            return {
                id: activity.timestamp,
                text: `${userDisplayName} ${actionText} on "${activity.taskTitle}"`,
                time: timeAgo,
            };
        });

    // "My Tasks" Table (outstanding tasks assigned to the current user, simulated for top 5)
    const myTasks = tasks
        .filter(t => t.status !== 'Done') // Only outstanding tasks
        .slice(0, 5) // Simplified to top 5
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    const MyTaskRow = ({ task }) => {
        const statusClasses = {
            'To Do': 'bg-red-100 text-red-800 dark:bg-red-800/50 dark:text-red-300',
            'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-300',
            'Done': 'bg-green-100 text-green-800 dark:bg-green-800/50 dark:text-green-300',
            'Blocked': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        }[task.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

        const assignee = ALL_MEMBERS.find(m => m.id === task.assignedTo)?.name || 'You';

        return (
            <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer" onClick={() => onOpenTask(task)}>
                <td className="p-3 text-sm font-medium text-gray-900 dark:text-white w-20">T-{task.id?.substring(0, 3).toUpperCase()}</td>
                <td className="p-3 text-sm text-gray-800 dark:text-gray-200">{task.title}</td>
                <td className="p-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusClasses}`}>
                        {task.status}
                    </span>
                </td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{assignee}</td>
                <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                        {(task.tags || []).slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </td>
            </tr>
        );
    };

    if (tasksLoading) return <div className="text-center p-10 dark:text-gray-300">Loading dashboard data...</div>;

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Dashboard</h2>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <MetricCard title="Total Teams" value={totalTeams} icon={Users} color="bg-indigo-500"/>
                <MetricCard title="Active Members" value={activeMembers} icon={User} color="bg-green-500"/>
                <MetricCard title="Outstanding Tasks" value={outstandingTasks} icon={ListTodo} color="bg-red-500"/>
            </div>

            {/* Distribution & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Task Distribution */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-6 dark:text-white">Task Distribution</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-around space-y-4 sm:space-y-0">
                        <div className="w-36 h-36">
                            <PieChart />
                        </div>
                        <div className="space-y-2">
                            {distributionData.map(d => (
                                <div key={d.label} className="flex items-center space-x-3">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                                    <span className="text-gray-700 dark:text-gray-300">{d.label} ({d.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 dark:text-white">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.map(activity => (
                            <div key={activity.id} className="text-sm border-l-2 border-indigo-400 pl-3">
                                <p className="text-gray-800 dark:text-gray-200 line-clamp-2">{activity.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* My Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto border dark:border-gray-700">
                <div className="p-6">
                    <h3 className="text-xl font-semibold dark:text-white mb-4">My Tasks</h3>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                {['ID', 'Title', 'Status', 'Assignee', 'Tags'].map(header => (
                                    <th key={header} className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {myTasks.map(task => <MyTaskRow key={task.id} task={task} />)}
                            {myTasks.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-500 dark:text-gray-400">
                                        You have no outstanding tasks. Good job!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700 flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color} text-white bg-opacity-90`}>
            <Icon className="w-6 h-6"/>
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);


/**
 * Settings Component (Based on Settings.png)
 */
const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    // Mock states for settings toggles and inputs
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [taskAssignmentAlerts, setTaskAssignmentAlerts] = useState(true);
    const [dailySummaryEmails, setDailySummaryEmails] = useState(false);
    const [appLanguage, setAppLanguage] = useState('English');

    const handleToggle = (setter, currentValue) => {
        setter(!currentValue);
        // In a real app, this would trigger a Firestore update.
        console.log(`Setting toggled: ${setter.name} to ${!currentValue}`);
    };

    const SettingGroup = ({ title, subtitle, children }) => (
        <div className="mb-8 border-b dark:border-gray-700 pb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{subtitle}</p>
            <div className="space-y-6">{children}</div>
        </div>
    );

    const SettingItem = ({ title, subtitle, control, rightAction, border = true }) => (
        <div className={`flex justify-between items-center ${border ? 'pb-4' : ''}`}>
            <div>
                <p className="text-base font-medium text-gray-800 dark:text-gray-200">{title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
            {control && <div className="flex-shrink-0">{control}</div>}
            {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
        </div>
    );

    const ToggleSwitch = ({ checked, onChange }) => (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
        </label>
    );

    return (
        <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Settings</h2>

            {/* Appearance */}
            <SettingGroup title="Appearance" subtitle="Customize the look and feel of your workspace.">
                <SettingItem
                    title="Theme"
                    subtitle={`Choose between light and dark modes for the application interface. Current: ${theme === 'light' ? 'Light' : 'Dark'}`}
                    control={<ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />}
                />
            </SettingGroup>

            {/* Account Preferences */}
            <SettingGroup title="Account Preferences" subtitle="Manage your personal account details.">
                <SettingItem
                    title="Email Address"
                    subtitle="Update your primary contact email."
                    rightAction={<button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Edit</button>}
                />
                <SettingItem
                    title="Password"
                    subtitle="Change your account password."
                    rightAction={<button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Change</button>}
                />
                <SettingItem
                    title="Profile Visibility"
                    subtitle="Control who can see your profile information."
                    control={<ToggleSwitch checked={profileVisibility} onChange={() => handleToggle(setProfileVisibility, profileVisibility)} />}
                />
            </SettingGroup>

            {/* Notification Settings */}
            <SettingGroup title="Notification Settings" subtitle="Configure how you receive alerts and updates.">
                <SettingItem
                    title="Task Assignment Alerts"
                    subtitle="Receive notifications when you are assigned a new task."
                    control={<ToggleSwitch checked={taskAssignmentAlerts} onChange={() => handleToggle(setTaskAssignmentAlerts, taskAssignmentAlerts)} />}
                />
                <SettingItem
                    title="Daily Summary Emails"
                    subtitle="Get a summary of your tasks delivered to your inbox daily."
                    control={<ToggleSwitch checked={dailySummaryEmails} onChange={() => handleToggle(setDailySummaryEmails, dailySummaryEmails)} />}
                />
            </SettingGroup>

            {/* Language & Region */}
            <SettingGroup title="Language & Region" subtitle="Set your preferred language and regional format.">
                <SettingItem
                    title="App Language"
                    subtitle="Select the language for the application interface."
                    rightAction={
                        <select
                            value={appLanguage}
                            onChange={(e) => setAppLanguage(e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    }
                    border={false}
                />
            </SettingGroup>
        </div>
    );
};


/**
 * TaskDetailModal (Refined based on Task Detail.png)
 */
const TaskDetailModal = ({ task, onClose }) => {
    const { updateTask, deleteTask, STATUSES, ALL_MEMBERS, TAGS, addTask } = useTasks();
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: '',
      assignedTo: '',
      tags: [],
      ...task
    });

    useEffect(() => {
        setFormData({
          title: '',
          description: '',
          status: 'In Progress',
          priority: 'Medium',
          dueDate: '',
          assignedTo: '',
          tags: [],
          ...task
        });
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (tag) => {
        setFormData(prev => {
          const currentTags = prev.tags || [];
          if (currentTags.includes(tag)) {
            return { ...prev, tags: currentTags.filter(t => t !== tag) };
          } else {
            return { ...prev, tags: [...currentTags, tag] };
          }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id, activityLog, ...dataToSave } = formData;

        if (id) {
            await updateTask(id, dataToSave);
        } else {
            await addTask(dataToSave);
        }
        onClose();
    };

    const handleDelete = () => {
        if (task.id) {
            deleteTask(task.id);
            onClose();
        }
    };

    const isNew = !task.id;
    const activityLog = task.activityLog || [];
    const assignedMember = ALL_MEMBERS.find(m => m.id === formData.assignedTo)?.name || 'Unassigned';

    // Mock Profile Picture Component
    const ProfilePicture = ({ userId, size = 'h-8 w-8' }) => {
        const charCode = userId ? userId.charCodeAt(0) + userId.charCodeAt(userId.length - 1) : 0;
        const colorIndex = charCode % 5;
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500'];
        const nameInitial = userId ? (ALL_MEMBERS.find(m => m.id === userId)?.name[0] || userId[0]).toUpperCase() : '?';
        return (
            <div className={`rounded-full ${size} flex items-center justify-center font-bold text-white ${colors[colorIndex]}`}>
                {nameInitial}
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 dark:bg-opacity-80 transition-opacity"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={onClose}
        >
            <div className="flex items-center justify-center min-h-screen p-4">
                {/* Modal Content */}
                <div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all"
                    onClick={e => e.stopPropagation()} // Prevent close on content click
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {isNew ? 'Create New Task' : 'Task Details'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">View and edit task information, and track its activity.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                aria-label="Close modal"
                            >
                                <X className="w-6 h-6"/>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column (Form) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Title</label>
                                    <input
                                      type="text"
                                      name="title"
                                      value={formData.title || ''}
                                      onChange={handleChange}
                                      required
                                      placeholder="e.g., Implement user authentication"
                                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                    <textarea
                                      name="description"
                                      rows="4"
                                      value={formData.description || ''}
                                      onChange={handleChange}
                                      placeholder="Detailed steps and requirements..."
                                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Status, Priority, Due Date Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Status */}
                                    <div className="space-y-1">
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500">
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    {/* Priority */}
                                    <div className="space-y-1">
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                                        <select name="priority" id="priority" value={formData.priority || 'Medium'} onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500">
                                            {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    {/* Due Date */}
                                    <div className="space-y-1 col-span-2">
                                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                                        <input type="date" name="dueDate" id="dueDate" value={formData.dueDate || ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>


                                {/* Assigned To (Simplified to one assignee based on logic) */}
                                <div className="space-y-1">
                                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</label>
                                    <div className="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                                        {formData.assignedTo && (
                                            <div className="flex items-center space-x-2 pr-3 border-r dark:border-gray-600">
                                                <ProfilePicture userId={formData.assignedTo} />
                                                <span className="text-sm font-medium dark:text-white">{assignedMember}</span>
                                            </div>
                                        )}
                                        <select name="assignedTo" id="assignedTo" value={formData.assignedTo || ''} onChange={handleChange} className="bg-transparent border-none focus:ring-0 text-sm dark:text-gray-300 p-0">
                                            <option value="">Add assignee...</option>
                                            {ALL_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Tags Selector */}
                                <div className="space-y-1">
                                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</span>
                                    <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                                        {(formData.tags || []).map(tag => (
                                          <div key={tag} className="flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-700/30 dark:text-indigo-300">
                                            <Tag className="w-3 h-3"/>
                                            <span>{tag}</span>
                                            <button type="button" onClick={() => handleTagChange(tag)} aria-label={`Remove tag ${tag}`}>
                                                <X className="w-3 h-3 hover:text-indigo-900 dark:hover:text-indigo-100"/>
                                            </button>
                                          </div>
                                        ))}
                                        {/* Mock tag adding input (using select for simplicity) */}
                                        <select
                                            onChange={(e) => { if(e.target.value) handleTagChange(e.target.value); e.target.value = ''; }}
                                            className="bg-transparent border-none focus:ring-0 text-sm dark:text-gray-300 p-0"
                                            value=""
                                        >
                                            <option value="">Add tag...</option>
                                            {TAGS.filter(t => !(formData.tags || []).includes(t)).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Activity Log) */}
                            <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 pt-6 lg:pt-0 lg:pl-6">
                                <h3 className="text-xl font-semibold mb-4 dark:text-white">Activity Log</h3>
                                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                                    {activityLog.length > 0 ? (
                                        activityLog.slice().reverse().map((log, index) => (
                                            <div key={index} className="flex space-x-3 text-sm">
                                                <ProfilePicture userId={log.user} size="h-8 w-8"/>
                                                <div className="flex-1">
                                                    <p className="font-medium dark:text-gray-100">
                                                        {ALL_MEMBERS.find(m => m.id === log.user)?.name || `User ${log.user.substring(0, 4)}...`}
                                                        <span className="font-normal text-gray-500 dark:text-gray-400 text-xs ml-2">
                                                            {formatDate(log.timestamp)}
                                                        </span>
                                                    </p>
                                                    <p className="text-gray-700 dark:text-gray-300">{log.action}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet. Be the first!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-150 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                            >
                                Cancel
                            </button>
                            {!isNew && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-150"
                                >
                                    Delete Task
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-150"
                            >
                                {isNew ? 'Create Task' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
function App() {
  const { theme } = useTheme();
  // Get the new bypass function from context
  const { userId, isAuthReady, handleSignOut, handleLocalSignInBypass } = useContext(FirestoreContext); 
  const [activePage, setActivePage] = useState('dashboard');
  const [modalTask, setModalTask] = useState(null);

  // 🚨 MODIFIED LOGIN SCREEN FOR LOCAL BYPASS 🚨
  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const { handleSignOut, handleLocalSignInBypass } = useContext(FirestoreContext);
    
    // Function to handle the local login/signup bypass
    const onSubmitLocalBypass = (e) => {
        e.preventDefault();
        setError(null);
        
        // MOCK LOGIN LOGIC: Check if email is non-empty to proceed
        if (!email) {
            return setError('Please enter a username or email to proceed (local bypass).');
        }
        
        // Call the mock function to set a local user ID
        handleLocalSignInBypass(email); 
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-sm text-center border dark:border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <ListTodo className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-2"/>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TeamTasker (Dev Bypass)</h1>
                </div>

                {error && (
                    <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/50 dark:text-red-300">
                        {error}
                    </div>
                )}
                
                <h2 className="text-xl font-semibold mb-6 dark:text-white">Enter any details for local access</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">Email (Required for bypass)</label>
                        <input 
                            type="email" 
                            placeholder="any@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm p-3" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">Password (Not checked)</label>
                        <input type="password" placeholder="••••••••••" className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm p-3" />
                        <button type="button" className="mt-1 text-right w-full text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</button>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-150"
                        onClick={onSubmitLocalBypass} // Use the bypass function for Sign In
                    >
                        Sign In (Local Access)
                    </button>
                </form>
                <p className="text-sm mt-4 dark:text-gray-400">
                    Don't have an account?
                    <button 
                        className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1" 
                        onClick={onSubmitLocalBypass} // Use the bypass function for Sign Up
                    >
                        Sign Up (Local Access)
                    </button>
                </p>
                <button
                  onClick={handleSignOut}
                  className="mt-6 text-sm text-red-500 hover:underline"
                >
                  Sign Out / Reset Session
                </button>
            </div>
        </div>
    );
  };
  // 🚨 END OF MODIFIED LOGIN SCREEN 🚨

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onOpenTask={setModalTask} />;
      case 'tasks':
        return <TaskList onOpenTask={setModalTask} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onOpenTask={setModalTask} />;
    }
  };

  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen text-xl dark:bg-gray-900 dark:text-white">Connecting to TeamTasker...</div>;
  }

  // The application structure now uses a Sidebar and a main content area
  return (
    <div className={`${theme} min-h-screen font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      {userId ? (
        <div className="flex">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
          <main className="flex-1 overflow-x-hidden">
            {renderContent()}
          </main>
          {/* Task Detail Modal is rendered globally */}
          {modalTask && <TaskDetailModal task={modalTask} onClose={() => setModalTask(null)} />}
        </div>
      ) : (
        <LoginScreen />
      )}
    </div>
  );
}

// Wrapping App with all Contexts and the Firebase Provider
const Root = () => (
  <FirebaseProvider>
    <ThemeProvider>
      <TaskProvider>
        <App />
      </TaskProvider>
    </ThemeProvider>
  </FirebaseProvider>
);

export default Root;