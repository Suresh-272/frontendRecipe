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
// Register Component
export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    
    if (!username || !username.includes('@')) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }
    
    if (!password || password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }

    try {
      const response = await Api.post("/auth/register", { username, password });
      setMessage({ text: response.data.message, type: "success" });
      
      // Redirect to login after successful registration
      if (response.data.message.includes("successfully")) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage({ 
        text: err.response?.data?.message || "Registration failed", 
        type: "error" 
      });
    }
  };

  return (
    <Container>
      <AuthCard>
        <Title>Create Account</Title>
        
        {message.text && (
          <Message type={message.type}>{message.text}</Message>
        )}
        
        <StyledForm onSubmit={onSubmit}>
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
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password (min 6 characters)"
              minLength={6}
            />
          </FormGroup>
          <Button type="submit">Register</Button>
        </StyledForm>
        <FooterText>
          Already have an account? <StyledLink to="/login">Login</StyledLink>
        </FooterText>
      </AuthCard>
    </Container>
  );
};