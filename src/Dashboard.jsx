import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Dashboard({ user, logout }) {
  const [issues, setIssues] = useState([]);
  
  // === FORM STATES ===
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Low');
  const [assignee, setAssignee] = useState(''); 
  
  const [filter, setFilter] = useState('All');

  // FETCH ISSUES (Real-time)
  useEffect(() => {
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const issuesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIssues(issuesData);
    });
    return () => unsubscribe();
  }, []);

  //  CREATE ISSUE
  const handleAddIssue = async (e) => {
    e.preventDefault();
    if (!title) return;

    //  Similar Issue Detection
    const similar = issues.find(i => i.title.toLowerCase().includes(title.toLowerCase()));
    if (similar) {
      if (!window.confirm(`Found a similar issue: "${similar.title}". Create anyway?`)) return;
    }

    try {
      await addDoc(collection(db, "issues"), {
        title: title,
        desc: desc,
        priority: priority,
        status: 'Open',
        assignedTo: assignee, // Uses the input field value
        createdBy: user.email,
        createdAt: new Date().toISOString()
      });
      
      toast.success("Issue Created!");
      
      // Reset Form
      setTitle('');
      setDesc('');
      setPriority('Low');
      setAssignee(''); // Reset assignee back to self
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to add issue");
    }
  };

  //  UPDATE STATUS OF ISSUE
  const updateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Open' ? 'InProgress' : currentStatus === 'InProgress' ? 'Done' : 'Open';
    
    //  Status Rule (Extra safety check)
    if (currentStatus === 'Open' && nextStatus === 'Done') {
      toast.error("Rule: Cannot move directly from Open to Done!");
      return;
    }

    const issueRef = doc(db, "issues", id);
    await updateDoc(issueRef, { status: nextStatus });
  };

  //  DELETE ISSUE
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await deleteDoc(doc(db, "issues", id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete");
    }
  }

  //  FILTER LOGIC
  const filteredIssues = issues.filter(issue => {
    if (filter === 'All') return true;
    return issue.status === filter || issue.priority === filter;
  });

  return (
    <div>
      {/* HEADER */}
      <div className="header">
        <h2>📌 Smart Issue Board</h2>
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
          <span style={{color: '#64748b', fontSize: '14px'}}>Logged in as: <b>{user.email}</b></span>
          <button onClick={logout} className="btn btn-outline">Log Out</button>
        </div>
      </div>

      {/* CREATE FORM */}
      <div className="card" style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
        <h3 style={{marginTop:0}}>Create New Issue</h3>
        <form onSubmit={handleAddIssue} style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
          
          {/* Title */}
          <input 
            className="input-field" 
            style={{flex: 2, minWidth: '200px'}} 
            placeholder="Issue Title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
          
          {/* Description */}
          <input 
            className="input-field" 
            style={{flex: 3, minWidth: '200px'}} 
            placeholder="Description" 
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
            required
          />
          
          {/* Assigned To (NEW) */}
          <input 
            className="input-field" 
            style={{flex: 1, minWidth: '150px'}} 
            placeholder="Assign To" 
            value={assignee} 
            onChange={e => setAssignee(e.target.value)} 
            required
          />

          {/* Priority */}
          <select 
            className="input-field" 
            style={{flex: 1, minWidth: '120px'}}
            value={priority} 
            onChange={e => setPriority(e.target.value)}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium</option>
            <option value="High">High Priority</option>
          </select>

          <button className="btn btn-primary" type="submit">Add Issue</button>
        </form>
      </div>

      {/* FILTERS */}
      <div style={{marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
        {/* Update this list to include ALL priorities */}
        {['All', 'Open', 'InProgress', 'Done', 'High', 'Medium', 'Low'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            style={{fontSize: '12px', padding: '5px 15px'}}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ISSUE GRID */}
      <div className="issue-grid">
        {filteredIssues.map(issue => (
          <div key={issue.id} className="issue-card" style={{position: 'relative'}}>
            
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
              <span className={`badge priority-${issue.priority}`}>{issue.priority}</span>
              <span 
                className={`badge status-${issue.status}`} 
                style={{cursor:'pointer'}}
                onClick={() => updateStatus(issue.id, issue.status)}
                title="Click to advance status"
              >
                {issue.status} ↻
              </span>
            </div>

            <h3 style={{margin: '0 0 10px 0', paddingRight: '20px'}}>{issue.title}</h3>
            <p style={{color: '#64748b', fontSize: '14px', marginBottom: '20px'}}>{issue.desc}</p>
            
            <div style={{marginTop: 'auto', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <span style={{color: '#475569', fontWeight: '600'}}>👤 {issue.assignedTo}</span> <br/>
                <span style={{fontSize: '11px'}}>{new Date(issue.createdAt).toLocaleString()}</span>
              </div>

              {/* DELETE BUTTON */}
              <button 
                onClick={() => handleDelete(issue.id)}
                style={{background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold', fontSize: '12px'}}
                title="Delete Issue"
              >
                🗑 Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}