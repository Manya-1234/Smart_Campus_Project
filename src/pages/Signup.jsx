import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./Auth.css";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollno, setRollNo] = useState("");
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!name || !email || !password || !rollno || !course || !year) {
      alert("Please fill all required fields.");
      return;
    }

    if (
      (course === "BTech" || course === "MTech") &&
      !department
    ) {
      alert("Please select your department.");
      return;
    }

    try {
      setSubmitting(true);

      await signup({
        name,
        course,
        department,
        year,
        rollno,
        email,
        password,
      });

      navigate("/home", { replace: true });
    } catch (error) {
      if (
        error.message?.toLowerCase().includes("already exists")
      ) {
        alert("Account already exists. Please login.");
        navigate("/login", { replace: true });
      } else {
        alert(error.message || "Signup failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h2>Create Account</h2>

      <form onSubmit={handleSignup}>
        <input
          className="auth-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="auth-input"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          <option value="BTech">B.Tech</option>
          <option value="MTech">M.Tech</option>
          <option value="MBA">MBA</option>
          <option value="MCA">MCA</option>
        </select>

        {(course === "BTech" || course === "MTech") && (
          <select
            className="auth-input"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select Branch</option>
            <option value="CSE">Computer Science</option>
            <option value="IT">Information Technology</option>
            <option value="ECE">Electronics</option>
            <option value="ME">Mechanical</option>
            <option value="CE">Civil</option>
          </select>
        )}

        <select
          className="auth-input"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <input
          className="auth-input"
          type="text"
          placeholder="University Roll No"
          value={rollno}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="auth-btn"
          disabled={submitting}
        >
          {submitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="auth-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </AuthLayout>
  );
};

export default Signup;