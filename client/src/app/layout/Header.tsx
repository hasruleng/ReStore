import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import { totalQuantity } from "../util/util";
import SignedInMenu from "./SignedInMenu";

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

const midLinks = [
    { title: 'catalog', path: '/catalog' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' }
]

const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' }
]

export default function Header({ darkMode, handleThemeChange }: Props) {

    //    const {basket} = useStoreContext();//react context
    const { basket } = useAppSelector(state => state.basket); //sblmnya di App udah pake redux, abis ganti dari yg atas ke ini langsung muncul basket counter
    const { user } = useAppSelector(state => state.account); //sblmnya di App udah pake redux, abis ganti dari yg atas ke ini langsung muncul basket counter
    const itemCount = totalQuantity(basket); //? berfungsi sebagai pengaman kalau basketnya null

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography variant='h6' component={NavLink}
                        to='/'
                        exact
                        sx={{ color: 'inherit', textDecoration: 'none' }}>
                        RE-STORE
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>

                <List sx={{ display: 'flex' }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={{
                                color: 'inherit',
                                typography: 'h6',
                                '&:hover': {
                                    color: 'grey.500'
                                },
                                '&.active': {
                                    color: 'text.secondary'
                                }
                            }}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size='large' sx={{ color: 'inherit' }}>
                        <Badge badgeContent={itemCount} color='secondary'>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    {user ? (
                        <SignedInMenu />
                    ) : (
                        <List sx={{ display: 'flex' }}>
                            {rightLinks.map(({ title, path }) => (
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={{ color: 'inherit', typography: 'h6' }}
                                >
                                    {title.toUpperCase()}
                                </ListItem>
                            ))}
                        </List>
                    )}

                </Box>
            </Toolbar>
        </AppBar>
    )
}