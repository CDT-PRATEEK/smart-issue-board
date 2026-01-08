// src/Login.jsx
import { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created! Welcome.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      toast.error(error.message); // Show error if password is too short or email exists
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
      <p style={{color: '#64748b', marginBottom: '20px'}}>
        {isSignUp ? "Sign up to track your issues" : "Log in to manage your board"}
      </p>
      
      <form onSubmit={handleAuth}>
        <input 
          className="input-field"
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          className="input-field"
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} type="submit">
          {isSignUp ? "Sign Up" : "Log In"}
        </button>
      </form>

      <p style={{marginTop: '20px', fontSize: '14px'}}>
        {isSignUp ? "Already have an account? " : "No account yet? "}
        <span 
          style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold'}}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Log In" : "Sign Up"}
        </span>
      </p>
    </div>
  );
}