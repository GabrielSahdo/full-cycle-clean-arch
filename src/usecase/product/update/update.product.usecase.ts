import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import {
    InputUpdateProductDto,
    OutputUpdateProductDto,
} from "./update.product.dto";

export default class UpdateProductUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    async execute(
        input: InputUpdateProductDto,
    ): Promise<OutputUpdateProductDto> {
        const product = await this.productRepository.find(input.id);
        
        if (product.name !== input.name) {
            const duplicatedProduct = await this.productRepository.findByName(input.name);
            
            if (duplicatedProduct && duplicatedProduct.id !== input.id) {
                throw new Error("Product name already exists");
            }
        }
        
        product.changeName(input.name);
        product.changePrice(input.price);
        
        await this.productRepository.update(product);
        
        return {
            id: product.id,
            name: product.name,
            price: product.price,
        };
    }
}
