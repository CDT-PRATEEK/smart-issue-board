
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';
import Login from './Login';
import Dashboard from './Dashboard'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase: Are we logged in?
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

  return (
    <>
      <Toaster position="top-right" />
      {user ? (
        <Dashboard user={user} logout={() => signOut(auth)} />
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;