// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy, where, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "{{FIREBASE_API_KEY}}",
  authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
  projectId: "{{FIREBASE_PROJECT_ID}}",
  storageBucket: "{{FIREBASE_STORAGE_BUCKET}}",
  messagingSenderId: "{{FIREBASE_MESSAGING_SENDER_ID}}",
  appId: "{{FIREBASE_APP_ID}}"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// User authentication and management
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.usersCollection = 'users';
    this.authStateReady = false;
    this.authPromiseResolved = false;
    this.authStatePromise = this.setupAuthListener();
  }

  // Set up authentication state listener
  setupAuthListener() {
    return new Promise((resolve) => {
      this.authStateReady = false;
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        this.authStateReady = true;
        if (user) {
          console.log('User signed in:', user.email);
        } else {
          console.log('User signed out');
        }
        if (!this.authPromiseResolved) {
          this.authPromiseResolved = true;
          resolve(user);
        }
      });
    });
  }

  // Register new user
  async register(userData) {
    try {
      const { email, password, name, phone, aadharCard } = userData;
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, this.usersCollection, user.uid), {
        name: name,
        email: email,
        phone: phone,
        aadharCard: this.maskSensitiveData(aadharCard),
        profileVisible: true, // Default to visible
        profilePicture: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('User registered successfully:', user.uid);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user data
  async getCurrentUserData() {
    if (!this.currentUser) return null;
    
    try {
      const userDoc = await getDoc(doc(db, this.usersCollection, this.currentUser.uid));
      if (userDoc.exists()) {
        return { id: this.currentUser.uid, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData) {
    if (!this.currentUser) throw new Error('No authenticated user');
    
    try {
      await updateDoc(doc(db, this.usersCollection, this.currentUser.uid), {
        ...userData,
        updatedAt: new Date()
      });
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      if (userDoc.exists()) {
        return { id: userId, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Get current user ID
  getCurrentUserId() {
    return this.currentUser ? this.currentUser.uid : null;
  }

  // Wait for auth state to be ready
  async waitForAuthState() {
    return this.authStatePromise;
  }

  // Mask sensitive data for security
  maskSensitiveData(data) {
    if (!data || data.length < 4) return '****';
    return '****-****-' + data.slice(-4);
  }

  // Security guard: ensure user is authenticated before proceeding
  async requireAuth() {
    await this.waitForAuthState();
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }
    return this.currentUser;
  }
}

// Enhanced Report Manager with user integration
class ReportManager {
  constructor() {
    this.reportsCollection = 'reports';
  }

  // Add a new report (with user info)
  async addReport(reportData) {
    try {
      const userId = window.authManager.getCurrentUserId();
      if (!userId) throw new Error('User must be logged in to create reports');

      const docRef = await addDoc(collection(db, this.reportsCollection), {
        ...reportData,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Report added with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding report: ', error);
      throw error;
    }
  }

  // Get all reports (for home feed)
  async getAllReports() {
    try {
      const q = query(
        collection(db, this.reportsCollection), 
        orderBy('immediateHelp', 'desc'),
        orderBy('likes', 'desc'),
        orderBy('shares', 'desc'),
        orderBy('bookmarks', 'desc'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const reports = [];
      
      for (const reportDoc of querySnapshot.docs) {
        const reportData = { id: reportDoc.id, ...reportDoc.data() };
        
        // Get user data for each report
        if (reportData.userId) {
          const userData = await window.authManager.getUserById(reportData.userId);
          reportData.user = userData;
        }
        
        reports.push(reportData);
      }
      
      return reports;
    } catch (error) {
      console.error('Error getting reports: ', error);
      throw error;
    }
  }

  // Get current user's reports only
  async getCurrentUserReports() {
    try {
      const userId = window.authManager.getCurrentUserId();
      if (!userId) return [];

      const q = query(
        collection(db, this.reportsCollection), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return reports;
    } catch (error) {
      console.error('Error getting user reports: ', error);
      throw error;
    }
  }

  // Update report engagement (likes, shares, bookmarks)
  async updateEngagement(reportId, type) {
    try {
      const reportRef = doc(db, this.reportsCollection, reportId);
      const reportDoc = await getDoc(reportRef);
      
      if (reportDoc.exists()) {
        const currentValue = reportDoc.data()[type] || 0;
        await updateDoc(reportRef, {
          [type]: currentValue + 1,
          updatedAt: new Date()
        });
        console.log(`${type} updated for report ${reportId}`);
      }
    } catch (error) {
      console.error(`Error updating ${type}: `, error);
      throw error;
    }
  }

  // Update report status
  async updateReportStatus(reportId, status) {
    try {
      const reportRef = doc(db, this.reportsCollection, reportId);
      await updateDoc(reportRef, {
        status: status,
        updatedAt: new Date()
      });
      console.log('Report status updated');
    } catch (error) {
      console.error('Error updating report: ', error);
      throw error;
    }
  }

  // Delete a report (only by owner)
  async deleteReport(reportId) {
    try {
      const userId = window.authManager.getCurrentUserId();
      if (!userId) throw new Error('User must be logged in');

      // Check if user owns this report
      const reportDoc = await getDoc(doc(db, this.reportsCollection, reportId));
      if (!reportDoc.exists()) throw new Error('Report not found');
      
      const reportData = reportDoc.data();
      if (reportData.userId !== userId) {
        throw new Error('You can only delete your own reports');
      }

      await deleteDoc(doc(db, this.reportsCollection, reportId));
      console.log('Report deleted');
    } catch (error) {
      console.error('Error deleting report: ', error);
      throw error;
    }
  }
}

// Create and export instances
window.authManager = new AuthManager();
window.reportManager = new ReportManager();