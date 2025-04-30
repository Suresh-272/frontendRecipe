import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import Api from "../Api/Api";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
`;

const AuthCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.75rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
  background-color: ${props => props.type === 'error' ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.type === 'error' ? '#ef4444' : '#22c55e'};
`;

const FlexRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const OtpInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;
// Login Component with OTP
export const Login = () => {
  const [username, setUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!username || !username.includes('@')) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }

    try {
      const response = await Api.post("/auth/send-otp", { username });
      setMessage({ text: response.data.message, type: "success" });
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setMessage({ 
        text: err.response?.data?.message || "Failed to send OTP", 
        type: "error" 
      });
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ text: "Please enter the OTP", type: "error" });
      return;
    }

    try {
      const response = await Api.post("/auth/verify-otp", { username, otp });
      setCookies("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userID);
      setMessage({ text: "Login successful!", type: "success" });
      
      // Short delay to show success message before redirecting
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ 
        text: err.response?.data?.message || "Failed to verify OTP", 
        type: "error" 
      });
    }
  };

  return (
    <Container>
      <AuthCard>
        <Title>{otpSent ? "Enter OTP" : "Login"}</Title>
        
        {message.text && (
          <Message type={message.type}>{message.text}</Message>
        )}
        
        {!otpSent ? (
          <StyledForm onSubmit={handleSendOtp}>
            <FormGroup>
              <Label htmlFor="username">Email Address</Label>
              <Input
                type="email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email address"
              />
            </FormGroup>
            <Button type="submit">Send OTP</Button>
          </StyledForm>
        ) : (
          <StyledForm onSubmit={handleVerifyOtp}>
            <FormGroup>
              <Label htmlFor="otp">One-Time Password</Label>
              <Input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              <FooterText>
                Check your email for a 6-digit code
              </FooterText>
            </FormGroup>
            <FlexRow>
              <SecondaryButton 
                type="button" 
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
              >
                Back
              </SecondaryButton>
              <Button type="submit">Verify OTP</Button>
            </FlexRow>
          </StyledForm>
        )}
        
        <FooterText>
          Don't have an account? <StyledLink to="/register">Register</StyledLink>
        </FooterText>
      </AuthCard>
    </Container>
  );
};
