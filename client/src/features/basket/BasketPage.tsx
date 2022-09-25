import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router-dom";
// import { useStoreContext } from "../../app/context/StoreContext";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync} from "./basketSlice";
import BasketSummary from "./BasketSummary";
export default function BasketPage() {

    // const { basket, setBasket, removeItem } = useStoreContext(); //dengan destructuring bisa cuma ambil satu state aja dari tiga
    // const [loading, setLoading] = useState(false); //tadinya cuma menggunakan 1 status loading utk satu Halaman

    const {basket, status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>


    return (
        <>        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {basket.items.map(item => (
                        <TableRow
                            key={item.productId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box display='flex' alignItems='center'>
                                    <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                                    <span>{item.name}</span>
                                </Box>
                            </TableCell>
                            <TableCell align="right">${(item.price / 100).toFixed(2)}</TableCell>
                            <TableCell align="center">
                                <LoadingButton
                                    loading={status==='pendingRemoveItem'+item.productId+'rem'} //ini cuma true | false tapi pake trik logika biar ga cuma ada satu status untuk satu halaman
                                    onClick={() => dispatch(removeBasketItemAsync({productId: item.productId, quantity: 1, name: 'rem'}))}
                                    color='secondary'>
                                    <Remove />
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton
                                    loading={status.includes('pendingAddItem'+item.productId)}
                                    onClick={() => dispatch(addBasketItemAsync({productId: item.productId}))}
                                    color='secondary'>
                                    <Add />
                                </LoadingButton>
                            </TableCell>
                            <TableCell align="right">${(item.price * item.quantity / 100).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton
                                    loading={status==='pendingRemoveItem'+item.productId+'del'}
                                    color='error'
                                    onClick={() => dispatch(removeBasketItemAsync({
                                        productId: item.productId, quantity: item.quantity, name: 'del'}))}>
                                    <Delete />
                                </LoadingButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            <Grid container>
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6}>
                    <BasketSummary basket={basket}/>
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