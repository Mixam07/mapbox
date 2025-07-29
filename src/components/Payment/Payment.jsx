import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Navigate, useParams } from 'react-router-dom';
import card from "../../assets/icons/card.svg";
import { auth, db } from '../../firebase/initialization';
import { get, ref, set } from 'firebase/database';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = (props) => {
    const { plan } = useParams();
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const selectedPlan = props.plans?.find(item => item.value === plan);
    const [user, setUser] = useState(null);
    const [boolean, setBoolean] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged((maybeUser) => {
            setBoolean(true);

            if (maybeUser != null) return setUser(maybeUser);

            setUser(null);
        });
    }, []);

    if(plan === props.plans[0].value) return <Navigate to="/" />
    if(!selectedPlan) return <Navigate to="/buy" />
    if(!user && boolean) return <Navigate to="/login" />

    const pay = async (e) => {
        e.preventDefault();

        try{
            const paymentMethod = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardNumberElement),
            });
    
            if(paymentMethod.error){
                return setErrorMessage(paymentMethod.error.message)
            }
        
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/create-subscription", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    paymentMethodId: paymentMethod.paymentMethod.id,
                    plan
                }),
            });
        
            const subscriptionData = await response.json();
        
            if (subscriptionData.error) return setErrorMessage(subscriptionData.error);
    
            const { clientSecret, subscriptionId } = subscriptionData;
    
            if (!clientSecret) return setErrorMessage("Error: failed to retrieve client_secret.");
    
            const confirmResult = await stripe.confirmCardPayment(clientSecret);
    
            if (confirmResult.error) return setErrorMessage(confirmResult.error.message);
    
            const dbRef = ref(db, 'users');
            const snapshot = await get(dbRef);
    
            if (snapshot.exists()) {
                const data = snapshot.val();
        
                for(let key in data){
                    if(user.email == data[key].email){
                        const newDbRef = ref(db, 'users/'+key);
    
                        await set(newDbRef, {
                            ...data[key],
                            isPremium: true,
                            plan
                        });
                    }
                }
            }
    
            window.location.href = '/';
        }catch(e) {
            console.log(e)
            setErrorMessage(e.message)
        }
    };

    return (
        <section className="pt-44 flex flex-col items-center">
            <h1 className="text-300 text-4xl font-semibold uppercase mb-10">Full payment</h1>
            <h2 className="text-xl font-semibold uppercase mb-6">LAST STEP</h2>
            <div className="max-w-[45rem] w-full bg-400 rounded-[2.5rem] p-6 border-300 border-[1px] border-solid flex gap-x-6 cursor-pointer mb-6">
                <input className="hidden input" type="radio" name="plan" value={selectedPlan.value} checked={true} />
                <div>
                    <div className="w-10 h-10 rounded-full border-4 border-solid border-300 flex items-center justify-center">
                        <span className="block w-6 h-6 rounded-full circle"></span>
                    </div>
                </div>
                <div className="w-full">
                    <h3 className="uppercase text-300 font-extrabold mb-2 text-6">{selectedPlan.title}</h3>
                    <h4>{selectedPlan.description}</h4>
                </div>
                <div className="whitespace-nowrap self-center uppercase text-4xl font-bold text-300">
                    ${selectedPlan.price}
                    <span className="text-300 text-2xl font-medium">/PER MONTH.</span>
                </div>
            </div>
            <form onSubmit={pay} className="max-w-[26rem] w-full">
                <div className="mb-4">
                    <label for="number" className="block mb-1 font-semibold">Card Number</label>
                    <CardNumberElement id="number" className="w-full bg-400 py-1.5 px-3 rounded-2xl" />
                </div>
                <div className="flex gap-x-4 mb-10">
                    <div className="w-full">
                        <label for="date" className="block mb-1 font-semibold">Expiration Date</label>
                        <CardExpiryElement id="date" className="w-full bg-400 py-1.5 px-3 rounded-2xl" />
                    </div>
                    <div className="w-full">
                        <label for="cvc" className="block mb-1 font-semibold">Security Date</label>
                        <CardCvcElement id="cvc" className="w-full bg-400 py-1.5 px-3 rounded-2xl" />
                    </div>
                    <div className="min-w-14 self-end">
                        <img className="w-full" src={card} alt="card" />
                    </div>
                </div>
                <button type="submit" className="bg-300 text-400 w-full py-2.5 text-2xl uppercase font-bold rounded-[2.5rem]" disabled={!stripe}>Pay</button>
                {errorMessage && <div>{errorMessage}</div>}
            </form>
        </section>
    );
};


export default (props) => (
    <Elements stripe={stripePromise}>
        <Payment {...props} />
    </Elements>
);
