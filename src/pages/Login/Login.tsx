const Login = () => {
    return (
        <section className="max-w-[1320px] max-h-[767px] bg-brand">
            <div className="flex items-center justify-center">
                <div>
                    <img className="max-w-[538px]" src="/public/images/Doctor-login.png" alt="login-image" />
                </div>
                <div className="bg-white max-w-[586px] max-h-[670px">
                    <h1>Welcome</h1>
                    <label>Login Admin Now</label>
                    <input type="text" placeholder="Enter your email" />
                    <input type="password" placeholder="Enter your password" />
                    <button className="bg-brand">Login</button>
                </div>
            </div>
        </section>
    )
}

export default Login