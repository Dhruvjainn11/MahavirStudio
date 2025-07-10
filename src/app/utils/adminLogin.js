export const adminLogin = async ({ email, password }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Login error:', err);
      return { error: 'Network error during login' };
    }
  };
  