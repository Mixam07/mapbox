import { useFormik } from "formik";
import upload from "../../assets/icons/upload.svg";
import { useRef, useState } from "react";
import location from "../../assets/icons/location.svg";
import link from "../../assets/icons/link.svg";

const Report = (props) => {
    const [maybeAddresses, setMaybeAddresses] = useState([]);
    const filePicker = useRef(null);
    const [preview, setPreview] = useState("");
    const formik = useFormik({
        initialValues: {
            proof: "",
            city: "",
            newspapers: "",
            address: "",
            time: "",
            date: "",
            postal: ""
        },
        validate: (values) => {
            const errors = {};

            const checkInputs = (arrow) => {
                arrow.forEach(item => {
                    if(values[item[0]] === ""){
                        errors[item[0]] = item[1];
                    }
                });
            }

            checkInputs([
                ["proof", "Upload proof"],
                ["newspapers", "The field cannot be empty"],
                ["address", "The field cannot be empty"],
                ["postal", "The field cannot be empty"],
                ["time", "Select time"],
                ["date", "Select date"]
            ]);

            return errors
        },
        onSubmit: async (values, { resetForm, setErrors }) => {
            if(!values.location){
                return setErrors({
                    address: "Select address"
                })
            }
            
            try{
                await props.addAddressThunkCreator({
                    ...values
                }, props.activeId);
            }catch(e) {
            }

            setPreview("");
            props.setActiveId(-1);
            props.getCelebretiesThunkCreator();
            props.setIsActive(false);
            props.setIsPopupActive(true);
            resetForm();
        },
    });

    const onClick = (e) => {
        if(e.target.classList.contains("canvas")){
            props.setIsActive(false);
        }
    }

    const onChange= (e) => {
        const image = e.target.files[0];
        formik.setFieldValue('proof', image);

        const img = URL.createObjectURL(image);

        setPreview(img);
    }

    const handlePick = () => {
        filePicker.current.click()
    }

    const changeAddress = async (e) => {
        formik.handleChange(e);

        const encodedAddress = encodeURIComponent(e.target.value);
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?types=address&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`);
        const data = await res.json();

        setMaybeAddresses(data.features);
    }

    const chooseAddress = (item) => {
        formik.setFieldValue('address', item.place_name);
        formik.setFieldValue('location', {
            latitude: item.center[1],
            longitude: item.center[0]
        });
        formik.setFieldValue('context', item.context);
        
        setMaybeAddresses([]);
    }

    const maybe_addresses = maybeAddresses.map((item, i) => {
        return (
            <button key={i+1} onClick={ () => { chooseAddress(item) } } className="py-2 text-left text-sm">{item.place_name}</button>
        )
    });

    return(
        <section onClick={onClick} className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[10000] duration-500 canvas flex items-center
            justify-center ${props.isActive? "pointer-events-auto opacity-1": "pointer-events-none opacity-0"}`}>
            <form className="bg-100 p-10 rounded-2xl" onSubmit={formik.handleSubmit}>
                <h1 className="text-300 uppercase font-bold text-4xl mb-2">Add new address</h1>
                
                <div className="flex gap-x-28 mb-10">
                    <div className="mb-6">
                        <input
                            onChange={onChange}
                            className="hidden"
                            id="photo"
                            name="photo"
                            ref={filePicker}
                            type="file"
                            accept="image/*,.png,.jpg,.gif,.web"
                        />
                        {
                            preview?
                            <img onClick={handlePick} src={preview} alt="preview" className="cursor-pointer w-36 h-36 rounded-full bg-white shadow-lg" />:
                            <div onClick={handlePick} className="cursor-pointer w-36 h-36 rounded-full bg-white flex items-center justify-center shadow-lg">
                                <img src={upload} alt="upload" />
                            </div>
                        }
                        <p className="uppercase text-center font-semibold mt-2">Proof</p>
                        {formik.errors.proof && <div className="text-600 mt-1 text-center">{formik.errors.proof}</div>}
                    </div>
                    <div className="flex flex-col gap-y-2.5">
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="address">Address</label>
                            <div className="relative">
                                <input
                                    className="w-72 px-3 py-1.5 rounded-2xl placeholder:text-200 text-200"
                                    id="address"
                                    name="address"
                                    type="text"
                                    onChange={changeAddress}
                                    value={formik.values.address}
                                    placeholder="88576 Kathryne Summit"
                                />
                                <div className="absolute top-2/4 translate-y-[-50%] right-4">
                                    <img src={location} alt="location" />
                                </div>
                                {
                                    maybe_addresses.length !== 0 &&
                                    <div className="absolute bottom-0 left-0 translate-y-full bg-white rounded-2xl p-3 z-10">
                                        {maybe_addresses}
                                    </div>
                                }
                            </div>
                            {formik.errors.address && <div className="text-600 mt-1">{formik.errors.address}</div>}
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="postal">Postal Code Country</label>
                            <input
                                className="w-72 px-3 py-1.5 rounded-2xl placeholder:text-200 text-200"
                                id="postal"
                                name="postal"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.postal}
                                placeholder="74373"
                            />
                            {formik.errors.postal && <div className="text-600 mt-1">{formik.errors.postal}</div>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2.5">
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="newspapers">Newspapers</label>
                            <div className="relative">
                                <input
                                    className="w-72 px-3 py-1.5 rounded-2xl placeholder:text-200 text-200"
                                    id="newspapers"
                                    name="newspapers"
                                    type="url"
                                    onChange={formik.handleChange}
                                    value={formik.values.newspapers}
                                    placeholder="Link, link"
                                />
                                <div className="absolute top-2/4 translate-y-[-50%] right-4">
                                    <img src={link} alt="link" />
                                </div>
                            </div>
                            {formik.errors.newspapers && <div className="text-600 mt-1">{formik.errors.newspapers}</div>}
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="time">Time</label>
                            <input
                                className="w-72 px-3 py-1.5 rounded-2xl text-200/60 time"
                                id="time"
                                name="time"
                                type="time"
                                onChange={formik.handleChange}
                                value={formik.values.time}
                                placeholder="xx:xx:xx"
                            />
                            {formik.errors.time && <div className="text-600 mt-1">{formik.errors.time}</div>}
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="date">Date</label>
                            <input
                                className="w-72 px-3 py-1.5 rounded-2xl text-200/60 date"
                                id="date"
                                name="date"
                                type="date"
                                onChange={formik.handleChange}
                                value={formik.values.date}
                                placeholder="03/08/2024"
                            />
                            {formik.errors.date && <div className="text-600 mt-1">{formik.errors.date}</div>}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-x-4">
                    <button onClick={ () => { props.setIsActive(false) } } className="px-5 py-2 rounded-2xl border-[1px] border-300 border-solid">Cancel</button>
                    <button className="px-5 py-2 rounded-2xl bg-300 text-white" type="submit">Submit</button>
                </div>    
            </form>
        </section>
    )
}

export default Report;