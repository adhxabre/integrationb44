import { useContext, useState } from "react";
import { Alert } from "react-bootstrap";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

import { API, setAuthToken } from "../../config/api";

export default function Login() {
  let navigate = useNavigate();

  const title = "Login";
  document.title = "DumbMerch | " + title;

  const [_, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Insert data for login process, you can also make this without any configuration, because axios would automatically handling it.
      const response = await API.post("/login", form);

      console.log("login success : ", response);

      // Send data to useContext
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data,
      });

      setAuthToken(localStorage.token);

      // Status check
      if (response.data.data.role === "admin") {
        navigate("/complain-admin");
      } else {
        navigate("/");
      }

      const alert = (
        <Alert variant="success" className="py-1">
          Login success
        </Alert>
      );
      setMessage(alert);
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Login failed
        </Alert>
      );
      setMessage(alert);
      console.log("login failed : ", error);
    }
  });

  return (
    <div className="d-flex justify-content-center">
      <div className="card-auth p-4">
        <div
          style={{ fontSize: "36px", lineHeight: "49px", fontWeight: "700" }}
          className="mb-3"
        >
          Login
        </div>
        {message && message}
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className="mt-3 form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
          </div>
          <div className="d-grid gap-2 mt-5">
            <button className="btn btn-login">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
