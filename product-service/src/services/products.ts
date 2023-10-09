import productsMock from "./products-mock.json";

export interface ProductInterface {
    id: string,
    title: string,
    description: string,
    price: number,
    logo: string,
    count: number
}

export const getProductById = ( id: string ): ProductInterface => productsMock.find( product => product.id === id );

export const getAllProducts = (): ProductInterface[] => productsMock;
