import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from "react-router-dom";

const JobDetailsTechnican = () => {
    const [job, setJob] = useState(null);
    const [supportRequest, setSupportRequest] = useState(null);
    const [error, setError] = useState(null);
    const [technicianId, setTechnicianId] = useState(null);
    const { jobId } = useParams(); // Retrieve jobId from the route parameter

    useEffect(() => {
        // Fetch technicianId from local storage
        const storedTechnicianId = localStorage.getItem('technicianId');
        if (storedTechnicianId) {
            setTechnicianId(storedTechnicianId);
        } else {
            console.error("Technician ID is not available in local storage.");
            setError("Technician ID is not available.");
        }
    }, []);

    useEffect(() => {
        if (technicianId && jobId) {
            const fetchJobDetails = async () => {
                try {
                    console.log(`Fetching job details for technician: ${technicianId}`);
                    // Fetch job details
                    const jobResponse = await axios.get(`https://localhost:7121/api/Technicians/${technicianId}/jobs`);
                    const jobDetails = jobResponse.data.find(job => job.jobId === parseInt(jobId)); // Filter job by jobId
                    setJob(jobDetails);
                    console.log("Job Details:", jobDetails);

                    // Fetch support request details using the supportRequestId
                    if (jobDetails && jobDetails.supportRequestId) {
                        const supportResponse = await axios.get(`https://localhost:7121/api/Support/${jobDetails.supportRequestId}`);
                        setSupportRequest(supportResponse.data);
                        console.log("Support Request Details:", supportResponse.data);
                    }
                } catch (error) {
                    setError("Error fetching job details");
                    console.error("Error fetching job details:", error);
                }
            };

            fetchJobDetails();
        }
    }, [technicianId, jobId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!job || !supportRequest) {
        return <div>Loading...</div>;
    }
    return (<div className="container mt-4">
        <h2>Job Details</h2>
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Job ID: {job.jobId}</h5>
                <p className="card-text">Scheduled Date: {new Date(job.scheduledDate).toLocaleDateString()}</p>
                <p className="card-text">Technician: {job.technician}</p>
                <p className="card-text">Priority: {job.priority === 1 ? 'High' : job.priority === 2 ? 'Medium' : 'Low'}</p>
            </div>
        </div>
        <h3>Support Request Details</h3>
        <div className="card mb-4">
            <div className="card-body">
                <p className="card-text">Support Request ID: {supportRequest.supportRequestId}</p>
                <p className="card-text">Customer ID: {supportRequest.customerId}</p>
                <p className="card-text">Issue Description: {supportRequest.issueDescription}</p>
                <p className="card-text">Location: {supportRequest.location || "Not specified"}</p>
                <p className="card-text">Created At: {new Date(supportRequest.createdAt).toLocaleString()}</p>
                <p className="card-text">Completion Date: {supportRequest.completionDate ? new Date(supportRequest.completionDate).toLocaleString() : "Not completed"}</p>
                <p className="card-text">Quote: {supportRequest.quote ? `$${supportRequest.quote}` : "Not provided"}</p>
                <p className="card-text">Status: {supportRequest.status}</p>
            </div>
        </div>
    </div>
);
};

export default JobDetailsTechnican;