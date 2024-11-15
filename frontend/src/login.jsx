import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
// If using React Router, import the Link component from 'react-router-dom':
// import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.email) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setSuccess(true);
            console.log(formData);
            // Add login logic here, e.g., API call to authenticate user
        } else {
            setSuccess(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f0f4ff, #e6f7ff)',
                padding: 2,
            }}
        >
            <Container maxWidth="xs">
                <Box
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                        color: '#333',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ color: '#1976d2', mb: 3 }}>
                        Log In
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        {success && <Alert severity="success" sx={{ mb: 2 }}>Login successful!</Alert>}

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleChange}
                            value={formData.email}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            value={formData.password}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            sx={{ backgroundColor: '#f9f9f9', borderRadius: 1 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#1565c0' },
                                borderRadius: 2,
                            }}
                        >
                            Log In
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Don't have an account?{' '}
                        <Link href="/signup" underline="hover" color="primary">
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;