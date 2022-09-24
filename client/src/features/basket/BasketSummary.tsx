import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { Basket } from "../../app/models/basket";
import { currencyFormat, totalQuantity } from "../../app/util/util";


interface Props {
    basket: Basket;
}

export default function BasketSummary({ basket }: Props) { //ini gua pake cara passing parameters, pantesan ga ada storeContext kayak di contoh, jadi ga pake redux toolkit deh
    var subtotal = 0;
    var deliveryFee = 0;

    for (let i = 0; i < basket.items.length; i++) {
        subtotal += basket.items[i].price * basket.items[i].quantity;
    }
    if (subtotal/100 > 100) {//Orders over $100 qualify for free delivery
        deliveryFee = 0;
        // console.log('subtotal ='+subtotal);//ternyata angka di subtotal itu dikali 100 
    }
    else {//you gotta pay delivery fee
        deliveryFee = (totalQuantity(basket)) * 100;
    }
    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal + deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}