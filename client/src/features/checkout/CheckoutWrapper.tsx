import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"
import CheckoutPage from "./CheckoutPage"

const stripePromise = loadStripe('pk_test_51M7hj8BItdeV1CBcgDOkhHpBQUKgGd9pzEA6a2Oom38cJ5BcQwQfICJ3ydB6m8M3GWQX4bVXJbSg5CDtqQ1YDDVY009bEI98hv');

export default function CheckoutWrapper() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )

}