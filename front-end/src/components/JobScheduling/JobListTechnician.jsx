import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const JobListTechnician = ({ technicianId }) => {
	const [jobs, setJobs] = useState([]);
	const [error, setError] = useState(null);

	const fetchJobs = async (technicianId) => {
		try {
			const response = await axios.get(`https://localhost:7121/api/Technicians/${technicianId}/jobs`);
			console.log("Response data:", response.data);
			setJobs(response.data);
		} catch (error) {
			setError("Error fetching jobs");
			console.error("Error fetching jobs:", error);
		}
	};

	useEffect(() => {
		if (technicianId) {
			fetchJobs(technicianId);
		}
	}, [technicianId]);

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div className="container mt-4">
			<div className="row">
				{jobs.map((job) => (
					<div key={job.jobId} className="col-md-4 mb-4">
						<div className="card">
							<div className="card-body">
								<h5 className="card-title">Job ID: {job.jobId}</h5>
								<p className="card-text">Support Request ID: {job.supportRequestId}</p>
								<p className="card-text">
									Scheduled Date: {new Date(job.scheduledDate).toLocaleDateString()}
								</p>
								<p className="card-text">Technician: {job.technician}</p>
								<p className="card-text">Priority: {job.priority === 1 ? 'High' : job.priority === 2 ? 'Medium' : 'Low'}</p>
								<Link to={`/job-details/${job.jobId}`} className="btn btn-primary">View Details</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default JobListTechnician;