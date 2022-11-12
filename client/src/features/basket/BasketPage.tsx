import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
// import { useStoreContext } from "../../app/context/StoreContext";
import { useAppSelector } from "../../app/store/configureStore";
import BasketSummary from "./BasketSummary";
import BasketTable from "./BasketTable";
export default function BasketPage() {

    // const { basket, setBasket, removeItem } = useStoreContext(); //dengan destructuring bisa cuma ambil satu state aja dari tiga
    // const [loading, setLoading] = useState(false); //tadinya cuma menggunakan 1 status loading utk satu Halaman

    const {basket} = useAppSelector(state => state.basket);

    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    return (
        <>        
        <BasketTable items={basket.items} />
            <Grid container>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6}>
                    <BasketSummary />
                    <Button
                        component={Link}
                        to='/checkout'
                        variant='contained'
                        size='large'
                        fullWidth
                    >
                        Checkout
                    </Button>
                </Grid>
            </Grid>
        </>

    )
}