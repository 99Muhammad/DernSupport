import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Input, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const login = await axios.post("https://localhost:7121/api/Account/login", {
        email: values.email, // Change to email
        password: values.password,
      });

      const token = login.data.token;
      const myDecodedToken = decodeToken(token);

      if (myDecodedToken) {
        const role = myDecodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log('Role from Token:', role); // Log role
        localStorage.setItem('role', role);
        localStorage.setItem('account', JSON.stringify(login.data));

        if (role === 'Technician') {
          const technicianId = myDecodedToken["Id"];
          localStorage.setItem('technicianId', technicianId);
          console.log('Technician ID set:', technicianId); // Check the value

          // Refresh the page
          navigate('/'); // Redirect to the home page
          window.location.reload();
        } else if (role === 'User') {
          // Handle User role
          window.location.reload(); // Refresh the page
        } else if (role === 'Admin') {
          // Handle Admin role
          window.location.reload(); // Refresh the page
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You are not authorized to access this page.',
            color: 'red',
            width: 400,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Token Decoding Error",
          text: "Unable to decode the token.",
          color: "red",
          width: 400,
        });
      }
    } catch (e) {
      console.error("Login error:", e);
      Swal.fire({
        icon: "error",
        title: "Invalid Credentials",
        text: "Please check your email or password.",
        color: "red",
        width: 400,
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={styles.form}
        >
          <Form.Item
            label="Email"
            name="email" // Update field name
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={styles.submitButton}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>

        {/* Uncomment if signup link is needed */}
        <div style={styles.signupLink}>
          Don't have an account? <Link to="/signup">Signup</Link>
        </div>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    justifyContent: "center",
    background: "radial-gradient(circle, rgba(163,163,163,1) 100%, rgba(230,230,230,1) 100%)",
  },
  card: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  submitButton: {
    alignSelf: "center",
  },
};

export default Login;