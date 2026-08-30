const Login = () => {
  const loginWithGoogle = () => {
    window.location.href = "https://reachinbox-backend1-1d5j.onrender.com/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-[400px] rounded-md border border-gray-200 bg-white px-8 py-8">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Login
        </h1>
        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full h-10 bg-green-100 rounded-md text-sm text-gray-700 hover:bg-green-200"
        >
          <span className="mr-2">G</span>
          Login with Google
        </button>

        <div className="my-3 flex items-center">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="px-3 text-xs text-gray-400">
            or sign up using email
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-[11px] text-gray-500">
            Email ID
          </label>

          <input
            type="email"
            placeholder="Email ID"
            className="h-10 w-full rounded-md bg-gray-50 px-3 text-sm outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-[11px] text-gray-500">
            Password
          </label>

          <input
            type="password"
            placeholder="Password"
            className="h-10 w-full rounded-md bg-gray-50 px-3 text-sm outline-none"
          />
        </div>

        <button
          type="button"
          className="h-10 w-full rounded-md bg-green-600 text-sm text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
