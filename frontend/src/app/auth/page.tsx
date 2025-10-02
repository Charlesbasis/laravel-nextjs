export default function Auth() {
    return (
        <>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4" style={{ width: '400px', marginTop: '50px' }}>
                    <h3 className="text-center">Login</h3>
                    <form>
                        <input className="form-control mb-2" name="email" type="email" placeholder="Email" required />
                        <input className="form-control mb-2" name="password" type="password" placeholder="Password" required />
                        <button className="btn btn-primary w-100" type="submit">Login</button>
                    </form>

                    <p className="mt-3 text-center">Don't have an account? Register</p>

                    <hr />

                    <h3 className="text-center">Register</h3>
                    <form>
                        <input className="form-control mb-2" name="name" type="text" placeholder="Name" required />
                        <input className="form-control mb-2" name="email" type="email" placeholder="Email" required />
                        <input className="form-control mb-2" name="password" type="password" placeholder="Password" required />
                        <input className="form-control mb-2" name="password_confirmation" type="password" placeholder="Confirm Password" required />
                        <button className="btn btn-primary w-100" type="submit">Register</button>
                    </form>
                </div>
            </div>
        </>
    );
}
