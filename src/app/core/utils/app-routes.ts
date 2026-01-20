export class AppRoutes {
    public static readonly list_products = '';
    public static readonly add_product = 'add-product';
    public static readonly edit_product = 'edit-product/:id';
    public static readonly go_to_edit_product = (id:string) => `edit-product/${id}`;
}