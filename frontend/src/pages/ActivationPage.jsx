import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_Token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_Token) {
      const activationEmailLink = async () => {
        try {
          const response = axios.post(`${server}/user/activation`, {
            activation_Token,
          });
          console.log(activation_Token, response);
        } catch (error) {
          console.log(error.response.data.message);
          setError(true);
        }
      };
      activationEmailLink();
    }
  }, [activation_Token]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>
          Your token is expired click to
          <span>
            <Link
              to="/sign-up"
              style={{
                color: "black",
                fontWeight: "bold",
                padding: "0 3px",
              }}
            >
              Sign up{" "}
            </Link>
            again
          </span>
        </p>
      ) : (
        <p>
          Your account activated successfully click to
          <span>
            <Link to='/login'
              style={{
                color: "black",
                fontWeight: "bold",
                padding: "0 3px",
              }}
            >
              Login{" "}
            </Link>
          </span>
        </p>
      )}
    </div>
  );
};

export default ActivationPage;
