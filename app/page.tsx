'use client'

export default function Login() {
  return (
    <button
      onClick={() => {
        window.location.href = "/api/auth/google";
      }}
    >
      Login with Google
    </button>
  );
}
