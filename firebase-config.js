// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

// Report data management
class ReportManager {
  constructor() {
    this.reportsCollection = 'reports';
  }

  // Add a new report
  async addReport(reportData) {
    try {
      const docRef = await addDoc(collection(db, this.reportsCollection), {
        ...reportData,
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

  // Get all reports
  async getAllReports() {
    try {
      const q = query(collection(db, this.reportsCollection), orderBy('createdAt', 'desc'));
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
      console.error('Error getting reports: ', error);
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

  // Delete a report
  async deleteReport(reportId) {
    try {
      await deleteDoc(doc(db, this.reportsCollection, reportId));
      console.log('Report deleted');
    } catch (error) {
      console.error('Error deleting report: ', error);
      throw error;
    }
  }
}

// Create and export instance
window.reportManager = new ReportManager();