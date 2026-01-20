export type ProductData = {
    date_release: Date;
    date_revision: Date;
    description: string;
    id: string;
    logo: string;
    name: string;
}


export type ProductCreatedResponse = {
 data:    ProductData;
 message: string;
}
