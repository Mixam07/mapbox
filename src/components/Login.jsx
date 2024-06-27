const Login = () => {
    return(
        <section className="w-full h-[100vh] flex items-center justify-center">
            <form className="flex max-w-md w-full gap-y-10 flex-col">
                <div className="w-full">
                    <p className="text-sm mb-2">Username</p>
                    <input className="w-full bg-[#374151] text-[#849CA4] px-3 py-2.5 rounded-md border-[1px] border-solid border-[#4B5563]
                        placeholder:text-[#849CA4]" type="text" placeholder="Enter your username" />
                </div>
                <div className="w-full">
                    <p className="text-sm mb-2">Password</p>
                    <input className="w-full bg-[#374151] text-[#849CA4] px-3 py-2.5 rounded-md border-[1px] border-solid border-[#4B5563]
                        placeholder:text-[#849CA4]" type="password" placeholder="****************" />
                </div>
                <div>
                    <button className="bg-[#4B5563] block w-full py-4 rounded-md">Login</button>
                </div>
            </form>
        </section>
    )
}

export default Login;