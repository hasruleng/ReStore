import { Box, Checkbox, FormControlLabel, Grid, Pagination, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions = [
    { value: 'name', label: 'Alphabetical' },
    { value: 'priceDesc', label: 'Price - High to low' },
    { value: 'price', label: 'Price - Low to high' },
]

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, status, filtersLoaded, brands, types, productParams } = useAppSelector(state => state.catalog); //status: 'idle' | 'loading' | 'succeeded' | 'failed'
    const dispatch = useAppDispatch();

    useEffect(() => { //1st param: callback function
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    useEffect(() => { //1st param: callback function
        if (!filtersLoaded) dispatch(fetchFilters());
    }, [filtersLoaded, dispatch])//2nd param: Dependency injector. if using empty array that means this is only ever going to be called once.
    //if forget to put the 2nd param, useEffect gonna be call everytime of render or rerender (could be infinite loop)

    if (status.includes('pending')) return <LoadingComponent message='Loading Products...' />

    return (
        <Grid container columnSpacing={4}>
            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <ProductSearch />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    <RadioButtonGroup 
                        selectedValue={productParams.orderBy}
                        options={sortOptions}
                        onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
        
                    />
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    {brands.map(brand => (
                        <FormControlLabel control={<Checkbox />} label={brand} key={brand} />
                    ))}
                </Paper>
                <Paper sx={{ mb: 2, p: 2 }}>
                    {types.map(type => (
                        <FormControlLabel control={<Checkbox />} label={type} key={type} />
                    ))}
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={9} sx={{mb: 2}}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography>
                        Displaying 1-6 of 20 items
                    </Typography>
                    <Pagination
                        color='secondary'
                        size='large'
                        count={10}
                        page={2}
                    />
                </Box>
            </Grid>
        </Grid>

    )
}