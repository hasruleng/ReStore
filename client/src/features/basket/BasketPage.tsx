import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import BasketSummary from "./BasketSummary";
export default function BasketPage() {

    const { basket, setBasket, removeItem } = useStoreContext(); //dengan destructuring bisa cuma ambil satu state aja dari tiga
    // const [loading, setLoading] = useState(false); //tadinya cuma menggunakan 1 status loading utk satu Halaman
    const [status, setStatus] = useState({ //
        loading: false,
        name: ''
    });

    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>


    function handleAddItem(productId: number, name: string) {
        // setLoading(true);
        setStatus({ loading: true, name })
        agent.Basket.addItem(productId)
            .then(basket => setBasket(basket))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, name: '' }));
    }


    function handleRemoveItem(productId: number, quantity = 1, name: string) {
        setStatus({ loading: true, name });
        agent.Basket.removeItem(productId, quantity)
            .then(() => removeItem(productId, quantity))
            .catch(error => console.log(error))
            .finally(() => setStatus({ loading: false, name: '' })); //tadinya finally ngejalanin setLoading
    }

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
                                    loading={status.loading && status.name === 'rem' + item.productId} //ini cuma true | false tapi pake trik logika biar ga cuma ada satu status untuk satu halaman
                                    onClick={() => handleRemoveItem(item.productId, 1, 'rem' + item.productId)} color='secondary'>
                                    <Remove />
                                </LoadingButton>
                                {item.quantity}
                                <LoadingButton
                                    loading={status.loading && status.name === 'add' + item.productId}
                                    onClick={() => handleAddItem(item.productId, 'add' + item.productId)} 
                                    color='secondary'>
                                    <Add />
                                </LoadingButton>
                            </TableCell>
                            <TableCell align="right">${(item.price * item.quantity / 100).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <LoadingButton
                                    loading={status.loading && status.name === 'del' + item.productId}
                                    color='error'
                                    onClick={() => handleRemoveItem(item.productId, item.quantity, 'del' + item.productId)}>
                                    <Delete />
                                </LoadingButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {/* <TableRow>
                        <TableCell colSpan={2}>&nbsp;</TableCell>
                        <TableCell colSpan={3} align="right">
                            <BasketSummary />
                        </TableCell>
                    </TableRow> */}
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