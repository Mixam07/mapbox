const Popup = (props) => {
    const onClick = (e) => {
        if(e.target.classList.contains("canvas")){
            props.setIsActive(false);
        }
    }
    return(
        <section onClick={onClick} className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[10000] duration-500 canvas flex items-center
            justify-center ${props.isActive? "pointer-events-auto opacity-1": "pointer-events-none opacity-0"}`}>
            <div className="bg-100 p-10 rounded-2xl">
                <h1 className="text-4xl font-bold text-center mb-2.5">Data sent successfully</h1>
                <h2 className="text-lg font-semibold text-center">After confirmation by the administrator will appear on the site</h2>
            </div>
        </section>
    )
}

export default Popup