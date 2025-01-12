import React, { useState, useEffect } from 'react'; // Importing React and hooks
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SupportRequestList from './components/SupportRequestManagement/SupportRequestList';
import KnowledgeBaseList from './components/KnowledgeBase/KnowledgeBaseList';
import InventoryList from './components/InventoryManagement/InventoryList';
import InventoryDetails from './components/InventoryManagement/InventoryDetails';
import InventoryEdit from './components/InventoryManagement/InventoryEdit';
import JobDetails from './components/JobScheduling/JobDetails';
import JobDetailsTechnician from './components/JobScheduling/JobDetailsTechnican';
import Login from './components/Auth/login';
import Signup from './components/Auth/signup';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import AppHeader from './components/Header/Header';
import SupportRequestForm from './components/SupportRequestManagement/SupportRequestForm';
import KnowledgeBaseArticle from './components/KnowledgeBase/KnowledgeBaseArticle';
import KnowledgeBaseArticleEdit from './components/KnowledgeBase/KnowledgeBaseArticleEdit';
import CustomerList from './components/CustomerManagement/CustomerList';
import TechnicianList from './components/Technician/TechniciansList';
import FeedBackList from './components/FeedBack/FeedBacksList';
import FeedBackDetails from './components/FeedBack/FeedBackDetails';
import FeedBackEdit from './components/FeedBack/FeedBackEdit';
import JobList from './components/JobScheduling/JobList';
import JobListTechnician from './components/JobScheduling/JobListTechnician';
import JobEdit from './components/JobScheduling/JobEdit';
import DataAnalytics from './components/DataAnalytics/AnalyticsDashboard';
import CustomerDetails from './components/CustomerManagement/CustomerDetails';
import EditCustomer from './components/CustomerManagement/EditCustomer';
import TechnicianDetails from './components/Technician/TechnicianDetails';
import TechnicianEdit from './components/Technician/TechnicianEdit';
import TechnicianCreate from './components/Technician/TechnicianForm';
import SupportRequestDetails from './components/SupportRequestManagement/SupportRequestDetails';
import SupportRequestEdit from './components/SupportRequestManagement/SupportRequestEdit';
import AssignToTechnician from './components/SupportRequestManagement/AssignToTechnician';
import InventoryForm from './components/InventoryManagement/InventoryForm';
import CreateKnowledgeBaseArticle from './components/KnowledgeBase/KnowledgeBaseArticleForm';
import KnowledgeBaseArticleCustomer from './components/KnowledgeBase/KnowledgeBaseArticleCustomer';
import KnowledgeBaseListCustomer from './components/KnowledgeBase/KnowledgeBaseListCustomer';


function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState();
  const [technicianId, setTechnicianId] = useState(null);

  useEffect(() => {
    const localAccount = localStorage.getItem('account');
    const localRole = localStorage.getItem('role');
    const localTechnicianId = localStorage.getItem('technicianId');

    setLoggedIn(!!localAccount);
    setRole(localRole || '');
    setTechnicianId(localRole === 'Technician' ? localTechnicianId : null);
  }, []);
  return (
    <div>
    <Router>
      <AppHeader/>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        {isLoggedIn ? (
          <>
            {role === "User" ? (
              <>
              <Route path="/CreateKnowledgeBaseArticle" element={<CreateKnowledgeBaseArticle />} />
              <Route path="/support-request-management" element = {<SupportRequestForm/>}/>
              <Route path="/knowledge-base" element={<KnowledgeBaseListCustomer />} />
              <Route path="/article/:id" element={<KnowledgeBaseArticleCustomer />} />

            </>

            ) : null}
            {role === "Admin" ? (
              <>
              <Route path="/customer-management" element = {<CustomerList/>}/>
              <Route path="/customer-management/:customerId" element = {<CustomerDetails/>}/>
              <Route path="/customer-management/edit/:customerId" element={<EditCustomer />} />
              <Route path="/Technician-management" element = {<TechnicianList/>}/>
              <Route path="/Technician-management/:technicianId" element = {<TechnicianDetails/>}/>
              <Route path="/Technician-management/edit/:technicianId" element={<TechnicianEdit />} />
              <Route path="/Technician-management/create" element={<TechnicianCreate />} />
              <Route path="/support-request-management" element={<SupportRequestList userRole={role} />} />
              <Route path="/support-request-management/:supportRequestId" element={<SupportRequestDetails />} />
              <Route path="/support-request-management/edit/:supportRequestId" element={<SupportRequestEdit />} />
              <Route path="/assign-to-technician/:supportRequestId" element={<AssignToTechnician />} />
              <Route path="/Feedback-management" element={<FeedBackList />} />
              <Route path="/Feedback-management/:feedbackId" element={<FeedBackDetails />} />
              <Route path="/Feedback-management/edit/:feedbackId" element={<FeedBackEdit />} />
              <Route path="/Job-management" element={<JobList />} />
              <Route path="/Job-management/:jobId" element={<JobDetails />} />
              <Route path="/Job-management/edit/:jobId" element={<JobEdit />} />
              <Route path="/inventory-management" element={<InventoryList />} />
              <Route path="/inventory-management/:inventoryId" element={<InventoryDetails />} />
              <Route path="/inventory-management/edit/:inventoryId" element={<InventoryEdit />} />
              <Route path="/inventory-management/create" element={<InventoryForm />} />
              <Route path="/Knowledgebase-management" element={<KnowledgeBaseList />} />
              <Route path="/article/:id" element={<KnowledgeBaseArticle />} />
              <Route path="/article/edit/:id" element={<KnowledgeBaseArticleEdit />} />
              <Route path="/data-analytics" element={<DataAnalytics />} />
              </>
            ) : null}
            {role === "Technician"}
            <>
            <Route path="/job-list" element={<JobListTechnician technicianId={technicianId} />} />
            <Route path="/job-details/:jobId" element={<JobDetailsTechnician />} />
            <Route path="/knowledge-base" element={<KnowledgeBaseListCustomer />} />
            <Route path="/article/:id" element={<KnowledgeBaseArticleCustomer />} />
            <Route path="/CreateKnowledgeBaseArticle" element={<CreateKnowledgeBaseArticle />} />
            </>
          </>
        ) 
        
        
        : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
      </Routes>
      <Footer/>
    </Router>
  </div>
  );
}

export default App;
