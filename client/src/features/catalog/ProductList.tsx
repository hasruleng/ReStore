import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { Product } from "../../app/models/product";

interface Props {
    products: Product[];
}

export default function ProductList({products}: Props){
    <List>
          {products.map((product: any) =>( //b4 desctructuring: (props.product: any)
            <ListItem key={product.id}>
              <ListItemAvatar>
                <Avatar src={product.pictureUrl}    />
              </ListItemAvatar>
              <ListItemText>
                {product.name} - {product.price}
              </ListItemText>
            </ListItem>
            
          ))}
        </List>
}