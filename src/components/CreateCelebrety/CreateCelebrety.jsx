import { useFormik } from "formik";
import twitter from "../../assets/icons/social_madia/twitter.svg";
import facebook from "../../assets/icons/social_madia/facebook.svg";
import instagram from "../../assets/icons/social_madia/instagram.svg";
import check from "../../assets/icons/check.svg";
import upload from "../../assets/icons/upload.svg";
import { useRef, useState } from "react";
import location from "../../assets/icons/location.svg";
import link from "../../assets/icons/link.svg";

const CreateCelebrety = (props) => {
    const [maybeAddresses, setMaybeAddresses] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [preview, setPreview] = useState("");
    const filePicker = useRef(null);
    const categories = props.filterList.map((item, i) => {
        return <option key={i+1} value={item.title}>{item.title}</option>
    });
    const subcategory = props.filterList.map(elem => {
        if(activeCategory === elem.title){
            return elem.list.map((item, i) => {
                return <option key={i+1} value={item.title}>{item.title}</option>
            });
        }
    });
    const formik = useFormik({
        initialValues: {
            address: "",
            birth: "",
            category: "",
            category_individual: "",
            subcategory: "",
            subcategory_individual: "",
            date: "",
            facebook: "",
            full_name: "",
            gender: "",
            instagram: "",
            links: "",
            tags: "",
            time: "",
            twitter: "",
            photo: ""
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
                ["photo", "Upload photo"], 
                ["twitter", "The field cannot be empty"],
                ["facebook", "The field cannot be empty"],
                ["instagram", "The field cannot be empty"],
                ["gender", "Select gender"],
                ["full_name", "The field cannot be empty"],
                ["birth", "Enter date of birth"],
                ["category", "Select category"],
                ["subcategory", "Select subcategory"],
                ["tags", "The field cannot be empty"],
                ["links", "The field cannot be empty"],
                ["address", "The field cannot be empty"],
                ["time", "Select time"],
                ["date", "Select date"]
            ]);

            if(values.category === "other" && values.category_individual === ""){
                errors.category_individual = "The field cannot be empty";
            }
            if(values.subcategory === "other" && values.subcategory_individual === ""){
                errors.subcategory_individual = "The field cannot be empty";
            }

            return errors
        },
        onSubmit: async (values, { resetForm, setErrors }) => {
            if(!values.location){
                return setErrors({
                    address: "Select address"
                })
            }

            try{
                await props.createCelebretyThunkCreator({
                    ...values
                }, props.celebretiesNumber);
            }catch(e) {
            }

            setPreview("");
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

    const onChange = (e) => {
        const image = e.target.files[0];
        formik.setFieldValue('photo', image);

        const img = URL.createObjectURL(image);

        setPreview(img);
    }

    const handlePick = () => {
        filePicker.current.click()
    }

    const changeCategory = (e) => {
        setActiveCategory(e.target.value);

        formik.handleChange(e);
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
                <h1 className="text-300 uppercase font-bold text-4xl mb-2">Add new celebrety</h1>
                <h2 className="text-xl font-semibold text-200/60 mb-6">Basic Details</h2>
                <div className="flex gap-x-28 mb-10">
                    <div>
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
                            {formik.errors.photo && <div className="text-600 mt-1">{formik.errors.photo}</div>}
                        </div>
                        <div className="flex flex-col gap-y-4 mb-4">
                            <div>
                                <div className="flex items-center gap-x-4">
                                    <label className="" htmlFor="twitter">
                                        <img className="w-6" src={twitter} alt="twitter" />
                                    </label>
                                    <input
                                        className="bg-inherit placeholder:text-200 text-200"
                                        id="twitter"
                                        name="twitter"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.twitter}
                                        placeholder="Add Twitter"
                                    />
                                </div>
                                {formik.errors.twitter && <div className="text-600 mt-1">{formik.errors.twitter}</div>}
                            </div>
                            <div>
                                <div className="flex items-center gap-x-4">
                                    <label className="" htmlFor="facebook">
                                        <img className="w-6" src={facebook} alt="facebook" />
                                    </label>
                                    <input
                                        className="bg-inherit placeholder:text-200 text-200"
                                        id="facebook"
                                        name="facebook"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.facebook}
                                        placeholder="Add Facebook"
                                    />
                                </div>
                                {formik.errors.facebook && <div className="text-600 mt-1">{formik.errors.facebook}</div>}
                            </div>
                            <div>
                                <div className="flex items-center gap-x-4">
                                    <label className="" htmlFor="instagram">
                                        <img className="w-6" src={instagram} alt="instagram" />
                                    </label>
                                    <input
                                        className="bg-inherit placeholder:text-200 text-200"
                                        id="instagram"
                                        name="instagram"
                                        type="text"
                                        onChange={formik.handleChange}
                                        value={formik.values.instagram}
                                        placeholder="Add Instagram"
                                    />
                                </div>
                                {formik.errors.instagram && <div className="text-600 mt-1">{formik.errors.instagram}</div>}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-200/60 mb-2">Gender</p>
                            <div className="flex gap-x-6">
                                <div>
                                    <input
                                        className="gender hidden"
                                        id="male"
                                        name="gender"
                                        type="radio"
                                        onChange={formik.handleChange}
                                        value="male"
                                    />
                                    <label className="flex item-center gap-x-2" htmlFor="male">
                                        <span className="circle bg-white w-6 h-6 rounded-full flex items-center justify-center ">
                                            <img src={check} alt="check" />
                                        </span>
                                        <p>Male</p>
                                    </label>
                                </div>
                                <div>
                                    <input
                                        className="gender hidden"
                                        id="female"
                                        name="gender"
                                        type="radio"
                                        onChange={formik.handleChange}
                                        value="female"
                                    />
                                    <label className="flex item-center gap-x-2" htmlFor="female">
                                        <span className="circle bg-white w-6 h-6 rounded-full flex items-center justify-center ">
                                            <img src={check} alt="check" />
                                        </span>
                                        <p>Female</p>
                                    </label>
                                </div>
                            </div>
                            {formik.errors.gender && <div className="text-600 mt-1">{formik.errors.gender}</div>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2.5">
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="full_name">Full Name</label>
                            <input
                                className="w-72 px-3 py-1.5 rounded-2xl placeholder:text-200 text-200"
                                id="full_name"
                                name="full_name"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.full_name}
                                placeholder="Enter Full Name"
                            />
                            {formik.errors.full_name && <div className="text-600 mt-1">{formik.errors.full_name}</div>}
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="birth">Date of Birth</label>
                            <input
                                className="w-72 px-3 py-1.5 rounded-2xl text-200/60 date"
                                id="birth"
                                name="birth"
                                type="date"
                                onChange={formik.handleChange}
                                value={formik.values.birth}
                                placeholder="MM/DD/YYY"
                            />
                            {formik.errors.birth && <div className="text-600 mt-1">{formik.errors.birth}</div>}
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="category">Category</label>
                            <select 
                                className="w-72 px-3 py-2 rounded-2xl text-200/60"
                                id="category"
                                name="category"
                                onChange={changeCategory}
                                value={formik.values.category}
                            >
                                <option value="">-Select-</option>
                                {categories}
                                <option value="other">Other</option>
                            </select>
                            {formik.errors.category && <div className="text-600 mt-1">{formik.errors.category}</div>}
                        </div>
                        {
                            formik.values.category === "other" &&
                            <div>
                                <label className="block mb-2 font-semibold" htmlFor="category_individual">Individual category</label>
                                <input
                                    className="w-72 px-3 py-1.5 rounded-2xl placeholder:text-200 text-200"
                                    id="category_individual"
                                    name="category_individual"
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.category_individual}
                                    placeholder="Enter Individual Category"
                                />
                                {formik.errors.category_individual && <div className="text-600 mt-1">{formik.errors.category_individual}</div>}
                            </div>
                        }
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="subcategory">Subcategory</label>
                            <select 
                                className="w-72 px-3 py-2 rounded-2xl text-200/60"
                                id="subcategory"
                                name="subcategory"
                                onChange={formik.handleChange}
                                value={formik.values.subcategory}
                            >
                                <option value="">-Select-</option>
                                {subcategory}
                                {
                                    !subcategory.some(item => item) &&
                                    <option value="">Select a category to select a subcategory</option>
                                }
                                <option value="other">Other</option>
                            </select>
                            {formik.errors.subcategory && <div className="text-600 mt-1">{formik.errors.subcategory}</div>}
                        </div>
                        {
                            formik.values.subcategory === "other" &&
                            <div>
                                <label className="block mb-2 font-semibold" htmlFor="subcategory_individual">Individual subcategory</label>
                                <input
                                    className="w-72 px-3 py-1.5 rounded-2xl placeholder:text-200 text-200"
                                    id="subcategory_individual"
                                    name="subcategory_individual"
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.subcategory_individual}
                                    placeholder="Enter Individual Subcategory"
                                />
                                {formik.errors.subcategory_individual && <div className="text-600 mt-1">{formik.errors.subcategory_individual}</div>}
                            </div>
                        }
                    </div>
                    <div className="flex flex-col gap-y-2.5">
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="tags">Tags</label>
                            <input
                                className="w-72 px-3 py-1.5 rounded-2xl placeholder:text-200 text-200"
                                id="tags"
                                name="tags"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.tags}
                                placeholder="Tag, tag"
                            />
                            {formik.errors.tags && <div className="text-600 mt-1">{formik.errors.tags}</div>}
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold" htmlFor="links">Official site of similar</label>
                            <div className="relative">
                                <input
                                    className="w-72 px-3 py-1.5 rounded-2xl placeholder:text-200 text-200"
                                    id="links"
                                    name="links"
                                    type="url"
                                    onChange={formik.handleChange}
                                    value={formik.values.links}
                                    placeholder="Link, link"
                                />
                                <div className="absolute top-2/4 translate-y-[-50%] right-4">
                                    <img src={link} alt="link" />
                                </div>
                            </div>
                            {formik.errors.links && <div className="text-600 mt-1">{formik.errors.links}</div>}
                        </div>
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
                                    placeholder="Italy, Aviano, 33081"
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

export default CreateCelebrety;